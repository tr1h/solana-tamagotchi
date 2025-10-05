# ⚡ БЫСТРЫЙ СТАРТ: СМАРТ-КОНТРАКТ

## 🎯 ЧТО СДЕЛАНО:

✅ **Полный смарт-контракт готов!**
- `programs/tamagotchi/src/lib.rs` - контракт (готов!)
- `programs/tamagotchi/Cargo.toml` - зависимости
- `Anchor.toml` - конфигурация
- `CONTRACT_SETUP.md` - подробная инструкция
- `SMART_CONTRACT_PLAN.md` - план разработки

---

## 🚀 СТАРТ ЗА 3 ШАГА:

### **1. Установи Build Tools (ОБЯЗАТЕЛЬНО!)**

```
https://visualstudio.microsoft.com/downloads/
→ Build Tools for Visual Studio 2022
→ Desktop development with C++
→ Установить
→ ПЕРЕЗАГРУЗИ КОМП!
```

**Без этого не будет работать!**

---

### **2. Установи Rust + Solana + Anchor**

```powershell
# Rust:
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Solana CLI (уже есть):
solana --version

# Anchor CLI:
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked
# Это займет ~20-30 минут!
```

---

### **3. Build и Deploy**

```powershell
cd "C:\NEW proekt"

# Build:
anchor build

# Получить Program ID:
solana address -k target/deploy/tamagotchi-keypair.json

# Обновить в lib.rs:
# declare_id!("ТВОЙ_PROGRAM_ID");

# Rebuild:
anchor build

# Deploy:
anchor deploy
```

---

## 💡 ЧТО ДЕЛАЕТ КОНТРАКТ:

### **create_pet() - Создать питомца**
- Генерирует уникального питомца из wallet address
- Создает Pet Account в блокчейне
- Стоимость: ~0.14 SOL (rent)

### **feed_pet() - Покормить**
- Burn 5 TAMA токенов
- hunger += 30
- health += 5
- experience += 5

### **play_with_pet() - Играть**
- Burn 3 TAMA токенов
- happiness += 25
- energy -= 15
- experience += 8

### **heal_pet() - Лечить**
- Burn 8 TAMA токенов
- health = 100
- experience += 3

### **rest_pet() - Отдыхать**
- Burn 2 TAMA токенов
- energy += 40
- health += 10
- experience += 3

### **update_decay() - Обновить decay (БЕСПЛАТНО)**
- Уменьшает hunger/happiness/energy со временем
- Если параметры низкие → уменьшает health

### **close_pet() - Закрыть (вернуть rent)**
- Удаляет Pet Account
- Возвращает ~0.14 SOL владельцу

---

## 📊 СТРУКТУРА ДАННЫХ:

```rust
Pet Account (~140 bytes):
├─ owner: Pubkey (владелец)
├─ dna: u64 (уникальный)
├─ pet_id: u32 (#12345)
├─ species: u8 (0-9: кот, собака, дракон...)
├─ accessory: u8 (0-9: корона, шляпа...)
├─ background: u8 (0-7: космос, океан...)
├─ rarity: u8 (0-4: common → legendary)
├─ level: u8 (1-5)
├─ health: u8 (0-100)
├─ hunger: u8 (0-100)
├─ happiness: u8 (0-100)
├─ energy: u8 (0-100)
├─ total_tokens_burned: u64
└─ ... timestamps, age, stats
```

**Всё хранится on-chain!** 💎

---

## 🎮 ИНТЕГРАЦИЯ С FRONTEND:

После деплоя, обнови `tamagotchi_devnet.html`:

```javascript
// 1. Добавь Program ID:
const PROGRAM_ID = "ТВОЙ_PROGRAM_ID";

// 2. Загрузи IDL:
const IDL = await fetch('/target/idl/tamagotchi.json').then(r => r.json());

// 3. Создай программу:
const program = new anchor.Program(IDL, PROGRAM_ID, provider);

// 4. Найди PDA:
const [petPDA] = await PublicKey.findProgramAddress(
    [Buffer.from("pet"), wallet.publicKey.toBuffer()],
    PROGRAM_ID
);

// 5. Создать питомца:
await program.methods.createPet().accounts({...}).rpc();

// 6. Покормить:
await program.methods.feedPet().accounts({...}).rpc();

// 7. Загрузить данные:
const pet = await program.account.pet.fetch(petPDA);
```

---

## ⏱️ TIMELINE:

```
День 1: Установка Build Tools + Rust + Anchor
День 2-3: Build + Deploy на devnet + Тесты
День 4-5: Интеграция с frontend
День 6-7: Багфиксы + Оптимизация
День 8-9: Final тесты
День 10: Mainnet deploy! 🚀
```

---

## 💰 СТОИМОСТЬ:

### **Devnet (тестирование):**
```
✅ Бесплатно!
SOL получаешь с faucet
```

### **Mainnet:**
```
Deploy программы: ~3-5 SOL (единоразово)
Создать питомца: ~0.14 SOL (rent, можно вернуть)
Действия: ~0.000005 SOL (gas fee)
```

---

## 🎯 ПРЕИМУЩЕСТВА:

```
✅ Полная децентрализация
✅ Данные никогда не теряются
✅ Нельзя подделать
✅ Доказуемая уникальность
✅ Реальный burn on-chain
✅ Можно мигрировать в NFT
✅ Глобальная статистика
✅ Community ownership
```

---

## 📚 ДОКУМЕНТАЦИЯ:

- **CONTRACT_SETUP.md** - подробная инструкция по шагам
- **SMART_CONTRACT_PLAN.md** - план разработки и архитектура
- **programs/tamagotchi/src/lib.rs** - исходный код контракта

---

## 🚀 ГОТОВ?

**Начинай с установки Build Tools!**

https://visualstudio.microsoft.com/downloads/

Потом:
```powershell
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked
```

**Удачи! 💪**












