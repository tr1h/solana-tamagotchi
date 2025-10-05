use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Mint, Token, TokenAccount};

declare_id!("11111111111111111111111111111111"); // Заменится после build

#[program]
pub mod tamagotchi {
    use super::*;

    /// Создать питомца (УПРОЩЕННАЯ ВЕРСИЯ - БЕЗ NFT)
    pub fn create_pet(ctx: Context<CreatePet>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let owner = ctx.accounts.owner.key();
        let clock = Clock::get()?;

        // Генерируем DNA из wallet address
        let wallet_bytes = owner.to_bytes();
        let mut hash: u64 = 0;
        for (i, &byte) in wallet_bytes.iter().enumerate() {
            hash = hash.wrapping_add((byte as u64).wrapping_shl((i % 8) as u32));
        }

        // Уникальные параметры
        let pet_id = (hash % 100000) as u32;
        let species = ((hash >> 8) % 10) as u8;
        let accessory = ((hash >> 16) % 10) as u8;
        let background = ((hash >> 24) % 8) as u8;
        
        // Редкость
        let rarity_roll = (hash % 100) as u8;
        let rarity = if rarity_roll >= 99 {
            4 // Legendary (1%)
        } else if rarity_roll >= 97 {
            3 // Epic (2%)
        } else if rarity_roll >= 90 {
            2 // Rare (7%)
        } else if rarity_roll >= 70 {
            1 // Uncommon (20%)
        } else {
            0 // Common (70%)
        };

        // Инициализация
        pet.owner = owner;
        pet.dna = hash;
        pet.pet_id = pet_id;
        pet.species = species;
        pet.accessory = accessory;
        pet.background = background;
        pet.rarity = rarity;
        pet.level = 1;
        pet.experience = 0;
        pet.health = 100;
        pet.hunger = 100;
        pet.happiness = 100;
        pet.energy = 100;
        pet.age = 0;
        pet.birth_time = clock.unix_timestamp;
        pet.last_action_time = clock.unix_timestamp;
        pet.last_decay_time = clock.unix_timestamp;
        pet.actions_count = 0;
        pet.is_alive = true;
        pet.total_tokens_burned = 0;
        pet.bump = ctx.bumps.pet;

        msg!("🐣 Питомец #{} создан! Вид: {}, Редкость: {}", pet_id, species, rarity);

        Ok(())
    }

    /// Покормить (5 TAMA burn)
    pub fn feed_pet(ctx: Context<ActionPet>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let clock = Clock::get()?;

        require!(pet.owner == ctx.accounts.owner.key(), ErrorCode::NotOwner);
        require!(pet.is_alive, ErrorCode::PetIsDead);

        let burn_amount = 5_000_000_000;
        burn_tokens(
            &ctx.accounts.token_program.to_account_info(),
            &ctx.accounts.token_mint,
            &ctx.accounts.user_token_account,
            &ctx.accounts.owner,
            burn_amount
        )?;

        pet.hunger = pet.hunger.saturating_add(30).min(100);
        pet.health = pet.health.saturating_add(5).min(100);
        pet.experience = pet.experience.saturating_add(5);
        pet.last_action_time = clock.unix_timestamp;
        pet.total_tokens_burned = pet.total_tokens_burned.saturating_add(burn_amount);
        pet.actions_count = pet.actions_count.saturating_add(1);

        check_evolution(pet);

        msg!("🍖 Покормлен! Hunger: {}, Health: {}", pet.hunger, pet.health);

        Ok(())
    }

    /// Играть (3 TAMA burn)
    pub fn play_with_pet(ctx: Context<ActionPet>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let clock = Clock::get()?;

        require!(pet.owner == ctx.accounts.owner.key(), ErrorCode::NotOwner);
        require!(pet.is_alive, ErrorCode::PetIsDead);
        require!(pet.energy >= 20, ErrorCode::NotEnoughEnergy);

        let burn_amount = 3_000_000_000;
        burn_tokens(
            &ctx.accounts.token_program.to_account_info(),
            &ctx.accounts.token_mint,
            &ctx.accounts.user_token_account,
            &ctx.accounts.owner,
            burn_amount
        )?;

        pet.happiness = pet.happiness.saturating_add(25).min(100);
        pet.energy = pet.energy.saturating_sub(15);
        pet.experience = pet.experience.saturating_add(8);
        pet.last_action_time = clock.unix_timestamp;
        pet.total_tokens_burned = pet.total_tokens_burned.saturating_add(burn_amount);
        pet.actions_count = pet.actions_count.saturating_add(1);

        check_evolution(pet);

        msg!("🎮 Играли! Happiness: {}, Energy: {}", pet.happiness, pet.energy);

        Ok(())
    }

    /// Лечить (8 TAMA burn)
    pub fn heal_pet(ctx: Context<ActionPet>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let clock = Clock::get()?;

        require!(pet.owner == ctx.accounts.owner.key(), ErrorCode::NotOwner);
        require!(pet.is_alive, ErrorCode::PetIsDead);
        require!(pet.health < 90, ErrorCode::HealthAlreadyHigh);

        let burn_amount = 8_000_000_000;
        burn_tokens(
            &ctx.accounts.token_program.to_account_info(),
            &ctx.accounts.token_mint,
            &ctx.accounts.user_token_account,
            &ctx.accounts.owner,
            burn_amount
        )?;

        pet.health = 100;
        pet.experience = pet.experience.saturating_add(3);
        pet.last_action_time = clock.unix_timestamp;
        pet.total_tokens_burned = pet.total_tokens_burned.saturating_add(burn_amount);
        pet.actions_count = pet.actions_count.saturating_add(1);

        msg!("💊 Вылечен! Health: 100");

        Ok(())
    }

    /// Отдохнуть (2 TAMA burn)
    pub fn rest_pet(ctx: Context<ActionPet>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let clock = Clock::get()?;

        require!(pet.owner == ctx.accounts.owner.key(), ErrorCode::NotOwner);
        require!(pet.is_alive, ErrorCode::PetIsDead);

        let burn_amount = 2_000_000_000;
        burn_tokens(
            &ctx.accounts.token_program.to_account_info(),
            &ctx.accounts.token_mint,
            &ctx.accounts.user_token_account,
            &ctx.accounts.owner,
            burn_amount
        )?;

        pet.energy = pet.energy.saturating_add(40).min(100);
        pet.health = pet.health.saturating_add(10).min(100);
        pet.experience = pet.experience.saturating_add(3);
        pet.last_action_time = clock.unix_timestamp;
        pet.total_tokens_burned = pet.total_tokens_burned.saturating_add(burn_amount);
        pet.actions_count = pet.actions_count.saturating_add(1);

        msg!("😴 Отдохнул! Energy: {}, Health: {}", pet.energy, pet.health);

        Ok(())
    }

    /// Обновить decay (БЕСПЛАТНО!)
    pub fn update_decay(ctx: Context<UpdateDecay>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let clock = Clock::get()?;

        let time_passed = clock.unix_timestamp - pet.last_decay_time;
        if time_passed < 60 {
            return Ok(());
        }

        let decay_cycles = (time_passed / 60) as u8;

        pet.hunger = pet.hunger.saturating_sub(decay_cycles);
        pet.happiness = pet.happiness.saturating_sub(decay_cycles / 2);
        pet.energy = pet.energy.saturating_sub(decay_cycles / 3);

        if pet.hunger < 30 || pet.happiness < 30 {
            pet.health = pet.health.saturating_sub(decay_cycles / 2);
        }

        if pet.health == 0 {
            pet.is_alive = false;
        }

        pet.age = pet.age.saturating_add(time_passed as u32);
        pet.last_decay_time = clock.unix_timestamp;

        msg!("⏰ Decay обновлен. Hunger: {}, Health: {}", pet.hunger, pet.health);

        Ok(())
    }

    /// Закрыть аккаунт (вернуть rent)
    pub fn close_pet(ctx: Context<ClosePet>) -> Result<()> {
        let pet = &ctx.accounts.pet;
        require!(pet.owner == ctx.accounts.owner.key(), ErrorCode::NotOwner);
        
        msg!("💀 Питомец #{} закрыт", pet.pet_id);
        
        Ok(())
    }
}

// ============================================================================
// Contexts
// ============================================================================

#[derive(Accounts)]
pub struct CreatePet<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + Pet::LEN,
        seeds = [b"pet", owner.key().as_ref()],
        bump
    )]
    pub pet: Account<'info, Pet>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ActionPet<'info> {
    #[account(
        mut,
        seeds = [b"pet", owner.key().as_ref()],
        bump = pet.bump,
    )]
    pub pet: Account<'info, Pet>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub token_mint: Account<'info, Mint>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdateDecay<'info> {
    #[account(
        mut,
        seeds = [b"pet", pet.owner.as_ref()],
        bump = pet.bump,
    )]
    pub pet: Account<'info, Pet>,
}

#[derive(Accounts)]
pub struct ClosePet<'info> {
    #[account(
        mut,
        close = owner,
        seeds = [b"pet", owner.key().as_ref()],
        bump = pet.bump,
    )]
    pub pet: Account<'info, Pet>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
}

// ============================================================================
// Accounts
// ============================================================================

#[account]
pub struct Pet {
    pub owner: Pubkey,                 // 32
    pub dna: u64,                      // 8
    pub pet_id: u32,                   // 4
    pub species: u8,                   // 1
    pub accessory: u8,                 // 1
    pub background: u8,                // 1
    pub rarity: u8,                    // 1
    pub level: u8,                     // 1
    pub experience: u16,               // 2
    pub health: u8,                    // 1
    pub hunger: u8,                    // 1
    pub happiness: u8,                 // 1
    pub energy: u8,                    // 1
    pub age: u32,                      // 4
    pub birth_time: i64,               // 8
    pub last_action_time: i64,         // 8
    pub last_decay_time: i64,          // 8
    pub actions_count: u32,            // 4
    pub is_alive: bool,                // 1
    pub total_tokens_burned: u64,     // 8
    pub bump: u8,                      // 1
}

impl Pet {
    pub const LEN: usize = 32 + 8 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 1 + 1 + 1 + 4 + 8 + 8 + 8 + 4 + 1 + 8 + 1;
}

// ============================================================================
// Helper Functions
// ============================================================================

fn burn_tokens<'info>(
    token_program: &AccountInfo<'info>,
    mint: &Account<'info, Mint>,
    user_token_account: &Account<'info, TokenAccount>,
    authority: &Signer<'info>,
    amount: u64,
) -> Result<()> {
    let burn_accounts = Burn {
        mint: mint.to_account_info(),
        from: user_token_account.to_account_info(),
        authority: authority.to_account_info(),
    };
    
    let burn_ctx = CpiContext::new(
        token_program.clone(),
        burn_accounts,
    );
    
    token::burn(burn_ctx, amount)?;
    
    msg!("🔥 Сожжено {} токенов", amount / 1_000_000_000);
    
    Ok(())
}

fn check_evolution(pet: &mut Pet) {
    let old_level = pet.level;
    
    pet.level = match pet.experience {
        0..=99 => 1,
        100..=299 => 2,
        300..=599 => 3,
        600..=999 => 4,
        _ => 5,
    };
    
    if pet.level > old_level {
        msg!("🌟 ЭВОЛЮЦИЯ! Уровень: {} -> {}", old_level, pet.level);
    }
}

// ============================================================================
// Errors
// ============================================================================

#[error_code]
pub enum ErrorCode {
    #[msg("Вы не владелец этого питомца")]
    NotOwner,
    
    #[msg("Недостаточно энергии")]
    NotEnoughEnergy,
    
    #[msg("Здоровье уже высокое")]
    HealthAlreadyHigh,
    
    #[msg("Питомец мертв")]
    PetIsDead,
}


