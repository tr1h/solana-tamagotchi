// 💰 КОНТРАКТ 2: REWARD POOL
// Управление наградами TAMA токенов

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, Transfer};

declare_id!("11111111111111111111111111111111");

#[program]
pub mod reward_pool {
    use super::*;

    /// 🎯 Инициализировать Reward Pool
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let pool = &mut ctx.accounts.pool_state;
        
        pool.authority = ctx.accounts.authority.key();
        pool.tama_mint = ctx.accounts.tama_mint.key();
        pool.reward_account = ctx.accounts.reward_account.key();
        pool.total_distributed = 0;
        pool.total_claims = 0;
        pool.is_active = true;
        pool.bump = ctx.bumps.pool_state;

        msg!("💰 Reward Pool инициализирован!");
        msg!("📊 TAMA Mint: {}", pool.tama_mint);
        msg!("👛 Reward Account: {}", pool.reward_account);
        
        Ok(())
    }

    /// 💸 Пополнить Reward Pool (только admin)
    pub fn deposit_rewards(ctx: Context<DepositRewards>, amount: u64) -> Result<()> {
        let pool = &mut ctx.accounts.pool_state;
        
        require!(pool.is_active, ErrorCode::PoolNotActive);
        require!(
            ctx.accounts.authority.key() == pool.authority,
            ErrorCode::Unauthorized
        );

        // Перевод TAMA в pool
        let cpi_accounts = Transfer {
            from: ctx.accounts.from_account.to_account_info(),
            to: ctx.accounts.reward_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
        );
        
        token::transfer(cpi_ctx, amount)?;

        msg!("💰 Pool пополнен на {} TAMA", amount / 1_000_000_000);
        Ok(())
    }

    /// 🎁 Выплатить награду (вызывается из Tamagotchi контракта)
    pub fn claim_reward(ctx: Context<ClaimReward>, amount: u64) -> Result<()> {
        let pool = &mut ctx.accounts.pool_state;
        
        require!(pool.is_active, ErrorCode::PoolNotActive);
        
        // Проверяем баланс pool
        let pool_balance = ctx.accounts.reward_account.amount;
        require!(pool_balance >= amount, ErrorCode::InsufficientFunds);

        // Перевод TAMA из pool игроку
        let seeds = &[
            b"reward_authority".as_ref(),
            &[ctx.bumps.reward_authority],
        ];
        let signer = &[&seeds[..]];
        
        let cpi_accounts = Transfer {
            from: ctx.accounts.reward_account.to_account_info(),
            to: ctx.accounts.to_account.to_account_info(),
            authority: ctx.accounts.reward_authority.to_account_info(),
        };
        
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer,
        );
        
        token::transfer(cpi_ctx, amount)?;

        // Статистика
        pool.total_distributed += amount;
        pool.total_claims += 1;

        msg!("🎁 Выплачено {} TAMA", amount / 1_000_000_000);
        Ok(())
    }

    /// ⚙️ Обновить настройки pool (только admin)
    pub fn update_settings(ctx: Context<UpdateSettings>, is_active: bool) -> Result<()> {
        let pool = &mut ctx.accounts.pool_state;
        
        require!(
            ctx.accounts.authority.key() == pool.authority,
            ErrorCode::Unauthorized
        );

        pool.is_active = is_active;

        msg!("⚙️ Pool статус: {}", if is_active { "активен" } else { "остановлен" });
        Ok(())
    }

    /// 📊 Получить статистику pool
    pub fn get_stats(ctx: Context<GetStats>) -> Result<()> {
        let pool = &ctx.accounts.pool_state;
        let balance = ctx.accounts.reward_account.amount;

        msg!("📊 СТАТИСТИКА REWARD POOL:");
        msg!("💰 Баланс: {} TAMA", balance / 1_000_000_000);
        msg!("📤 Выплачено: {} TAMA", pool.total_distributed / 1_000_000_000);
        msg!("🎁 Всего выплат: {}", pool.total_claims);
        msg!("⚡ Статус: {}", if pool.is_active { "активен" } else { "остановлен" });
        
        Ok(())
    }

    /// 🚨 Emergency withdraw (только admin)
    pub fn emergency_withdraw(ctx: Context<EmergencyWithdraw>, amount: u64) -> Result<()> {
        let pool = &ctx.accounts.pool_state;
        
        require!(
            ctx.accounts.authority.key() == pool.authority,
            ErrorCode::Unauthorized
        );

        let seeds = &[
            b"reward_authority".as_ref(),
            &[ctx.bumps.reward_authority],
        ];
        let signer = &[&seeds[..]];
        
        let cpi_accounts = Transfer {
            from: ctx.accounts.reward_account.to_account_info(),
            to: ctx.accounts.to_account.to_account_info(),
            authority: ctx.accounts.reward_authority.to_account_info(),
        };
        
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer,
        );
        
        token::transfer(cpi_ctx, amount)?;

        msg!("🚨 Emergency withdraw: {} TAMA", amount / 1_000_000_000);
        Ok(())
    }
}

// ============================================================================
// Contexts
// ============================================================================

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + PoolState::INIT_SPACE,
        seeds = [b"pool_state"],
        bump
    )]
    pub pool_state: Account<'info, PoolState>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub tama_mint: Account<'info, Mint>,
    
    /// Reward account - где хранятся TAMA для раздачи
    #[account(
        mut,
        constraint = reward_account.mint == tama_mint.key()
    )]
    pub reward_account: Account<'info, TokenAccount>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositRewards<'info> {
    #[account(
        mut,
        seeds = [b"pool_state"],
        bump = pool_state.bump
    )]
    pub pool_state: Account<'info, PoolState>,
    
    pub authority: Signer<'info>,
    
    #[account(
        mut,
        constraint = from_account.owner == authority.key()
    )]
    pub from_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        constraint = reward_account.key() == pool_state.reward_account
    )]
    pub reward_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ClaimReward<'info> {
    #[account(
        mut,
        seeds = [b"pool_state"],
        bump = pool_state.bump
    )]
    pub pool_state: Account<'info, PoolState>,
    
    /// PDA authority для подписи транзакций
    #[account(
        seeds = [b"reward_authority"],
        bump
    )]
    /// CHECK: PDA authority
    pub reward_authority: AccountInfo<'info>,
    
    #[account(
        mut,
        constraint = reward_account.key() == pool_state.reward_account
    )]
    pub reward_account: Account<'info, TokenAccount>,
    
    /// Аккаунт получателя
    #[account(mut)]
    pub to_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdateSettings<'info> {
    #[account(
        mut,
        seeds = [b"pool_state"],
        bump = pool_state.bump
    )]
    pub pool_state: Account<'info, PoolState>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct GetStats<'info> {
    #[account(
        seeds = [b"pool_state"],
        bump = pool_state.bump
    )]
    pub pool_state: Account<'info, PoolState>,
    
    pub reward_account: Account<'info, TokenAccount>,
}

#[derive(Accounts)]
pub struct EmergencyWithdraw<'info> {
    #[account(
        seeds = [b"pool_state"],
        bump = pool_state.bump
    )]
    pub pool_state: Account<'info, PoolState>,
    
    pub authority: Signer<'info>,
    
    #[account(
        seeds = [b"reward_authority"],
        bump
    )]
    /// CHECK: PDA authority
    pub reward_authority: AccountInfo<'info>,
    
    #[account(
        mut,
        constraint = reward_account.key() == pool_state.reward_account
    )]
    pub reward_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub to_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

// ============================================================================
// State
// ============================================================================

#[account]
#[derive(InitSpace)]
pub struct PoolState {
    pub authority: Pubkey,          // 32 - админ
    pub tama_mint: Pubkey,          // 32 - адрес токена TAMA
    pub reward_account: Pubkey,     // 32 - аккаунт с TAMA
    pub total_distributed: u64,     // 8 - всего роздано
    pub total_claims: u64,          // 8 - количество выплат
    pub is_active: bool,            // 1 - активен ли pool
    pub bump: u8,                   // 1
}

// ============================================================================
// Errors
// ============================================================================

#[error_code]
pub enum ErrorCode {
    #[msg("Pool is not active")]
    PoolNotActive,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Insufficient funds in pool")]
    InsufficientFunds,
}






