# 🔨 ПЛАН РАЗРАБОТКИ СМАРТ-КОНТРАКТА

## 🎯 ЦЕЛЬ:

Создать полностью on-chain игру где:
- Каждый питомец = Account в Solana
- Все действия = транзакции
- Данные = в blockchain
- Burn токенов = через контракт

---

## 📐 АРХИТЕКТУРА КОНТРАКТА:

### **Account Structures:**

```rust
#[account]
pub struct Pet {
    pub owner: Pubkey,           // 32 bytes - Владелец
    pub mint: Pubkey,            // 32 bytes - Token mint для burn
    
    // Уникальность
    pub dna: u64,                // 8 bytes - Уникальный DNA
    pub pet_id: u32,             // 4 bytes - ID питомца
    pub species: u8,             // 1 byte - Вид (0-9)
    pub accessory: u8,           // 1 byte - Аксессуар (0-9)
    pub background: u8,          // 1 byte - Фон (0-7)
    pub rarity: u8,              // 1 byte - Редкость (0-4)
    
    // Игровые параметры
    pub level: u8,               // 1 byte - Уровень
    pub experience: u16,         // 2 bytes - Опыт
    pub health: u8,              // 1 byte - Здоровье
    pub hunger: u8,              // 1 byte - Голод
    pub happiness: u8,           // 1 byte - Счастье
    pub energy: u8,              // 1 byte - Энергия
    pub age: u32,                // 4 bytes - Возраст в секундах
    
    // Timestamps
    pub birth_time: i64,         // 8 bytes - Время рождения
    pub last_action_time: i64,   // 8 bytes - Последнее действие
    pub last_decay_time: i64,    // 8 bytes - Последний decay
    
    // Статистика
    pub total_tokens_burned: u64, // 8 bytes - Всего сожжено
    pub actions_count: u32,      // 4 bytes - Количество действий
    
    // Technical
    pub bump: u8,                // 1 byte - PDA bump
}

// Итого: ~140 bytes
// Rent: ~0.001 SOL/byte = ~0.14 SOL (~$3 при $20/SOL)
```

### **Instructions:**

```rust
pub mod tamagotchi {
    use super::*;

    // 1. Создать питомца (бесплатно, генерация из wallet)
    pub fn create_pet(ctx: Context<CreatePet>) -> Result<()> {
        // Генерируем DNA из wallet address
        // Создаем Pet account
        // Инициализируем параметры
    }

    // 2. Покормить (5 TAMA -> burn)
    pub fn feed_pet(ctx: Context<ActionPet>) -> Result<()> {
        // Burn 5 TAMA
        // hunger += 30
        // health += 5
        // experience += 5
        // Проверка времени
    }

    // 3. Играть (3 TAMA -> burn)
    pub fn play_with_pet(ctx: Context<ActionPet>) -> Result<()> {
        // Burn 3 TAMA
        // happiness += 25
        // energy -= 15
        // experience += 8
    }

    // 4. Лечить (8 TAMA -> burn)
    pub fn heal_pet(ctx: Context<ActionPet>) -> Result<()> {
        // Burn 8 TAMA
        // health = 100
        // experience += 3
    }

    // 5. Отдыхать (2 TAMA -> burn)
    pub fn rest_pet(ctx: Context<ActionPet>) -> Result<()> {
        // Burn 2 TAMA
        // energy += 40
        // health += 10
        // experience += 3
    }

    // 6. Обновить decay (бесплатно)
    pub fn update_decay(ctx: Context<UpdateDecay>) -> Result<()> {
        // Рассчитать время с last_decay
        // Уменьшить hunger/happiness/energy
        // Если низкие параметры -> уменьшить health
    }

    // 7. Закрыть аккаунт (вернуть rent)
    pub fn close_pet(ctx: Context<ClosePet>) -> Result<()> {
        // Только владелец
        // Вернуть SOL
    }
}
```

---

## 🔥 BURN МЕХАНИКА:

```rust
// Helper function для сжигания токенов
pub fn burn_tokens(
    token_program: AccountInfo,
    user_token_account: AccountInfo,
    mint: AccountInfo,
    authority: AccountInfo,
    amount: u64,
) -> Result<()> {
    let cpi_accounts = Burn {
        mint: mint,
        from: user_token_account,
        authority: authority,
    };
    
    let cpi_program = token_program;
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    
    token::burn(cpi_ctx, amount)?;
    
    Ok(())
}
```

---

## 📊 PDA SEEDS:

```rust
// Pet Account PDA:
seeds = [
    b"pet",
    owner.key().as_ref(),
]

// Один питомец на wallet!
// Адрес детерминирован
```

---

## 💰 ЭКОНОМИКА:

### **Стоимости:**

```
Создание питомца:
- Rent: ~0.14 SOL (~$3)
- Пользователь платит один раз
- Можно вернуть при закрытии!

Действия:
- Feed: 5 TAMA (burn)
- Play: 3 TAMA (burn)
- Heal: 8 TAMA (burn)
- Rest: 2 TAMA (burn)
- Update decay: FREE (no burn)

Gas fees:
- ~0.000005 SOL за транзакцию
- Практически бесплатно!
```

---

## 🎨 FRONTEND ИНТЕГРАЦИЯ:

```typescript
// 1. Создать питомца
const createPet = async () => {
    const [petPDA] = await PublicKey.findProgramAddress(
        [Buffer.from("pet"), wallet.publicKey.toBuffer()],
        program.programId
    );
    
    await program.methods
        .createPet()
        .accounts({
            pet: petPDA,
            owner: wallet.publicKey,
            systemProgram: SystemProgram.programId,
        })
        .rpc();
};

// 2. Покормить
const feedPet = async () => {
    const [petPDA] = await PublicKey.findProgramAddress(...);
    
    await program.methods
        .feedPet()
        .accounts({
            pet: petPDA,
            owner: wallet.publicKey,
            userTokenAccount: userTokenAccountPDA,
            tokenMint: TAMA_MINT,
            tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
};

// 3. Загрузить данные
const loadPet = async () => {
    const [petPDA] = await PublicKey.findProgramAddress(...);
    const pet = await program.account.pet.fetch(petPDA);
    
    return {
        dna: pet.dna,
        level: pet.level,
        health: pet.health,
        // ...
    };
};
```

---

## 🧪 ТЕСТИРОВАНИЕ:

```typescript
describe("tamagotchi", () => {
    it("Создает питомца", async () => {
        await program.methods.createPet().rpc();
        const pet = await program.account.pet.fetch(petPDA);
        
        assert.equal(pet.owner.toString(), wallet.publicKey.toString());
        assert.equal(pet.level, 1);
        assert.equal(pet.health, 100);
    });
    
    it("Кормит питомца и сжигает токены", async () => {
        const before = await getTokenBalance(userTokenAccount);
        
        await program.methods.feedPet().rpc();
        
        const after = await getTokenBalance(userTokenAccount);
        const pet = await program.account.pet.fetch(petPDA);
        
        assert.equal(before - after, 5_000_000_000); // 5 TAMA burned
        assert.equal(pet.hunger, 130); // 100 + 30
    });
    
    it("Обновляет decay", async () => {
        await sleep(10000); // 10 секунд
        
        await program.methods.updateDecay().rpc();
        
        const pet = await program.account.pet.fetch(petPDA);
        assert.isBelow(pet.hunger, 100); // Уменьшился
    });
});
```

---

## 📦 ДЕПЛОЙ:

```bash
# 1. Build
anchor build

# 2. Get program ID
solana address -k target/deploy/tamagotchi-keypair.json

# 3. Update in lib.rs
declare_id!("YOUR_PROGRAM_ID");

# 4. Build again
anchor build

# 5. Deploy to devnet
anchor deploy --provider.cluster devnet

# 6. Deploy to mainnet
anchor deploy --provider.cluster mainnet
```

---

## ⏱️ TIMELINE:

### **День 1-2: Setup + Базовая структура**
- ✅ Установить Visual Studio Build Tools
- ✅ Установить Rust + Anchor
- ✅ Создать Pet struct
- ✅ Создать create_pet instruction
- ✅ Первая компиляция

### **День 3-5: Action Instructions**
- 🔨 feed_pet + burn
- 🔨 play_with_pet + burn
- 🔨 heal_pet + burn
- 🔨 rest_pet + burn
- 🔨 update_decay logic

### **День 6-7: Тесты**
- 🔨 Unit tests
- 🔨 Integration tests
- 🔨 Devnet deployment
- 🔨 Manual testing

### **День 8-10: Frontend**
- 🔨 Anchor client setup
- 🔨 Create pet UI
- 🔨 Actions UI
- 🔨 Loading states
- 🔨 Error handling

### **День 11-12: Оптимизация**
- 🔨 Багфиксы
- 🔨 Gas оптимизация
- 🔨 UX improvements
- 🔨 Документация

### **День 13: Mainnet Launch**
- 🔨 Final tests
- 🔨 Mainnet deploy
- 🔨 Верификация контракта
- 🔨 Announce! 🚀

---

## 🛠️ УСТАНОВКА (Windows):

### **1. Visual Studio Build Tools:**
```
https://visualstudio.microsoft.com/downloads/
→ Build Tools for Visual Studio 2022
→ Desktop development with C++
```

### **2. Rust:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### **3. Solana CLI:**
```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

### **4. Anchor:**
```bash
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked
```

### **5. Node.js packages:**
```bash
npm install -g @coral-xyz/anchor
npm install @coral-xyz/anchor @solana/web3.js @solana/spl-token
```

---

## 💎 ПРЕИМУЩЕСТВА ON-CHAIN:

```
✅ Данные никогда не теряются
✅ Полная децентрализация
✅ Доказуемая уникальность
✅ Нельзя читить
✅ Работает на всех устройствах
✅ Можно мигрировать в NFT
✅ Глобальная статистика из blockchain
✅ Можно строить marketplace
✅ Community ownership
```

---

## 🚀 ГОТОВ НАЧАТЬ?

**Следующий шаг: Установка Build Tools!**

Открой: https://visualstudio.microsoft.com/downloads/
Скачай: Build Tools for Visual Studio 2022
Установи: Desktop development with C++

**Потом скажи - продолжим!** 💪















