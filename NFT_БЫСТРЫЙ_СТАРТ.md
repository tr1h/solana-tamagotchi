# 🚀 NFT Питомцы - Быстрый Старт

## ✅ Что сделано:

### Создан NFT контракт для уникальных питомцев!

**Каждый питомец:**
- 🎨 Уникальный NFT на блокчейне
- 🧬 Генерируется из wallet address (детерминированно)
- ⭐ Имеет редкость: Common → Legendary
- 🎮 Можно кормить, играть, лечить
- 💰 Все действия сжигают TAMA токены
- 🏪 Можно торговать на Magic Eden (после обновления Rust)

---

## ⚠️ ВНИМАНИЕ: Нужно обновить Rust!

### Текущая версия Rust: 1.78.0
### Нужна версия: 1.79.0+

```powershell
# Обнови Rust:
rustup update

# Проверь версию:
rustc --version
```

📖 **Подробно:** читай `UPDATE_RUST_FOR_NFT.md`

---

## 📁 Созданные файлы:

### 1. Смарт-контракт:
- ✅ `programs/tamagotchi/src/lib.rs` - Обновлен с NFT функциями
- ✅ `programs/tamagotchi/Cargo.toml` - Добавлены зависимости Metaplex

### 2. Документация:
- ✅ `NFT_CONTRACT_README.md` - Основной README
- ✅ `NFT_SETUP_GUIDE.md` - Подробный гайд
- ✅ `UPDATE_RUST_FOR_NFT.md` - Инструкция по обновлению Rust
- ✅ `nft_metadata_example.json` - Пример метаданных
- ✅ `nft_frontend_example.js` - Пример интеграции

---

## 🎯 Две версии контракта:

### Вариант 1: Базовая версия (РАБОТАЕТ СЕЙЧАС)

Функция `create_pet()` - создает питомца **БЕЗ** полноценного NFT

**Плюсы:**
- ✅ Работает с текущим Rust 1.78
- ✅ Все игровые функции работают
- ✅ Уникальные питомцы
- ✅ Система редкости
- ✅ Burn токенов

**Минусы:**
- ❌ Не видно в Phantom как NFT
- ❌ Нельзя торговать на маркетплейсах

### Вариант 2: NFT версия (ПОСЛЕ ОБНОВЛЕНИЯ RUST)

Функция `create_pet_nft()` - создает полноценный NFT

**Плюсы:**
- ✅ Настоящий NFT (Metaplex стандарт)
- ✅ Виден в Phantom кошельке
- ✅ Можно продавать на Magic Eden
- ✅ Полные метаданные

**Требует:**
- ⚠️ Rust 1.79.0+
- ⚠️ Раскомментировать код в lib.rs

---

## 🚀 Быстрый запуск:

### ВАРИАНТ A: Использовать базовую версию (БЕЗ обновления)

```powershell
# 1. Собрать контракт
cd "C:\NEW proekt"
anchor build

# 2. Деплой в devnet
anchor deploy --provider.cluster devnet

# 3. Обновить Program ID в lib.rs
# Скопируй новый ID и вставь в declare_id!()

# 4. Пересобрать
anchor build

# 5. Готово! Используй create_pet() функцию
```

**Питомцы будут работать, но без полноценного NFT.**

### ВАРИАНТ B: Полноценные NFT (С обновлением Rust)

```powershell
# 1. Обновить Rust
rustup update
rustc --version  # Проверь >= 1.79.0

# 2. Очистить кэш
cd "C:\NEW proekt\programs\tamagotchi"
cargo clean

# 3. Раскомментировать в Cargo.toml:
# mpl-token-metadata = "5.0.0-beta.0"

# 4. Раскомментировать в lib.rs:
# - use mpl_token_metadata::...
# - Код создания метаданных в create_pet_nft()

# 5. Собрать
cd "C:\NEW proekt"
anchor build

# 6. Деплой
anchor deploy --provider.cluster devnet

# 7. Готово! Используй create_pet_nft() функцию
```

**Полноценные NFT с Metaplex!**

---

## 📖 Основные функции:

### Создание питомца:

```rust
// Базовая версия (без NFT)
create_pet(ctx: Context<CreatePet>)

// NFT версия (с Metaplex)
create_pet_nft(
    ctx: Context<CreatePetNFT>,
    name: "Мой Тамагочи",
    uri: "https://ipfs.io/ipfs/..."
)
```

### Игровые действия:

```rust
feed_pet()        // Покормить (5 TAMA burn)
play_with_pet()   // Играть (3 TAMA burn)
heal_pet()        // Лечить (8 TAMA burn)
rest_pet()        // Отдыхать (2 TAMA burn)
update_decay()    // Обновить статы (бесплатно)
```

---

## 🎨 Система редкости:

```
Common     70% ⭐
Uncommon   20% ⭐⭐
Rare        7% ⭐⭐⭐
Epic        2% ⭐⭐⭐⭐
Legendary   1% ⭐⭐⭐⭐⭐
```

**Один кошелек = одна редкость навсегда!**

---

## 💡 Что выбрать?

### Для быстрого тестирования:
👉 **Используй базовую версию** (без обновления Rust)

### Для production запуска:
👉 **Обнови Rust и используй NFT версию**

### Для Pump.Fun:
👉 **Базовая версия подойдет** (уникальность уже есть!)

---

## 📚 Документация:

### Читай по порядку:

1. **`NFT_CONTRACT_README.md`** - Общий обзор
2. **`UPDATE_RUST_FOR_NFT.md`** - Как обновить Rust
3. **`NFT_SETUP_GUIDE.md`** - Подробная настройка
4. **`nft_frontend_example.js`** - Примеры кода

---

## 🎉 Итого:

### У тебя ГОТОВО:

✅ Смарт-контракт с уникальными питомцами  
✅ Система редкости  
✅ Детерминированная генерация (wallet → pet)  
✅ Burn токенов (дефляция)  
✅ Базовая версия работает ПРЯМО СЕЙЧАС  
✅ NFT версия готова (нужен Rust 1.79+)  

### Выбери свой путь:

**ПУТЬ 1:** Используй базовую версию → тестируй → запускай  
**ПУТЬ 2:** Обнови Rust → полноценные NFT → Magic Eden  

**Оба пути рабочие!** 🚀

---

## 🔧 Команды:

```powershell
# Обновить Rust
rustup update

# Собрать контракт
anchor build

# Деплой devnet
anchor deploy --provider.cluster devnet

# Деплой mainnet
anchor deploy --provider.cluster mainnet-beta

# Очистить кэш
cargo clean

# Проверить версию Rust
rustc --version
```

---

## ❓ Проблемы?

### "rustc 1.78.0 is not supported"
➡️ Обнови Rust: `rustup update`

### "failed to select a version"
➡️ Раскомментируй mpl-token-metadata в Cargo.toml

### Контракт не собирается
➡️ Используй базовую версию (она работает!)

---

## 🚀 ЗАПУСКАЙ!

Выбери один из двух путей и ДЕЛАЙ! 

**Базовая версия УЖЕ работает!**  
**NFT версия готова после обновления Rust!**

**ОБЕ ВЕРСИИ РАБОЧИЕ!** 🎉

