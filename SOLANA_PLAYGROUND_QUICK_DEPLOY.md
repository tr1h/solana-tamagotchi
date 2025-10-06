# 🚀 БЫСТРЫЙ ДЕПЛОЙ В SOLANA PLAYGROUND

## ⚡ ЗА 5 МИНУТ!

### **Шаг 1: Открой Playground**
```
https://beta.solpg.io
```

### **Шаг 2: Создай проект**
1. Click "**Create a new project**"
2. Выбери "**Anchor**" template
3. Назови: `crypto-tamagotchi`

### **Шаг 3: Замени код**

#### В файле `lib.rs`:
```bash
# Удали весь template код
# Скопируй из: programs/tamagotchi/src/lib.rs
# Вставь в редактор
```

#### В файле `Cargo.toml`:
```bash
# Скопируй из: programs/tamagotchi/Cargo.toml
# Вставь в редактор
```

### **Шаг 4: Build**
```
1. Нажми кнопку "Build" 🔨
2. Дождись "Build successful ✅"
3. Готово!
```

### **Шаг 5: Получи SOL**
```
1. Переключись на Devnet
2. Нажми "Airdrop" → получишь 2 SOL
3. Если нужно больше → повтори
```

### **Шаг 6: Deploy!**
```
1. Нажми "Deploy" 🚀
2. Выбери "Devnet"
3. Дождись "Deploy successful ✅"
4. СКОПИРУЙ Program ID! 📋
```

---

## 📝 **ВАЖНО! ОБНОВИ PROGRAM ID:**

### После деплоя получишь Program ID, например:
```
Program Id: AbC123...XyZ789
```

### Обнови в 2-х местах:

#### 1️⃣ В `lib.rs` (строка 11):
```rust
declare_id!("AbC123...XyZ789"); // ← Твой новый ID
```

#### 2️⃣ В `tamagotchi_devnet_v2_improved.html` (строка ~942):
```javascript
const PROGRAM_ID = 'AbC123...XyZ789'; // ← Твой новый ID
```

### Затем:
```
1. В Playground нажми "Build" снова
2. Нажми "Deploy" снова
3. Теперь контракт готов!
```

---

## ✅ **ПРОВЕРЬ ЧТО РАБОТАЕТ:**

### Test в Playground:
```typescript
// Нажми "Test" tab
// Запусти тесты
// Должны пройти все! ✅
```

### Или вручную:
```javascript
// 1. Создай питомца
await program.methods
  .createPet()
  .accounts({...})
  .rpc();

// 2. Покорми
await program.methods
  .feedPet()
  .accounts({...})
  .rpc();

console.log("✅ Всё работает!");
```

---

## 🎮 **ПОДКЛЮЧИ ФРОНТЕНД:**

### После деплоя:
```
1. Скопируй Program ID
2. Вставь в tamagotchi_devnet_v2_improved.html
3. Deploy на Vercel:
   vercel --prod
4. Готово! Игра работает!
```

---

## 🔗 **ПОЛЕЗНЫЕ ССЫЛКИ:**

**Solana Playground:**
https://beta.solpg.io

**Solana Explorer (Devnet):**
https://explorer.solana.com/?cluster=devnet

**Devnet Faucet:**
https://faucet.solana.com

**Твой контракт после деплоя:**
```
https://explorer.solana.com/address/ТУТ_ТВОЙ_PROGRAM_ID?cluster=devnet
```

---

## ⚠️ **ЧАСТЫЕ ОШИБКИ:**

### "Account not found"
```
→ Сначала создай питомца (create_pet)
→ Потом делай действия (feed/play/etc)
```

### "Invalid owner"
```
→ Используй тот же кошелек
→ Что создал питомца
```

### "Insufficient funds"
```
→ Получи devnet SOL через Airdrop
→ Или faucet.solana.com
```

---

## 🎉 **ГОТОВО!**

**Теперь у тебя:**
- ✅ Контракт задеплоен в Devnet
- ✅ Program ID скопирован
- ✅ Можно тестировать!
- ✅ Можно подключать фронтенд!

**Следующий шаг:**
→ Протестируй все функции
→ Если всё ОК → Deploy на Mainnet! 🚀

---

**Удачи! Ты создал крутую игру!** 💎🎮








