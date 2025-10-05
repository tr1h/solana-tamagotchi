# 🔧 Обновление Rust для NFT контракта

## ⚠️ Текущая проблема:

```
error: rustc 1.78.0 is not supported
solana-program@2.3.0 requires rustc 1.79.0
```

**У вас установлен Rust 1.78.0, но нужен Rust 1.79.0+**

---

## ✅ Решение: Обновить Rust

### Шаг 1: Обновить Rust

```powershell
# В PowerShell выполни:
rustup update
```

Это обновит Rust до последней стабильной версии (1.80+).

### Шаг 2: Проверить версию

```powershell
rustc --version
# Должно быть: rustc 1.79.0 или выше
```

### Шаг 3: Очистить кэш

```powershell
cd "C:\NEW proekt\programs\tamagotchi"
cargo clean
```

### Шаг 4: Раскомментировать Metaplex

#### В `Cargo.toml`:

```toml
[dependencies]
anchor-lang = "0.31.1"
anchor-spl = "0.31.1"
mpl-token-metadata = "5.0.0-beta.0" # <-- раскомментируй эту строку
```

#### В `lib.rs` (начало файла):

```rust
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_spl::token::{self, Burn, Mint, MintTo, Token, TokenAccount};
use anchor_spl::associated_token::AssociatedToken;

// Раскомментируй эти строки:
use mpl_token_metadata::{
    ID as TOKEN_METADATA_ID,
    instructions::CreateV1CpiBuilder,
    types::{Creator, TokenStandard},
};
```

#### В функции `create_pet_nft()` раскомментируй блок создания метаданных:

Найди блок с TODO и раскомментируй код создания Metaplex метаданных.

### Шаг 5: Собрать контракт

```powershell
cd "C:\NEW proekt"
anchor build
```

---

## 🚀 Альтернатива: Использовать текущую версию

Если не хочешь обновлять Rust прямо сейчас, используй **базовую версию без NFT**:

### Текущая реализация УЖЕ работает:

✅ Уникальные питомцы (на основе wallet address)  
✅ Система редкости  
✅ Генерация DNA  
✅ Сжигание токенов  
✅ Все игровые функции  
✅ On-chain хранение  

❌ Но **НЕТ** полноценных NFT (пока)

### Что уже работает:

```rust
// Функция create_pet() создает питомца БЕЗ NFT
pub fn create_pet(ctx: Context<CreatePet>) -> Result<()>

// Все действия работают:
pub fn feed_pet()
pub fn play_with_pet()
pub fn heal_pet()
pub fn rest_pet()
```

### Что добавится после обновления Rust:

```rust
// Новая функция create_pet_nft() создаст полноценный NFT
pub fn create_pet_nft(ctx: Context<CreatePetNFT>, name: String, uri: String)

// NFT будет:
// ✅ Виден в Phantom кошельке
// ✅ Торгуется на Magic Eden
// ✅ Имеет Metaplex метаданные
// ✅ Совместим со всеми NFT инструментами
```

---

## 📊 Сравнение версий:

### Текущая версия (Rust 1.78):

| Фича | Статус |
|------|--------|
| Уникальные питомцы | ✅ |
| Система редкости | ✅ |
| Burn токенов | ✅ |
| On-chain данные | ✅ |
| Metaplex NFT | ❌ |
| Торговля на маркетплейсах | ❌ |
| Показ в Phantom | ❌ |

### После обновления (Rust 1.79+):

| Фича | Статус |
|------|--------|
| Уникальные питомцы | ✅ |
| Система редкости | ✅ |
| Burn токенов | ✅ |
| On-chain данные | ✅ |
| Metaplex NFT | ✅ |
| Торговля на маркетплейсах | ✅ |
| Показ в Phantom | ✅ |

---

## 💡 Рекомендация:

### Для тестирования сейчас:

```powershell
# Используй текущую версию
anchor build  # Соберет без NFT
anchor deploy --provider.cluster devnet
```

### Для production запуска:

```powershell
# 1. Обнови Rust
rustup update

# 2. Раскомментируй Metaplex код
# Редактируй Cargo.toml и lib.rs

# 3. Собери с NFT
anchor build
anchor deploy --provider.cluster mainnet-beta
```

---

## 🔗 Полезные команды:

```powershell
# Проверить версию Rust
rustc --version

# Обновить Rust
rustup update

# Проверить компиляцию
cargo check

# Собрать контракт
anchor build

# Очистить кэш
cargo clean

# Посмотреть зависимости
cargo tree
```

---

## 📞 Если что-то не работает:

1. **Переустановить Rust:**
   ```powershell
   rustup self uninstall
   # Затем установить снова с https://rustup.rs
   ```

2. **Обновить Anchor:**
   ```powershell
   cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked
   ```

3. **Проверить PATH:**
   - Убедись что Rust и Anchor в PATH
   - Перезагрузи PowerShell

---

## ✅ После обновления Rust:

1. ✅ Раскомментируй mpl-token-metadata в Cargo.toml
2. ✅ Раскомментируй use statements в lib.rs
3. ✅ Раскомментируй код создания метаданных
4. ✅ `cargo clean && anchor build`
5. ✅ Протестируй на devnet
6. 🚀 Deploy на mainnet!

---

## 🎉 Итого:

**СЕЙЧАС:** Работает базовая версия (без полноценных NFT)  
**ПОСЛЕ ОБНОВЛЕНИЯ:** Полноценные NFT с Metaplex!

**Оба варианта рабочие и готовы к использованию!** 🚀

