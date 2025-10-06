use anchor_lang::prelude::*;

// ⚠️ Это будет заменено при деплое в Playground
declare_id!("11111111111111111111111111111111");

#[program]
pub mod tamagotchi {
    use super::*;

    /// 🆓 Создать питомца бесплатно (instruction 0)
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
        pet.bump = ctx.bumps.pet;

        msg!("🐣 Питомец #{} создан! Вид: {}, Редкость: {}", pet_id, species, rarity);
        Ok(())
    }

    /// 🍖 Кормить питомца (instruction 1)
    pub fn feed_pet(ctx: Context<ActionPet>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let clock = Clock::get()?;

        require!(pet.is_alive, ErrorCode::PetIsDead);
        require!(pet.owner == ctx.accounts.owner.key(), ErrorCode::NotOwner);

        // Увеличиваем голод
        pet.hunger = std::cmp::min(pet.hunger + 30, 100);
        pet.last_fed = clock.unix_timestamp;

        // Небольшое увеличение здоровья
        if pet.hunger > 80 {
            pet.health = std::cmp::min(pet.health + 5, 100);
        }

        msg!("🍖 Питомец покормлен! Hunger: {}", pet.hunger);
        Ok(())
    }

    /// 🎮 Играть с питомцем (instruction 2)
    pub fn play_with_pet(ctx: Context<ActionPet>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let clock = Clock::get()?;

        require!(pet.is_alive, ErrorCode::PetIsDead);
        require!(pet.owner == ctx.accounts.owner.key(), ErrorCode::NotOwner);

        // Увеличиваем счастье, уменьшаем энергию
        pet.happiness = std::cmp::min(pet.happiness + 25, 100);
        pet.energy = pet.energy.saturating_sub(15);
        pet.last_played = clock.unix_timestamp;

        msg!("🎮 Играли с питомцем! Happiness: {}, Energy: {}", pet.happiness, pet.energy);
        Ok(())
    }

    /// 💊 Лечить питомца (instruction 3)
    pub fn heal_pet(ctx: Context<ActionPet>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;

        require!(pet.is_alive, ErrorCode::PetIsDead);
        require!(pet.owner == ctx.accounts.owner.key(), ErrorCode::NotOwner);

        // Увеличиваем здоровье
        pet.health = std::cmp::min(pet.health + 30, 100);

        msg!("💊 Питомец вылечен! Health: {}", pet.health);
        Ok(())
    }

    /// 😴 Отдых питомца (instruction 4)
    pub fn rest_pet(ctx: Context<ActionPet>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let clock = Clock::get()?;

        require!(pet.is_alive, ErrorCode::PetIsDead);
        require!(pet.owner == ctx.accounts.owner.key(), ErrorCode::NotOwner);

        // Восстанавливаем энергию
        pet.energy = std::cmp::min(pet.energy + 40, 100);
        pet.last_slept = clock.unix_timestamp;

        msg!("😴 Питомец отдыхает! Energy: {}", pet.energy);
        Ok(())
    }

    /// ✨ Воскресить питомца (instruction 5)
    pub fn resurrect_pet(ctx: Context<ResurrectPet>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let clock = Clock::get()?;

        require!(!pet.is_alive, ErrorCode::PetIsAlive);
        require!(pet.owner == ctx.accounts.owner.key(), ErrorCode::NotOwner);
        require!(pet.lives > 0, ErrorCode::NoLivesLeft);

        // Воскрешаем питомца
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

        msg!("✨ Питомец воскрешен! Осталось жизней: {}", pet.lives);
        Ok(())
    }

    /// 🗑️ Закрыть аккаунт питомца (instruction 6)
    pub fn close_pet(ctx: Context<ClosePet>) -> Result<()> {
        let pet = &ctx.accounts.pet;
        require!(pet.owner == ctx.accounts.owner.key(), ErrorCode::NotOwner);
        
        msg!("🗑️ Питомец #{} закрыт", pet.pet_id);
        Ok(())
    }

    /// ⏰ Обновить decay (instruction 7)
    pub fn update_decay(ctx: Context<UpdateDecay>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let clock = Clock::get()?;

        let time_passed = clock.unix_timestamp - pet.last_slept;
        if time_passed < 60 {
            return Ok(()); // Минимум 1 минута между обновлениями
        }

        // Decay каждую минуту
        let decay_cycles = (time_passed / 60) as u8;

        // Уменьшение параметров
        pet.hunger = pet.hunger.saturating_sub(decay_cycles);
        pet.happiness = pet.happiness.saturating_sub(decay_cycles);
        pet.energy = pet.energy.saturating_sub(decay_cycles);
        pet.thirst = pet.thirst.saturating_sub(decay_cycles);

        // Если низкие параметры - уменьшаем здоровье
        if pet.hunger < 20 || pet.happiness < 20 || pet.energy < 20 || pet.thirst < 20 {
            pet.health = pet.health.saturating_sub(decay_cycles);
        }

        // Проверка смерти
        if pet.health == 0 && pet.is_alive {
            pet.is_alive = false;
            msg!("💀 Питомец #{} умер! Осталось жизней: {}", pet.pet_id, pet.lives);
        }

        msg!("⏰ Decay обновлен. Health: {}, Hunger: {}", pet.health, pet.hunger);
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
        space = 8 + Pet::INIT_SPACE,
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
        bump = pet.bump
    )]
    pub pet: Account<'info, Pet>,
    pub owner: Signer<'info>,
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

#[derive(Accounts)]
pub struct UpdateDecay<'info> {
    #[account(
        mut,
        seeds = [b"pet", pet.owner.as_ref()],
        bump = pet.bump
    )]
    pub pet: Account<'info, Pet>,
}

// ============================================================================
// Account
// ============================================================================

#[account]
#[derive(InitSpace)]
pub struct Pet {
    pub owner: Pubkey,        // 32 bytes
    pub dna: u64,             // 8 bytes
    pub pet_id: u32,          // 4 bytes
    pub species: u8,          // 1 byte (0-9)
    pub accessory: u8,        // 1 byte (0-9)
    pub background: u8,       // 1 byte (0-7)
    pub rarity: u8,           // 1 byte (0-4: Common, Uncommon, Rare, Epic, Legendary)
    pub level: u8,            // 1 byte
    pub health: u8,           // 1 byte (0-100)
    pub hunger: u8,           // 1 byte (0-100)
    pub happiness: u8,        // 1 byte (0-100)
    pub energy: u8,           // 1 byte (0-100)
    pub thirst: u8,           // 1 byte (0-100)
    pub birth_time: i64,      // 8 bytes
    pub last_fed: i64,        // 8 bytes
    pub last_played: i64,     // 8 bytes
    pub last_slept: i64,      // 8 bytes
    pub is_alive: bool,       // 1 byte
    pub lives: u8,            // 1 byte (количество жизней: 0-3)
    pub bump: u8,             // 1 byte
}

// ============================================================================
// Errors
// ============================================================================

#[error_code]
pub enum ErrorCode {
    #[msg("Pet is already dead")]
    PetIsDead,
    #[msg("Pet is alive")]
    PetIsAlive,
    #[msg("You are not the owner of this pet")]
    NotOwner,
    #[msg("No lives left")]
    NoLivesLeft,
}








