# 🚨 КРИТИЧЕСКАЯ ПРОБЛЕМА В СМАРТ-КОНТРАКТЕ!

## ❌ ПРОБЛЕМА:

### **Несоответствие между контрактом и фронтендом!**

---

## 🔍 ЧТО НАШЁЛ:

### В смарт-контракте `ActionPet` ожидается:

```rust
pub struct ActionPet<'info> {
    #[account(mut, seeds = [b"pet", owner.key().as_ref()], bump = pet.bump)]
    pub pet: Account<'info, Pet>,              // 1
    
    #[account(mut)]
    pub owner: Signer<'info>,                  // 2
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,  // 3
    
    #[account(mut, seeds = [b"tama_mint"], bump)]
    pub tama_mint: Account<'info, Mint>,       // 4 ← НУЖЕН PDA!
    
    #[account(
        mut,
        associated_token::mint = tama_mint,
        associated_token::authority = owner,
    )]
    pub user_tama_account: Account<'info, TokenAccount>,   // 5 ← НУЖЕН!
    
    #[account(mut)]
    pub token_mint: Account<'info, Mint>,      // 6
    
    pub token_program: Program<'info, Token>,  // 7
}
```

### Фронтенд отправляет ТОЛЬКО:

```javascript
const actionKeys = [
    { pubkey: petPubkey },                     // 1 ✅
    { pubkey: wallet.publicKey },              // 2 ✅
    { pubkey: tokenAccountPubkey },            // 3 ✅
    { pubkey: tokenMintPubkey },               // 4 ❌ НЕТ tama_mint!
    { pubkey: tokenProgramId },                // 5 ❌ НЕТ user_tama_account!
                                               // ❌ НЕТ token_mint!
];
```

**Не хватает 2 аккаунтов!**

---

## 💥 ПОЧЕМУ НЕ РАБОТАЕТ:

### Ошибка: `AccountOwnedByWrongProgram`

```
Program log: AnchorError caused by account: user_tama_account. 
Error Code: AccountOwnedByWrongProgram.
Error Number: 3007.
```

**Причина:**
Контракт ожидает 7 аккаунтов, но мы передаем только 5!

Anchor пытается десериализовать аккаунт #4 как `tama_mint` (PDA), но получает наш обычный токен `74KGR...`, и это вызывает ошибку!

---

## ✅ РЕШЕНИЕ:

### Вариант 1: **Упростить контракт** (рекомендую!)

Убрать `tama_mint` и `user_tama_account` из `ActionPet`, оставить только `token_mint`:

```rust
#[derive(Accounts)]
pub struct ActionPet<'info> {
    #[account(mut, seeds = [b"pet", owner.key().as_ref()], bump = pet.bump)]
    pub pet: Account<'info, Pet>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,  // ATA для token_mint
    
    #[account(mut)]
    pub token_mint: Account<'info, Mint>,  // 74KGR9mdiiiqVW9QCnFmZz8cyj39ZoCaKexrSxF8fpQD
    
    pub token_program: Program<'info, Token>,
}
```

### Вариант 2: **Обновить фронтенд** (сложнее!)

Добавить вычисление `tama_mint` PDA и `user_tama_account`:

```javascript
// Вычислить tama_mint PDA
const [tamaMintPDA] = await PublicKey.findProgramAddress(
    [Buffer.from('tama_mint')],
    programId
);

// Вычислить user_tama_account (ATA для tama_mint)
const userTamaAccount = await PublicKey.findProgramAddressSync(
    [
        wallet.publicKey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tamaMintPDA.toBuffer()
    ],
    ASSOCIATED_TOKEN_PROGRAM
)[0];

const actionKeys = [
    { pubkey: petPubkey },
    { pubkey: wallet.publicKey },
    { pubkey: oldTokenAccount },         // Для старого токена (если есть)
    { pubkey: tamaMintPDA },             // TAMA Mint PDA
    { pubkey: userTamaAccount },         // User's TAMA Token Account
    { pubkey: tokenMintPubkey },         // 74KGR... (наш токен)
    { pubkey: tokenProgramId },
];
```

---

## 🎯 РЕКОМЕНДАЦИЯ:

### **Упростить контракт!**

**Зачем нужны ДВА токена?**
- `tama_mint` (PDA) - непонятно зачем
- `token_mint` (74KGR...) - наш TAMA токен

**Проще использовать ОДИН токен:**
- Убрать `tama_mint` и `user_tama_account`
- Оставить только `token_mint` и `user_token_account`
- Обновить контракт
- Редеплоить

---

## 🔧 КАК ИСПРАВИТЬ:

### Шаг 1: Обновить контракт

**Файл:** `programs/tamagotchi/src/lib.rs`

**Найти:**
```rust
pub struct ActionPet<'info> {
    ...
    pub user_token_account: Account<'info, TokenAccount>,
    pub tama_mint: Account<'info, Mint>,
    pub user_tama_account: Account<'info, TokenAccount>,
    pub token_mint: Account<'info, Mint>,
    ...
}
```

**Заменить на:**
```rust
pub struct ActionPet<'info> {
    #[account(mut, seeds = [b"pet", owner.key().as_ref()], bump = pet.bump)]
    pub pet: Account<'info, Pet>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub token_mint: Account<'info, Mint>,
    
    pub token_program: Program<'info, Token>,
}
```

### Шаг 2: Обновить функцию burn_tokens

**Убедиться что используется `token_mint`, не `tama_mint`:**

```rust
pub fn feed_pet(ctx: Context<ActionPet>) -> Result<()> {
    // ...
    burn_tokens(
        &ctx.accounts.token_program.to_account_info(),
        &ctx.accounts.token_mint,           // ✅ Правильно
        &ctx.accounts.user_token_account,   // ✅ Правильно
        &ctx.accounts.owner,
        burn_amount
    )?;
    // ...
}
```

### Шаг 3: Rebuild и Redeploy

```bash
# Build
anchor build

# Deploy
anchor deploy --provider.cluster devnet

# Обновить PROGRAM_ID в фронтенде (если изменился)
```

### Шаг 4: Обновить фронтенд (если нужно)

Фронтенд уже готов! Он отправляет правильные аккаунты после упрощения контракта.

---

## 📊 ТЕКУЩЕЕ СОСТОЯНИЕ:

### Контракт:
```
Program ID: uY5hZR2uYzkquJDuDkFBj29tfzZRPE96BBTHYGaYnwX
Status: ❌ Несоответствие с фронтендом
Проблема: Ожидает больше аккаунтов чем отправляет фронтенд
```

### Фронтенд:
```
Token: 74KGR9mdiiiqVW9QCnFmZz8cyj39ZoCaKexrSxF8fpQD
Status: ✅ Правильно формирует транзакции
Проблема: Отправляет меньше аккаунтов чем ожидает контракт
```

---

## 🚨 ВРЕМЕННОЕ РЕШЕНИЕ (БЫСТРОЕ):

Если не хочешь переделывать контракт, обнови фронтенд:

```javascript
// Добавь ПЕРЕД performAction:

async function getTamaMintPDA() {
    const programId = new window.solanaWeb3.PublicKey(PROGRAM_ID);
    const [pda] = await window.solanaWeb3.PublicKey.findProgramAddress(
        [Buffer.from('tama_mint')],
        programId
    );
    return pda;
}

// В performAction, ЗАМЕНИ actionKeys на:

const tamaMintPDA = await getTamaMintPDA();

const userTamaAccount = window.solanaWeb3.PublicKey.findProgramAddressSync(
    [
        wallet.publicKey.toBuffer(),
        tokenProgramId.toBuffer(),
        tamaMintPDA.toBuffer()
    ],
    associatedTokenProgram
)[0];

const actionKeys = [
    { pubkey: petPubkey, isSigner: false, isWritable: true },
    { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
    { pubkey: tokenAccountPubkey, isSigner: false, isWritable: true },  // user_token_account
    { pubkey: tamaMintPDA, isSigner: false, isWritable: true },         // tama_mint PDA
    { pubkey: userTamaAccount, isSigner: false, isWritable: true },     // user_tama_account
    { pubkey: tokenMintPubkey, isSigner: false, isWritable: true },     // token_mint (74KGR...)
    { pubkey: tokenProgramId, isSigner: false, isWritable: false },
];
```

---

## 🎉 ИТОГО:

**Проблема:**
- ❌ Контракт ожидает 7 аккаунтов
- ❌ Фронтенд отправляет 5 аккаунтов
- ❌ AccountOwnedByWrongProgram

**Решение (выбери одно):**
1. ✅ **Упростить контракт** (убрать tama_mint) ← РЕКОМЕНДУЮ!
2. ✅ **Обновить фронтенд** (добавить недостающие аккаунты)

**Следующий шаг:**
- Решай что делать: упрощать контракт или обновлять фронтенд?
- Я могу помочь с любым вариантом!

---

**НУЖНО ИСПРАВИТЬ КОНТРАКТ ИЛИ ФРОНТЕНД!** 🔧🚀


