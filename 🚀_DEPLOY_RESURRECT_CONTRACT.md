# 🚀 ДЕПЛОЙ КОНТРАКТА С ВОСКРЕШЕНИЕМ

## 📝 **ИНСТРУКЦИИ ДЛЯ SOLANA PLAYGROUND:**

### **ШАГ 1: Открыть Playground**
```
1. Открой https://beta.solpg.io/
2. Залогинься (если нужно)
```

### **ШАГ 2: Создать новый файл**
```
1. В левой панели нажми "+"
2. Назови файл: lib.rs
3. Удали весь дефолтный код
```

### **ШАГ 3: Скопировать код**
```
1. Открой файл: PLAYGROUND_AUTO_DECAY_lib.rs
2. Скопируй ВСЁ содержимое (Ctrl+A, Ctrl+C)
3. Вставь в lib.rs в Playground (Ctrl+V)
```

### **ШАГ 4: Build**
```
1. В терминале внизу набери:
   $ build

2. Дождись:
   Building...
   Build successful. Completed in X.XXs.
```

### **ШАГ 5: Deploy**
```
1. В терминале набери:
   $ deploy

2. Дождись:
   Deploying...
   Deployment successful. Completed in Xm.

3. Скопируй Program ID (он появится в консоли)
```

### **ШАГ 6: Тест**
```
1. Создай файл test.ts
2. Скопируй этот код:
```

```typescript
describe("Tamagotchi Resurrect Test", () => {
  
  it("Shows existing pet", async () => {
    const [petPda] = await PublicKey.findProgramAddress(
      [Buffer.from("pet"), pg.wallet.publicKey.toBuffer()],
      pg.program.programId
    );

    try {
      const pet = await pg.program.account.pet.fetch(petPda);
      
      console.log("\n════════════════════════════════════════");
      console.log("    🐣 ТВОЙ ПИТОМЕЦ:");
      console.log("════════════════════════════════════════");
      console.log("🆔 Pet ID:", pet.petId.toString());
      console.log("🧬 DNA:", pet.dna.toString());
      console.log("🎨 Species:", pet.species);
      console.log("✨ Rarity:", pet.rarity);
      console.log("📊 Level:", pet.level);
      console.log("❤️  Health:", pet.health);
      console.log("🍖 Hunger:", pet.hunger);
      console.log("😊 Happiness:", pet.happiness);
      console.log("⚡ Energy:", pet.energy);
      console.log("💀 Alive:", pet.isAlive);
      console.log("════════════════════════════════════════\n");
      
      // Если питомец мертв - показываем как воскресить
      if (!pet.isAlive) {
        console.log("💀 ПИТОМЕЦ МЕРТВ!");
        console.log("🔧 Можно воскресить:");
        console.log("   - За 0.5 SOL");
        console.log("   - За 5,000 TAMA (burn)\n");
      }
      
    } catch (err) {
      console.log("❌ Питомец не найден. Создай нового!");
    }
  });
  
  it("Test resurrect_pet function exists", async () => {
    // Проверяем что функция есть в IDL
    const methods = Object.keys(pg.program.methods);
    console.log("\n📋 Доступные функции:", methods);
    
    const hasResurrect = methods.includes('resurrectPet');
    console.log("✅ resurrect_pet есть:", hasResurrect);
    
    if (hasResurrect) {
      console.log("\n💀 Функция воскрешения готова к использованию!");
    }
  });
  
});
```

```
3. Запусти тест:
   $ test

4. Проверь что функция resurrect_pet есть в списке
```

---

## 📝 **ОБНОВИТЬ FRONTEND:**

### **После успешного деплоя:**

```javascript
// В tamagotchi_devnet_v2_improved.html обнови:

const PROGRAM_ID = 'НОВЫЙ_PROGRAM_ID_ИЗ_PLAYGROUND';

// Например:
const PROGRAM_ID = 'uY5hZR2uYzkquJDuDkFBj29tfzZRPE96BBTHYGaYnwX';
```

---

## 🎯 **ЧТО ИЗМЕНИЛОСЬ В КОНТРАКТЕ:**

### **Новая функция:**
```rust
pub fn resurrect_pet(ctx: Context<ResurrectPet>, use_sol: bool) -> Result<()>
```

### **Параметры:**
- `use_sol: bool` - true = оплата в SOL, false = оплата в TAMA

### **Accounts:**
```rust
pub struct ResurrectPet<'info> {
    pub pet: Account<'info, Pet>,        // Мертвый питомец
    pub payer: Signer<'info>,            // Кто оплачивает
    pub treasury: UncheckedAccount,      // Куда идут SOL
    pub user_token_account: TokenAccount, // Откуда берутся TAMA
    pub token_mint: Mint,                // TAMA mint
    pub token_program: Program<Token>,   // Token program
    pub system_program: Program<System>, // System program
}
```

### **Логика:**
```
1. Проверяем что питомец мертв (!is_alive)
2. Если use_sol = true:
   - Переводим 0.5 SOL на treasury
3. Если use_sol = false:
   - Сжигаем 5,000 TAMA
4. Воскрешаем питомца:
   - is_alive = true
   - health = 50
   - hunger = 50
   - happiness = 50
   - energy = 50
5. Обновляем timestamps
```

---

## ⚠️ **ВАЖНО:**

### **AccountDidNotDeserialize Error:**

Если видишь ошибку:
```
Error Code: AccountDidNotDeserialize
Failed to deserialize the account
```

Это значит что:
1. **Старый контракт на chain не совпадает с новым кодом**
2. **Решение**: Нужно закрыть старого питомца и создать нового

### **Как исправить:**

#### **Вариант A: Через Playground**
```typescript
it("Close old pet", async () => {
  const [petPda] = await PublicKey.findProgramAddress(
    [Buffer.from("pet"), pg.wallet.publicKey.toBuffer()],
    pg.program.programId
  );

  await pg.program.methods
    .closePet()
    .accounts({
      pet: petPda,
      owner: pg.wallet.publicKey,
    })
    .rpc();
    
  console.log("✅ Старый питомец закрыт!");
});

it("Create new pet", async () => {
  // ... создать нового
});
```

#### **Вариант B: Через Frontend**
```
1. Нажми кнопку "Закрыть аккаунт"
2. Подтверди транзакцию
3. Нажми "Создать питомца"
4. Готово!
```

---

## 🎊 **CHECKLIST:**

```
✅ PLAYGROUND_AUTO_DECAY_lib.rs обновлен
   - resurrect_pet() функция
   - ResurrectPet accounts
   - PetAlreadyAlive error

⬜ Deploy на Playground
⬜ Получить новый Program ID
⬜ Тест функций
⬜ Обновить frontend (PROGRAM_ID)
⬜ Добавить UI для воскрешения
⬜ Deploy frontend на Vercel
⬜ Тестирование end-to-end
```

---

## 🚀 **ГОТОВ К ДЕПЛОЮ!**

Следуй инструкциям выше и через 5 минут у тебя будет работающая система воскрешения!

**Напиши когда задеплоишь - обновлю frontend!** 💀➡️🐣


