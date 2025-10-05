use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Mint, MintTo, Token, TokenAccount};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("uY5hZR2uYzkquJDuDkFBj29tfzZRPE96BBTHYGaYnwX");

#[program]
pub mod tamagotchi {
    use super::*;

    /// Создать питомца (простая версия)
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

        // Уникальные параметры на основе DNA
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

        // Инициализация питомца
        pet.owner = owner;
        pet.mint = Pubkey::default();
        pet.nft_mint = Pubkey::default();
        pet.metadata = Pubkey::default();
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
        pet.total_tokens_burned = 0;
        pet.actions_count = 0;
        pet.is_alive = true;
        pet.lives = 3;
        pet.bump = ctx.bumps.pet;

        msg!("🐣 Питомец #{} создан! Вид: {}, Редкость: {}", pet_id, species, rarity);

        Ok(())
    }

    /// Покормить питомца (бесплатно)
    pub fn feed_pet(ctx: Context<ActionPet>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let clock = Clock::get()?;

        require!(pet.owner == ctx.accounts.owner.key(), ErrorCode::NotOwner);
        require!(pet.is_alive, ErrorCode::PetIsDead);

        // Обновление параметров
        pet.hunger = pet.hunger.saturating_add(30).min(100);
        pet.health = pet.health.saturating_add(5).min(100);
        pet.experience = pet.experience.saturating_add(5);
        pet.last_action_time = clock.unix_timestamp;
        pet.actions_count = pet.actions_count.saturating_add(1);

        // Проверка эволюции
        check_evolution(pet);

        msg!("🍖 Питомец покормлен! Hunger: {}, Health: {}", pet.hunger, pet.health);

        Ok(())
    }

    /// Играть с питомцем (бесплатно)
    pub fn play_with_pet(ctx: Context<ActionPet>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let clock = Clock::get()?;

        require!(pet.owner == ctx.accounts.owner.key(), ErrorCode::NotOwner);
        require!(pet.is_alive, ErrorCode::PetIsDead);
        require!(pet.energy >= 20, ErrorCode::NotEnoughEnergy);

        // Обновление параметров
        pet.happiness = pet.happiness.saturating_add(25).min(100);
        pet.energy = pet.energy.saturating_sub(15);
        pet.experience = pet.experience.saturating_add(8);
        pet.last_action_time = clock.unix_timestamp;
        pet.actions_count = pet.actions_count.saturating_add(1);

        check_evolution(pet);

        msg!("🎮 Играли с питомцем! Happiness: {}, Energy: {}", pet.happiness, pet.energy);

        Ok(())
    }

    /// Лечить питомца (бесплатно)
    pub fn heal_pet(ctx: Context<ActionPet>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let clock = Clock::get()?;

        require!(pet.owner == ctx.accounts.owner.key(), ErrorCode::NotOwner);
        require!(pet.is_alive, ErrorCode::PetIsDead);
        require!(pet.health < 90, ErrorCode::HealthAlreadyHigh);

        // Обновление параметров
        pet.health = 100;
        pet.experience = pet.experience.saturating_add(3);
        pet.last_action_time = clock.unix_timestamp;
        pet.actions_count = pet.actions_count.saturating_add(1);

        msg!("💊 Питомец вылечен! Health: 100");

        Ok(())
    }

    /// Отдыхать (бесплатно)
    pub fn rest_pet(ctx: Context<ActionPet>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let clock = Clock::get()?;

        require!(pet.owner == ctx.accounts.owner.key(), ErrorCode::NotOwner);
        require!(pet.is_alive, ErrorCode::PetIsDead);

        // Обновление параметров
        pet.energy = pet.energy.saturating_add(40).min(100);
        pet.health = pet.health.saturating_add(10).min(100);
        pet.experience = pet.experience.saturating_add(3);
        pet.last_action_time = clock.unix_timestamp;
        pet.actions_count = pet.actions_count.saturating_add(1);

        msg!("😴 Питомец отдыхает! Energy: {}, Health: {}", pet.energy, pet.health);

        Ok(())
    }

    /// Обновить decay (бесплатно)
    pub fn update_decay(ctx: Context<UpdateDecay>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let clock = Clock::get()?;

        let time_passed = clock.unix_timestamp - pet.last_decay_time;
        if time_passed < 60 {
            return Ok(()); // Минимум 1 минута между обновлениями
        }

        // Decay каждую минуту
        let decay_cycles = (time_passed / 60) as u8;

        // Уменьшение параметров
        pet.hunger = pet.hunger.saturating_sub(decay_cycles);
        pet.happiness = pet.happiness.saturating_sub(decay_cycles);
        pet.energy = pet.energy.saturating_sub(decay_cycles);

        // Если низкие параметры - уменьшаем здоровье
        if pet.hunger == 0 || pet.happiness == 0 || pet.energy == 0 {
            pet.health = pet.health.saturating_sub(decay_cycles);
        }

        // Проверка смерти
        if pet.health == 0 && pet.is_alive {
            pet.is_alive = false;
            msg!("💀 Питомец #{} умер! Осталось жизней: {}", pet.pet_id, pet.lives);
        }

        // Обновление возраста
        pet.age = pet.age.saturating_add(time_passed as u32);
        pet.last_decay_time = clock.unix_timestamp;

        msg!("⏰ Decay обновлен. Hunger: {}, Health: {}, Lives: {}", pet.hunger, pet.health, pet.lives);

        Ok(())
    }

    /// Воскресить питомца (система жизней)
    pub fn resurrect_pet(ctx: Context<ResurrectPet>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let clock = Clock::get()?;

        require!(pet.owner == ctx.accounts.owner.key(), ErrorCode::NotOwner);
        require!(!pet.is_alive, ErrorCode::PetIsAlive);
        require!(pet.lives > 0, ErrorCode::NoLivesLeft);

        // Тратим жизнь
        pet.lives = pet.lives.saturating_sub(1);
        
        // Воскрешаем с 50% статов
        pet.is_alive = true;
        pet.health = 50;
        pet.hunger = 50;
        pet.happiness = 50;
        pet.energy = 50;
        pet.last_action_time = clock.unix_timestamp;
        pet.last_decay_time = clock.unix_timestamp;

        msg!("✨ Питомец #{} воскрешен! Осталось жизней: {}", pet.pet_id, pet.lives);

        Ok(())
    }

    /// Закрыть аккаунт питомца (вернуть rent)
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
pub struct ResurrectPet<'info> {
    #[account(
        mut,
        seeds = [b"pet", owner.key().as_ref()],
        bump = pet.bump,
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
    pub owner: Pubkey,              // 32
    pub mint: Pubkey,               // 32 (старый токен для игры)
    pub nft_mint: Pubkey,           // 32 (NFT mint если используется)
    pub metadata: Pubkey,           // 32 (Metaplex metadata)
    pub dna: u64,                   // 8
    pub pet_id: u32,                // 4
    pub species: u8,                // 1
    pub accessory: u8,              // 1
    pub background: u8,             // 1
    pub rarity: u8,                 // 1
    pub level: u8,                  // 1
    pub experience: u16,            // 2
    pub health: u8,                 // 1
    pub hunger: u8,                 // 1
    pub happiness: u8,              // 1
    pub energy: u8,                 // 1
    pub age: u32,                   // 4
    pub birth_time: i64,            // 8
    pub last_action_time: i64,      // 8
    pub last_decay_time: i64,       // 8
    pub total_tokens_burned: u64,   // 8
    pub actions_count: u32,         // 4
    pub is_alive: bool,             // 1
    pub lives: u8,                  // 1 (система жизней: 0-3)
    pub bump: u8,                   // 1
}

impl Pet {
    pub const LEN: usize = 32 + 32 + 32 + 32 + 8 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 1 + 1 + 1 + 4 + 8 + 8 + 8 + 8 + 4 + 1 + 1 + 1;
}

// ============================================================================
// Helper Functions
// ============================================================================

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
    
    #[msg("Питомец жив")]
    PetIsAlive,
    
    #[msg("Нет жизней для воскрешения")]
    NoLivesLeft,
}





