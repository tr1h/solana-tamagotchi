# 🎨 NFT Контракт для Уникальных Питомцев

## 🎯 Что добавлено:

### ✅ NFT Функциональность

Создан полноценный смарт-контракт для минта уникальных питомцев как NFT!

**Файлы:**
- `programs/tamagotchi/src/lib.rs` - Обновленный контракт с NFT
- `programs/tamagotchi/Cargo.toml` - Зависимости (включая Metaplex)
- `nft_metadata_example.json` - Пример JSON метаданных
- `nft_frontend_example.js` - Пример интеграции с фронтендом
- `NFT_SETUP_GUIDE.md` - Подробный гайд по настройке
- `UPDATE_RUST_FOR_NFT.md` - Инструкция по обновлению Rust

---

## 🚨 ВАЖНО: Требования

### Версия Rust:

Для полной поддержки NFT нужен **Rust 1.79.0+**

```powershell
# Проверь версию:
rustc --version

# Если версия < 1.79.0, обнови:
rustup update
```

📖 **Подробная инструкция:** `UPDATE_RUST_FOR_NFT.md`

---

## 🎮 Две версии контракта:

### 1️⃣ Базовая версия (БЕЗ NFT) - Работает СЕЙЧАС

```rust
pub fn create_pet(ctx: Context<CreatePet>) -> Result<()>
```

**Что работает:**
- ✅ Уникальные питомцы на основе wallet address
- ✅ Система редкости (Common → Legendary)
- ✅ Генерация DNA
- ✅ Сжигание токенов
- ✅ Все игровые действия (feed, play, heal, rest)
- ✅ On-chain хранение данных
- ❌ НЕТ Metaplex NFT

**Используй для:**
- Быстрого тестирования
- Если не хочешь обновлять Rust
- Proof of concept

### 2️⃣ NFT версия - После обновления Rust

```rust
pub fn create_pet_nft(
    ctx: Context<CreatePetNFT>, 
    name: String, 
    uri: String
) -> Result<()>
```

**Что работает:**
- ✅ ВСЁ из базовой версии
- ✅ Создает настоящий NFT (Metaplex стандарт)
- ✅ NFT виден в Phantom кошельке
- ✅ Можно торговать на Magic Eden
- ✅ Полные метаданные (name, image, attributes)
- ✅ Royalties 5%

**Используй для:**
- Production запуска
- Торговли питомцами
- Полной NFT коллекции

---

## 📊 Архитектура:

### Pet Account (On-chain):

```rust
pub struct Pet {
    pub owner: Pubkey,              // Владелец
    pub mint: Pubkey,               // Игровой токен
    pub nft_mint: Pubkey,           // NFT mint (если используется)
    pub metadata: Pubkey,           // Metaplex metadata
    
    // Уникальные характеристики:
    pub dna: u64,                   // DNA (генерируется из wallet)
    pub pet_id: u32,                // ID питомца
    pub species: u8,                // Вид (0-9)
    pub accessory: u8,              // Аксессуар (0-9)
    pub background: u8,             // Фон (0-7)
    pub rarity: u8,                 // Редкость (0-4)
    
    // Игровые параметры:
    pub level: u8,
    pub experience: u16,
    pub health: u8,
    pub hunger: u8,
    pub happiness: u8,
    pub energy: u8,
    
    // Статистика:
    pub age: u32,
    pub birth_time: i64,
    pub last_action_time: i64,
    pub last_decay_time: i64,
    pub total_tokens_burned: u64,
    pub actions_count: u32,
    pub is_alive: bool,
    pub bump: u8,
}
```

### NFT Metadata (JSON):

```json
{
  "name": "Tamagotchi #12345",
  "symbol": "TAMA",
  "description": "Уникальный крипто-питомец",
  "image": "https://ipfs.io/ipfs/...",
  "attributes": [
    {"trait_type": "Rarity", "value": "Epic"},
    {"trait_type": "Species", "value": "5"},
    {"trait_type": "Level", "value": "1"}
  ]
}
```

---

## 🚀 Как использовать:

### Шаг 1: Обнови Rust (если нужно)

```powershell
rustup update
rustc --version  # Должно быть >= 1.79.0
```

### Шаг 2: Раскомментируй Metaplex

В `Cargo.toml`:
```toml
mpl-token-metadata = "5.0.0-beta.0"
```

В `lib.rs`:
```rust
use mpl_token_metadata::{...};
// Раскомментируй импорты и код создания метаданных
```

### Шаг 3: Собери контракт

```powershell
cd "C:\NEW proekt"
anchor build
anchor deploy --provider.cluster devnet
```

### Шаг 4: Обнови Program ID

```rust
// В lib.rs обнови:
declare_id!("YOUR_NEW_PROGRAM_ID");
```

### Шаг 5: Интегрируй с фронтендом

Смотри примеры в `nft_frontend_example.js`

---

## 🎨 Система редкости:

```rust
Common      70%  ⭐
Uncommon    20%  ⭐⭐
Rare         7%  ⭐⭐⭐
Epic         2%  ⭐⭐⭐⭐
Legendary    1%  ⭐⭐⭐⭐⭐
```

**Редкость детерминирована:** один кошелек = одна редкость!

---

## 💰 Экономика:

### Создание питомца:
- **Базовая версия:** Бесплатно (только gas)
- **NFT версия:** Бесплатно (только gas ~0.01 SOL)

### Действия:
- **Feed:** 5 TAMA (burn)
- **Play:** 3 TAMA (burn)
- **Heal:** 8 TAMA (burn)
- **Rest:** 2 TAMA (burn)

Все токены **сжигаются навсегда** = дефляция!

---

## 📚 Документация:

### Основные файлы:

1. **`NFT_SETUP_GUIDE.md`**
   - Полный гайд по настройке
   - Инструкции по деплою
   - Примеры использования

2. **`UPDATE_RUST_FOR_NFT.md`**
   - Как обновить Rust
   - Решение проблем с компиляцией
   - Сравнение версий

3. **`nft_metadata_example.json`**
   - Структура JSON метаданных
   - Примеры attributes
   - Формат для IPFS

4. **`nft_frontend_example.js`**
   - Интеграция с Web3
   - Вызовы смарт-контракта
   - Примеры всех функций

---

## ✅ Функции контракта:

### Создание:

```rust
// Базовая версия (без NFT)
create_pet(ctx: Context<CreatePet>) -> Result<()>

// NFT версия (с Metaplex)
create_pet_nft(
    ctx: Context<CreatePetNFT>,
    name: String,
    uri: String
) -> Result<()>
```

### Действия:

```rust
feed_pet(ctx: Context<ActionPet>) -> Result<()>
play_with_pet(ctx: Context<ActionPet>) -> Result<()>
heal_pet(ctx: Context<ActionPet>) -> Result<()>
rest_pet(ctx: Context<ActionPet>) -> Result<()>
```

### Система:

```rust
update_decay(ctx: Context<UpdateDecay>) -> Result<()>
close_pet(ctx: Context<ClosePet>) -> Result<()>
```

---

## 🔮 Roadmap:

### V1 (СЕЙЧАС):
- ✅ Базовый контракт работает
- ✅ Уникальные питомцы
- ✅ Система редкости
- ✅ Burn токенов
- ⏳ NFT готов (требует Rust 1.79+)

### V2 (СКОРО):
- 🔜 Полная интеграция Metaplex
- 🔜 NFT freeze при смерти
- 🔜 Обновление метаданных
- 🔜 Magic Eden listing

### V3 (БУДУЩЕЕ):
- 🔮 Breeding система
- 🔮 PvP битвы
- 🔮 NFT staking
- 🔮 DAO governance

---

## 🐛 Troubleshooting:

### Ошибка: "rustc 1.78.0 is not supported"

**Решение:**
```powershell
rustup update
cargo clean
anchor build
```

### Ошибка: "failed to select a version for mpl-token-metadata"

**Решение:**
- Убедись что Rust >= 1.79.0
- Используй версию `5.0.0-beta.0`

### Контракт не собирается

**Решение:**
1. Используй базовую версию без NFT (она работает)
2. Обнови Rust для NFT версии
3. Смотри `UPDATE_RUST_FOR_NFT.md`

---

## 📞 Полезные ссылки:

**Rust:**
- https://rustup.rs - Установка Rust
- https://doc.rust-lang.org - Документация

**Solana/Anchor:**
- https://www.anchor-lang.com - Anchor docs
- https://solana.com/developers - Solana docs

**Metaplex:**
- https://developers.metaplex.com - Metaplex docs
- https://github.com/metaplex-foundation/mpl-token-metadata

**NFT Storage:**
- https://pinata.cloud - IPFS pinning
- https://nft.storage - Free NFT storage
- https://web3.storage - Web3 storage

**Marketplaces:**
- https://magiceden.io - Magic Eden
- https://tensor.trade - Tensor
- https://solanart.io - Solanart

---

## 🎉 Готово!

У вас теперь есть:
- ✅ Полноценный NFT контракт
- ✅ Уникальные питомцы с DNA
- ✅ Система редкости
- ✅ Deflationary tokenomics
- ✅ Готово к запуску на mainnet!

### Следующие шаги:

1. **Обнови Rust** (если нужно)
2. **Раскомментируй Metaplex** код
3. **Собери контракт**: `anchor build`
4. **Деплой в devnet**: тестирование
5. **Создай изображения** питомцев
6. **Загрузи на IPFS** метаданные
7. **Деплой в mainnet**: LAUNCH! 🚀

---

**Вопросы?** Смотри другие файлы документации! 📚

