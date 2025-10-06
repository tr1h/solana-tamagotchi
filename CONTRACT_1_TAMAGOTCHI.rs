// 🎮 КОНТРАКТ 1: TAMAGOTCHI GAME
// Игровая механика + интеграция с Reward Pool

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("11111111111111111111111111111111");

#[program]
pub mod tamagotchi_game {
    use super::*;

    /// 💰 Создать NFT питомца за SOL + получить TAMA награду
    pub fn create_pet_with_rewards(ctx: Context<CreatePetWithRewards>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let owner = ctx.accounts.owner.key();
        let clock = Clock::get()?;

        // 💰 SOL уже переведен через constraint
        // Генерируем уникального питомца
        let wallet_bytes = owner.to_bytes();
        let mut hash: u64 = 0;
        for (i, &byte) in wallet_bytes.iter().enumerate() {
            hash = hash.wrapping_add((byte as u64).wrapping_shl((i % 8) as u32));
        }

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

        // Награда зависит от редкости
        let base_reward = 1000_000_000_000; // 1000 TAMA (9 decimals)
        let rarity_multiplier = match rarity {
            4 => 5, // Legendary: 5000 TAMA
            3 => 3, // Epic: 3000 TAMA
            2 => 2, // Rare: 2000 TAMA
            1 => 1, // Uncommon: 1000 TAMA
            _ => 1, // Common: 1000 TAMA
        };
        
        let reward_amount = base_reward * rarity_multiplier;

        // 🎁 Перевод TAMA из Reward Pool игроку
        let cpi_accounts = Transfer {
            from: ctx.accounts.reward_pool_account.to_account_info(),
            to: ctx.accounts.user_tama_account.to_account_info(),
            authority: ctx.accounts.reward_pool_authority.to_account_info(),
        };
        
        let seeds = &[
            b"reward_authority".as_ref(),
            &[ctx.bumps.reward_pool_authority],
        ];
        let signer = &[&seeds[..]];
        
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer,
        );
        
        token::transfer(cpi_ctx, reward_amount)?;

        // Инициализация питомца
        pet.owner = owner;
        pet.dna = hash;
        pet.pet_id = pet_id;
        pet.species = species;
        pet.accessory = accessory;
        pet.background = background;
        pet.rarity = rarity;
        pet.level = 1;
        pet.health = 100;
        pet.hunger = 100;
        pet.happiness = 100;
        pet.energy = 100;
        pet.thirst = 100;
        pet.birth_time = clock.unix_timestamp;
        pet.last_fed = clock.unix_timestamp;
        pet.last_played = clock.unix_timestamp;
        pet.last_slept = clock.unix_timestamp;
        pet.is_alive = true;
        pet.lives = 3;
        pet.total_rewards_earned = reward_amount;
        pet.bump = ctx.bumps.pet;

        msg!("🎉 Питомец #{} создан! Редкость: {}, Награда: {} TAMA", pet_id, rarity, reward_amount / 1_000_000_000);
        Ok(())
    }

    /// 🍖 Кормить питомца + получить TAMA
    pub fn feed_pet(ctx: Context<ActionPetWithReward>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let clock = Clock::get()?;

        require!(pet.is_alive, ErrorCode::PetIsDead);
        require!(pet.owner == ctx.accounts.owner.key(), ErrorCode::NotOwner);

        pet.hunger = std::cmp::min(pet.hunger + 30, 100);
        pet.last_fed = clock.unix_timestamp;
        if pet.hunger > 80 {
            pet.health = std::cmp::min(pet.health + 5, 100);
        }

        // 🎁 Награда: 50 TAMA
        let reward = 50_000_000_000;
        transfer_reward(&ctx, reward)?;
        pet.total_rewards_earned += reward;

        msg!("🍖 Покормили! +50 TAMA");
        Ok(())
    }

    /// 🎮 Играть с питомцем + получить TAMA
    pub fn play_with_pet(ctx: Context<ActionPetWithReward>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let clock = Clock::get()?;

        require!(pet.is_alive, ErrorCode::PetIsDead);
        require!(pet.owner == ctx.accounts.owner.key(), ErrorCode::NotOwner);

        pet.happiness = std::cmp::min(pet.happiness + 25, 100);
        pet.energy = pet.energy.saturating_sub(15);
        pet.last_played = clock.unix_timestamp;

        // 🎁 Награда: 30 TAMA
        let reward = 30_000_000_000;
        transfer_reward(&ctx, reward)?;
        pet.total_rewards_earned += reward;

        msg!("🎮 Играли! +30 TAMA");
        Ok(())
    }

    /// 💊 Лечить питомца + получить TAMA
    pub fn heal_pet(ctx: Context<ActionPetWithReward>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;

        require!(pet.is_alive, ErrorCode::PetIsDead);
        require!(pet.owner == ctx.accounts.owner.key(), ErrorCode::NotOwner);

        pet.health = std::cmp::min(pet.health + 30, 100);

        // 🎁 Награда: 100 TAMA (лечение дороже)
        let reward = 100_000_000_000;
        transfer_reward(&ctx, reward)?;
        pet.total_rewards_earned += reward;

        msg!("💊 Вылечили! +100 TAMA");
        Ok(())
    }

    /// 😴 Отдых питомца + получить TAMA
    pub fn rest_pet(ctx: Context<ActionPetWithReward>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let clock = Clock::get()?;

        require!(pet.is_alive, ErrorCode::PetIsDead);
        require!(pet.owner == ctx.accounts.owner.key(), ErrorCode::NotOwner);

        pet.energy = std::cmp::min(pet.energy + 40, 100);
        pet.last_slept = clock.unix_timestamp;

        // 🎁 Награда: 20 TAMA
        let reward = 20_000_000_000;
        transfer_reward(&ctx, reward)?;
        pet.total_rewards_earned += reward;

        msg!("😴 Отдохнули! +20 TAMA");
        Ok(())
    }

    /// ✨ Воскресить питомца (бесплатно, за жизнь)
    pub fn resurrect_pet(ctx: Context<ResurrectPet>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let clock = Clock::get()?;

        require!(!pet.is_alive, ErrorCode::PetIsAlive);
        require!(pet.owner == ctx.accounts.owner.key(), ErrorCode::NotOwner);
        require!(pet.lives > 0, ErrorCode::NoLivesLeft);

        pet.is_alive = true;
        pet.health = 50;
        pet.hunger = 50;
        pet.happiness = 50;
        pet.energy = 50;
        pet.thirst = 50;
        pet.lives -= 1;
        pet.last_fed = clock.unix_timestamp;
        pet.last_played = clock.unix_timestamp;
        pet.last_slept = clock.unix_timestamp;

        msg!("✨ Воскрешен! Осталось жизней: {}", pet.lives);
        Ok(())
    }

    /// 🗑️ Закрыть аккаунт
    pub fn close_pet(ctx: Context<ClosePet>) -> Result<()> {
        let pet = &ctx.accounts.pet;
        require!(pet.owner == ctx.accounts.owner.key(), ErrorCode::NotOwner);
        msg!("🗑️ Питомец #{} закрыт", pet.pet_id);
        Ok(())
    }
}

// ============================================================================
// Helper Functions
// ============================================================================

fn transfer_reward(ctx: &Context<ActionPetWithReward>, amount: u64) -> Result<()> {
    let cpi_accounts = Transfer {
        from: ctx.accounts.reward_pool_account.to_account_info(),
        to: ctx.accounts.user_tama_account.to_account_info(),
        authority: ctx.accounts.reward_pool_authority.to_account_info(),
    };
    
    let seeds = &[
        b"reward_authority".as_ref(),
        &[ctx.bumps.reward_pool_authority],
    ];
    let signer = &[&seeds[..]];
    
    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        cpi_accounts,
        signer,
    );
    
    token::transfer(cpi_ctx, amount)?;
    Ok(())
}

// ============================================================================
// Contexts
// ============================================================================

#[derive(Accounts)]
pub struct CreatePetWithRewards<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + Pet::INIT_SPACE,
        seeds = [b"pet", owner.key().as_ref()],
        bump
    )]
    pub pet: Account<'info, Pet>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    /// Treasury получает SOL
    #[account(
        mut,
        constraint = treasury.key() == TREASURY_WALLET @ ErrorCode::InvalidTreasury
    )]
    /// CHECK: Treasury wallet
    pub treasury: AccountInfo<'info>,
    
    /// Reward Pool - откуда берутся TAMA
    #[account(mut)]
    pub reward_pool_account: Account<'info, TokenAccount>,
    
    /// PDA authority для Reward Pool
    #[account(
        seeds = [b"reward_authority"],
        bump
    )]
    /// CHECK: PDA authority
    pub reward_pool_authority: AccountInfo<'info>,
    
    /// Аккаунт игрока для получения TAMA
    #[account(mut)]
    pub user_tama_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ActionPetWithReward<'info> {
    #[account(
        mut,
        seeds = [b"pet", owner.key().as_ref()],
        bump = pet.bump
    )]
    pub pet: Account<'info, Pet>,
    
    pub owner: Signer<'info>,
    
    /// Reward Pool
    #[account(mut)]
    pub reward_pool_account: Account<'info, TokenAccount>,
    
    /// PDA authority
    #[account(
        seeds = [b"reward_authority"],
        bump
    )]
    /// CHECK: PDA authority
    pub reward_pool_authority: AccountInfo<'info>,
    
    /// Аккаунт игрока
    #[account(mut)]
    pub user_tama_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ResurrectPet<'info> {
    #[account(
        mut,
        seeds = [b"pet", owner.key().as_ref()],
        bump = pet.bump
    )]
    pub pet: Account<'info, Pet>,
    #[account(mut)]
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClosePet<'info> {
    #[account(
        mut,
        close = owner,
        seeds = [b"pet", owner.key().as_ref()],
        bump = pet.bump
    )]
    pub pet: Account<'info, Pet>,
    #[account(mut)]
    pub owner: Signer<'info>,
}

// ============================================================================
// Account
// ============================================================================

#[account]
#[derive(InitSpace)]
pub struct Pet {
    pub owner: Pubkey,              // 32
    pub dna: u64,                   // 8
    pub pet_id: u32,                // 4
    pub species: u8,                // 1
    pub accessory: u8,              // 1
    pub background: u8,             // 1
    pub rarity: u8,                 // 1
    pub level: u8,                  // 1
    pub health: u8,                 // 1
    pub hunger: u8,                 // 1
    pub happiness: u8,              // 1
    pub energy: u8,                 // 1
    pub thirst: u8,                 // 1
    pub birth_time: i64,            // 8
    pub last_fed: i64,              // 8
    pub last_played: i64,           // 8
    pub last_slept: i64,            // 8
    pub is_alive: bool,             // 1
    pub lives: u8,                  // 1
    pub total_rewards_earned: u64,  // 8 - сколько всего TAMA заработал
    pub bump: u8,                   // 1
}

// ============================================================================
// Constants
// ============================================================================

// 👛 TREASURY WALLET - замени на свой!
pub const TREASURY_WALLET: Pubkey = pubkey!("H2a7hSCumPuFGVV9yvzABxbTBnt9N3VWLyRrwjKrYJ7i");

// ============================================================================
// Errors
// ============================================================================

#[error_code]
pub enum ErrorCode {
    #[msg("Pet is dead")]
    PetIsDead,
    #[msg("Pet is alive")]
    PetIsAlive,
    #[msg("Not the owner")]
    NotOwner,
    #[msg("No lives left")]
    NoLivesLeft,
    #[msg("Invalid treasury")]
    InvalidTreasury,
}








