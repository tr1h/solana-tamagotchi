use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Mint, MintTo, Token, TokenAccount};
use anchor_spl::associated_token::AssociatedToken;
use anchor_lang::solana_program::{
    program::invoke_signed,
    system_instruction,
};

// ✅ NFT Support активирован! (Rust 1.90.0)
// Временно отключаем Metaplex для Playground
// use mpl_token_metadata::{
//     instructions::CreateV1CpiBuilder,
//     types::{Creator, TokenStandard},
// };

declare_id!("uY5hZR2uYzkquJDuDkFBj29tfzZRPE96BBTHYGaYnwX"); // ✅ Обновленный ID

#[program]
pub mod tamagotchi {
    use super::*;



    /// Создать питомца как NFT (10 TAMA -> burn)
    /// Генерируется уникальный питомец на основе wallet address
    pub fn create_pet_nft(ctx: Context<CreatePetNFT>, name: String, uri: String) -> Result<()> {
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

        // Mint NFT (1 токен, non-fungible)
        let mint_cpi_accounts = MintTo {
            mint: ctx.accounts.nft_mint.to_account_info(),
            to: ctx.accounts.nft_token_account.to_account_info(),
            authority: ctx.accounts.owner.to_account_info(),
        };
        let mint_cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            mint_cpi_accounts,
        );
        anchor_spl::token::mint_to(mint_cpi_ctx, 1)?;

        // ✅ NFT создан! (Metaplex временно отключен для Playground)
        let rarity_str = match rarity {
            4 => "Legendary",
            3 => "Epic",
            2 => "Rare",
            1 => "Uncommon",
            _ => "Common",
        };

        msg!("🎨 NFT создан! Rarity: {}, Name: {} #{}", rarity_str, name, pet_id);

        // Инициализация питомца
        pet.owner = owner;
        pet.nft_mint = ctx.accounts.nft_mint.key();
        pet.metadata = ctx.accounts.metadata.key();
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
        pet.lives = 3; // Начальные жизни
        pet.bump = ctx.bumps.pet;

        msg!("🐣 NFT Питомец #{} создан! Вид: {}, Редкость: {}", pet_id, species, rarity_str);

        Ok(())
    }

    /// 🎨 Создать питомца как NFT за SOL (0.01 SOL → treasury)
    /// Генерируется уникальный питомец на основе wallet address
    pub fn create_pet_nft_sol(ctx: Context<CreatePetNFTSol>, name: String, uri: String) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let owner = ctx.accounts.owner.key();
        let clock = Clock::get()?;

        // 💰 Переводим 0.01 SOL в treasury
        let sol_amount = 10_000_000; // 0.01 SOL в lamports
        
        invoke_signed(
            &system_instruction::transfer(
                &ctx.accounts.owner.key(),
                &ctx.accounts.treasury.key(),
                sol_amount,
            ),
            &[
                ctx.accounts.owner.to_account_info(),
                ctx.accounts.treasury.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
            &[],
        )?;

        // Генерируем DNA из wallet address
        let dna = owner.to_bytes()[0] as u64 * 1000000 + 
                 owner.to_bytes()[1] as u64 * 1000 + 
                 owner.to_bytes()[2] as u64;

        // Инициализация питомца
        pet.owner = owner;
        pet.mint = Pubkey::default();
        pet.nft_mint = ctx.accounts.nft_mint.key();
        pet.metadata = ctx.accounts.metadata.key();
        pet.dna = dna;
        pet.pet_id = (dna % 1000000) as u32;
        pet.species = (dna % 5) as u8; // 0-4
        pet.accessory = (dna % 3) as u8; // 0-2
        pet.background = (dna % 4) as u8; // 0-3
        
        // Редкость на основе DNA
        let rarity_roll = (dna % 100) as u8;
        pet.rarity = if rarity_roll >= 95 {
            4 // Legendary (5%)
        } else if rarity_roll >= 85 {
            3 // Epic (10%)
        } else if rarity_roll >= 70 {
            2 // Rare (15%)
        } else if rarity_roll >= 50 {
            1 // Uncommon (20%)
        } else {
            0 // Common (50%)
        };

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

        // Mint NFT (1 токен, non-fungible)
        let mint_cpi_accounts = MintTo {
            mint: ctx.accounts.nft_mint.to_account_info(),
            to: ctx.accounts.nft_token_account.to_account_info(),
            authority: ctx.accounts.owner.to_account_info(),
        };
        let mint_cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            mint_cpi_accounts,
        );
        anchor_spl::token::mint_to(mint_cpi_ctx, 1)?;

        // ✅ NFT создан за SOL! (Metaplex временно отключен для Playground)
        let rarity_str = match pet.rarity {
            4 => "Legendary",
            3 => "Epic",
            2 => "Rare",
            1 => "Uncommon",
            _ => "Common",
        };

        msg!("🎨 NFT создан за SOL! Rarity: {}, Name: {}", rarity_str, name);

        msg!("🎨 NFT питомец создан за SOL! Rarity: {}", rarity_str);
        msg!("💰 0.01 SOL переведено в treasury");

        Ok(())
    }

    /// Создать питомца (старая версия, без NFT)
    /// Генерируется уникальный питомец на основе wallet address
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

        // Инициализация питомца (без NFT)
        pet.owner = owner;
        pet.mint = Pubkey::default();
        pet.nft_mint = Pubkey::default(); // Нет NFT в этой версии
        pet.metadata = Pubkey::default(); // Нет метаданных
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
        pet.lives = 3; // Начальные жизни
        pet.bump = ctx.bumps.pet;

        msg!("🐣 Питомец #{} создан! Вид: {}, Редкость: {}", pet_id, species, rarity);

        Ok(())
    }

    /// Покормить питомца (5 TAMA -> burn)
    pub fn feed_pet(ctx: Context<ActionPet>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let clock = Clock::get()?;

        // Проверка владельца и живости
        require!(pet.owner == ctx.accounts.owner.key(), ErrorCode::NotOwner);
        require!(pet.is_alive, ErrorCode::PetIsDead);

        // Burn 5 TAMA
        let burn_amount = 5_000_000_000; // 5 TAMA (9 decimals)
        burn_tokens(
            &ctx.accounts.token_program.to_account_info(),
            &ctx.accounts.token_mint,
            &ctx.accounts.user_token_account,
            &ctx.accounts.owner,
            burn_amount
        )?;

        // Обновление параметров
        pet.hunger = pet.hunger.saturating_add(30).min(100);
        pet.health = pet.health.saturating_add(5).min(100);
        pet.experience = pet.experience.saturating_add(5);
        pet.last_action_time = clock.unix_timestamp;
        pet.total_tokens_burned = pet.total_tokens_burned.saturating_add(burn_amount);
        pet.actions_count = pet.actions_count.saturating_add(1);

        // 🎁 Награда за кормление: 1 TAMA (временно отключено)
        // let reward_amount = 1 * 10_u64.pow(9);
        // mint_tama_reward(&ctx, reward_amount)?;

        // Проверка эволюции
        check_evolution(pet);

        msg!("🍖 Питомец покормлен! Hunger: {}, Health: {}", pet.hunger, pet.health);

        Ok(())
    }

    /// Играть с питомцем (3 TAMA -> burn)
    pub fn play_with_pet(ctx: Context<ActionPet>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let clock = Clock::get()?;

        require!(pet.owner == ctx.accounts.owner.key(), ErrorCode::NotOwner);
        require!(pet.is_alive, ErrorCode::PetIsDead);
        require!(pet.energy >= 20, ErrorCode::NotEnoughEnergy);

        // Burn 3 TAMA
        let burn_amount = 3_000_000_000;
        burn_tokens(
            &ctx.accounts.token_program.to_account_info(),
            &ctx.accounts.token_mint,
            &ctx.accounts.user_token_account,
            &ctx.accounts.owner,
            burn_amount
        )?;

        // Обновление параметров
        pet.happiness = pet.happiness.saturating_add(25).min(100);
        pet.energy = pet.energy.saturating_sub(15);
        pet.experience = pet.experience.saturating_add(8);
        pet.last_action_time = clock.unix_timestamp;
        pet.total_tokens_burned = pet.total_tokens_burned.saturating_add(burn_amount);
        pet.actions_count = pet.actions_count.saturating_add(1);

        // 🎁 Награда за игру: 2 TAMA (временно отключено)
        // let reward_amount = 2 * 10_u64.pow(9);
        // mint_tama_reward(&ctx, reward_amount)?;

        check_evolution(pet);

        msg!("🎮 Играли с питомцем! Happiness: {}, Energy: {}", pet.happiness, pet.energy);

        Ok(())
    }

    /// Лечить питомца (8 TAMA -> burn)
    pub fn heal_pet(ctx: Context<ActionPet>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let clock = Clock::get()?;

        require!(pet.owner == ctx.accounts.owner.key(), ErrorCode::NotOwner);
        require!(pet.is_alive, ErrorCode::PetIsDead);
        require!(pet.health < 90, ErrorCode::HealthAlreadyHigh);

        // Burn 8 TAMA
        let burn_amount = 8_000_000_000;
        burn_tokens(
            &ctx.accounts.token_program.to_account_info(),
            &ctx.accounts.token_mint,
            &ctx.accounts.user_token_account,
            &ctx.accounts.owner,
            burn_amount
        )?;

        // Обновление параметров
        pet.health = 100;
        pet.experience = pet.experience.saturating_add(3);
        pet.last_action_time = clock.unix_timestamp;
        pet.total_tokens_burned = pet.total_tokens_burned.saturating_add(burn_amount);
        pet.actions_count = pet.actions_count.saturating_add(1);

        // 🎁 Награда за лечение: 3 TAMA (временно отключено)
        // let reward_amount = 3 * 10_u64.pow(9);
        // mint_tama_reward(&ctx, reward_amount)?;

        msg!("💊 Питомец вылечен! Health: 100");

        Ok(())
    }

    /// Отдыхать (2 TAMA -> burn)
    pub fn rest_pet(ctx: Context<ActionPet>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let clock = Clock::get()?;

        require!(pet.owner == ctx.accounts.owner.key(), ErrorCode::NotOwner);
        require!(pet.is_alive, ErrorCode::PetIsDead);

        // Burn 2 TAMA
        let burn_amount = 2_000_000_000;
        burn_tokens(
            &ctx.accounts.token_program.to_account_info(),
            &ctx.accounts.token_mint,
            &ctx.accounts.user_token_account,
            &ctx.accounts.owner,
            burn_amount
        )?;

        // Обновление параметров
        pet.energy = pet.energy.saturating_add(40).min(100);
        pet.health = pet.health.saturating_add(10).min(100);
        pet.experience = pet.experience.saturating_add(3);
        pet.last_action_time = clock.unix_timestamp;
        pet.total_tokens_burned = pet.total_tokens_burned.saturating_add(burn_amount);
        pet.actions_count = pet.actions_count.saturating_add(1);

        // 🎁 Награда за сон: 1 TAMA (временно отключено)
        // let reward_amount = 1 * 10_u64.pow(9);
        // mint_tama_reward(&ctx, reward_amount)?;

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

        // Decay каждую минуту (CASUAL режим: -1 за минуту)
        let decay_cycles = (time_passed / 60) as u8;

        // Уменьшение параметров (более мягкий баланс)
        pet.hunger = pet.hunger.saturating_sub(decay_cycles);
        pet.happiness = pet.happiness.saturating_sub(decay_cycles);
        pet.energy = pet.energy.saturating_sub(decay_cycles);

        // Если низкие параметры - уменьшаем здоровье (более мягко)
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
pub struct CreatePetNFT<'info> {
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
    
    // 🎯 TAMA Token Mint
    #[account(
        mut,
        seeds = [b"tama_mint"],
        bump
    )]
    pub tama_mint: Account<'info, Mint>,
    
    // 🎯 User's TAMA Token Account (для burn)
    #[account(
        mut,
        associated_token::mint = tama_mint,
        associated_token::authority = owner,
    )]
    pub user_tama_account: Account<'info, TokenAccount>,
    
    /// NFT Mint аккаунт
    #[account(
        init,
        payer = owner,
        mint::decimals = 0,
        mint::authority = owner,
        mint::freeze_authority = owner,
    )]
    pub nft_mint: Account<'info, Mint>,
    
    /// Token Account для NFT
    #[account(
        init,
        payer = owner,
        associated_token::mint = nft_mint,
        associated_token::authority = owner,
    )]
    pub nft_token_account: Account<'info, TokenAccount>,
    
    /// CHECK: Метаданные NFT (временно отключены для Playground)
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    
    /// CHECK: Token Metadata Program (временно отключен)
    #[account(mut)]
    pub token_metadata_program: UncheckedAccount<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

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
pub struct CreatePetNFTSol<'info> {
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
    
    /// CHECK: Treasury wallet (команда получает SOL)
    #[account(mut)]
    pub treasury: UncheckedAccount<'info>,
    
    /// NFT Mint аккаунт
    #[account(
        init,
        payer = owner,
        mint::decimals = 0,
        mint::authority = owner,
        mint::freeze_authority = owner,
    )]
    pub nft_mint: Account<'info, Mint>,
    
    /// Token Account для NFT
    #[account(
        init,
        payer = owner,
        associated_token::mint = nft_mint,
        associated_token::authority = owner,
    )]
    pub nft_token_account: Account<'info, TokenAccount>,
    
    /// CHECK: Метаданные NFT (временно отключены для Playground)
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    
    /// CHECK: Token Metadata Program (временно отключен)
    #[account(mut)]
    pub token_metadata_program: UncheckedAccount<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
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
    
    // 🎯 TAMA система временно отключена (награды не работают)
    // Убраны tama_mint и user_tama_account
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

/// 🎁 Helper функция для минта TAMA наград
fn mint_tama_reward(ctx: &Context<ActionPet>, amount: u64) -> Result<()> {
    // Временно отключаем минт наград (будет реализовано позже)
    msg!("🎁 Награда: {} TAMA токенов! (временно отключено)", amount);
    Ok(())
}

fn burn_tokens<'info>(
    token_program: &AccountInfo<'info>,
    token_mint: &Account<'info, Mint>,
    user_token_account: &Account<'info, TokenAccount>,
    authority: &Signer<'info>,
    amount: u64
) -> Result<()> {
    let cpi_accounts = Burn {
        mint: token_mint.to_account_info(),
        from: user_token_account.to_account_info(),
        authority: authority.to_account_info(),
    };
    
    let cpi_ctx = CpiContext::new(token_program.clone(), cpi_accounts);
    
    token::burn(cpi_ctx, amount)?;
    
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
    
    #[msg("Питомец жив")]
    PetIsAlive,
    
    #[msg("Нет жизней для воскрешения")]
    NoLivesLeft,
}