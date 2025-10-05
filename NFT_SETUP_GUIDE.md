# 🎨 NFT Питомцы - Гайд по настройке

## 🎯 Что добавлено:

### ✅ NFT Контракт
Теперь питомцы создаются как настоящие NFT на Solana через Metaplex Token Metadata!

### 🔑 Основные фичи:

1. **Уникальные NFT** - каждый питомец = уникальный NFT
2. **Metaplex стандарт** - совместимость с Magic Eden, Phantom и другими
3. **Детерминированная генерация** - один кошелек = один уникальный питомец
4. **Система редкости** - Common, Uncommon, Rare, Epic, Legendary
5. **On-chain метаданные** - все данные хранятся в блокчейне
6. **Торговля** - можно продавать/покупать на маркетплейсах
7. **Механика смерти** - мертвый питомец = frozen NFT

---

## 📋 Структура контракта:

### Две функции создания:

#### 1. `create_pet_nft()` - NFT версия (НОВАЯ)
```rust
pub fn create_pet_nft(
    ctx: Context<CreatePetNFT>, 
    name: String,  // Имя питомца ("Мой Тамагочи")
    uri: String    // URL метаданных JSON
) -> Result<()>
```

**Что происходит:**
- Генерируется уникальный питомец на основе wallet address
- Создается NFT mint (decimals = 0)
- Минтится 1 NFT на кошелек владельца
- Создаются Metaplex метаданные
- Сохраняются все характеристики питомца on-chain

**Преимущества:**
- ✅ Настоящий NFT
- ✅ Можно торговать
- ✅ Видно в Phantom
- ✅ Совместимо с маркетплейсами

#### 2. `create_pet()` - Старая версия (БЕЗ NFT)
```rust
pub fn create_pet(ctx: Context<CreatePet>) -> Result<()>
```

**Для обратной совместимости** - создает питомца без NFT.

---

## 🎨 Метаданные NFT:

### JSON структура:

Смотри файл `nft_metadata_example.json` для полного примера.

**Основные поля:**
```json
{
  "name": "Tamagotchi #12345",
  "symbol": "TAMA",
  "description": "Описание питомца",
  "image": "URL к картинке",
  "attributes": [
    {"trait_type": "Rarity", "value": "Epic"},
    {"trait_type": "Level", "value": "1"},
    {"trait_type": "Health", "value": "100"}
  ]
}
```

---

## 🖼️ Где хранить изображения:

### Варианты:

1. **IPFS (рекомендуется)**
   - Децентрализованное хранение
   - Постоянные URL
   - Используй Pinata.cloud или nft.storage

2. **Arweave**
   - Вечное хранение
   - Один раз оплатил = навсегда

3. **Твой сервер**
   - Простой вариант для тестов
   - Не рекомендуется для production

### Пример IPFS URL:
```
https://ipfs.io/ipfs/QmXXXXXXXXXXXXXXXXXXX/pet_12345.png
```

---

## 🚀 Как использовать:

### 1. Подготовка метаданных:

```bash
# Создай JSON файлы для каждого питомца
# Загрузи на IPFS/Arweave
# Получи URI для каждого JSON
```

### 2. Вызов функции с фронтенда:

```javascript
const name = "Мой Питомец";
const uri = "https://ipfs.io/ipfs/QmXXX.../metadata.json";

await program.methods
  .createPetNft(name, uri)
  .accounts({
    pet: petPDA,
    owner: wallet.publicKey,
    nftMint: nftMint.publicKey,
    nftTokenAccount: nftTokenAccount,
    metadata: metadataPDA,
    tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  })
  .signers([nftMint])
  .rpc();
```

### 3. NFT появится в кошельке:

- Откройте Phantom
- Перейдите в раздел "Collectibles"
- Увидите своего питомца!

---

## 🎯 Редкость питомцев:

```rust
// Генерируется из wallet address
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
```

**Каждый кошелек** генерирует фиксированную редкость!

---

## 💰 Экономика:

### Создание NFT питомца:
- **Стоимость:** Только gas fees (~0.01 SOL)
- **Получаете:** Уникальный NFT в кошелек
- **Ограничения:** 1 питомец на кошелек

### Действия с питомцем:
- **Feed:** 5 TAMA (burn)
- **Play:** 3 TAMA (burn)
- **Heal:** 8 TAMA (burn)
- **Rest:** 2 TAMA (burn)

### Торговля:
- ✅ Можно продать на Magic Eden
- ✅ Можно подарить другу
- ✅ Можно использовать как PFP
- ✅ Редкие питомцы дороже!

---

## ⚰️ Механика смерти:

### Когда питомец умирает:
- `health` достигает 0
- `is_alive` становится `false`
- Все действия блокируются

### В будущем (V2):
- NFT будет заморожен (freeze)
- Изображение сменится на 💀
- Невозможно продать/передать
- Останется как "память" в кошельке

---

## 🔧 Билд и деплой:

### 1. Установи зависимости:
```bash
cd programs/tamagotchi
cargo build-bpf
```

### 2. Деплой в devnet:
```bash
anchor build
anchor deploy --provider.cluster devnet
```

### 3. Получи Program ID:
```bash
anchor keys list
```

### 4. Обнови declare_id!:
```rust
declare_id!("YOUR_NEW_PROGRAM_ID");
```

---

## 📊 Структура Pet Account:

```rust
pub struct Pet {
    pub owner: Pubkey,              // 32 - Владелец
    pub mint: Pubkey,               // 32 - Игровой токен
    pub nft_mint: Pubkey,           // 32 - NFT mint
    pub metadata: Pubkey,           // 32 - Metaplex metadata
    pub dna: u64,                   // 8  - Уникальный DNA
    pub pet_id: u32,                // 4  - ID питомца
    pub species: u8,                // 1  - Вид (0-9)
    pub accessory: u8,              // 1  - Аксессуар (0-9)
    pub background: u8,             // 1  - Фон (0-7)
    pub rarity: u8,                 // 1  - Редкость (0-4)
    pub level: u8,                  // 1  - Уровень
    pub experience: u16,            // 2  - Опыт
    pub health: u8,                 // 1  - Здоровье
    pub hunger: u8,                 // 1  - Голод
    pub happiness: u8,              // 1  - Счастье
    pub energy: u8,                 // 1  - Энергия
    pub age: u32,                   // 4  - Возраст
    pub birth_time: i64,            // 8  - Время рождения
    pub last_action_time: i64,      // 8  - Последнее действие
    pub last_decay_time: i64,       // 8  - Последний decay
    pub total_tokens_burned: u64,   // 8  - Всего сожжено
    pub actions_count: u32,         // 4  - Количество действий
    pub is_alive: bool,             // 1  - Жив ли?
    pub bump: u8,                   // 1  - PDA bump
}
// Total: 192 bytes
```

---

## 🎨 Визуальные варианты:

### 10 видов питомцев (species 0-9):
- 🐣 Птенец
- 🐥 Утенок
- 🐶 Щенок
- 🐱 Котенок
- 🐰 Зайчик
- 🐼 Панда
- 🦊 Лисенок
- 🐯 Тигренок
- 🦁 Львенок
- 🐉 Дракончик

### 10 аксессуаров (accessory 0-9):
- Без аксессуара
- 🎩 Шляпа
- 👓 Очки
- 🎀 Бантик
- 👑 Корона
- 🎸 Гитара
- ⚽ Мяч
- 🍕 Пицца
- 💎 Алмаз
- 🌟 Звезда

### 8 фонов (background 0-7):
- Голубой
- Розовый
- Зеленый
- Фиолетовый
- Оранжевый
- Голубой лед
- Красный
- Желтый

---

## 🔮 Roadmap:

### V1 (СЕЙЧАС):
- ✅ NFT создание
- ✅ Уникальные питомцы
- ✅ Система редкости
- ✅ On-chain хранение
- ✅ Burn токенов

### V2 (СКОРО):
- 🔜 NFT freeze при смерти
- 🔜 Обновление метаданных
- 🔜 Эволюция питомцев
- 🔜 Breeding система
- 🔜 Marketplace интеграция

### V3 (БУДУЩЕЕ):
- 🔮 PvP битвы
- 🔮 Tournaments
- 🔮 Staking NFT
- 🔮 DAO governance

---

## 📞 Полезные ссылки:

**Metaplex Docs:**
https://developers.metaplex.com/

**Token Metadata Program:**
https://github.com/metaplex-foundation/mpl-token-metadata

**IPFS Storage:**
- Pinata: https://pinata.cloud
- nft.storage: https://nft.storage
- Web3.Storage: https://web3.storage

**NFT Marketplaces:**
- Magic Eden: https://magiceden.io
- Tensor: https://tensor.trade
- Solanart: https://solanart.io

---

## 🎉 Готово к запуску!

Теперь у вас есть полноценный NFT контракт для создания уникальных питомцев!

**Следующие шаги:**
1. Подготовь изображения питомцев
2. Загрузи на IPFS
3. Создай JSON метаданные
4. Деплой контракт
5. Обнови фронтенд
6. **LAUNCH! 🚀**

