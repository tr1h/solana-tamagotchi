# 📝 Crypto Tamagotchi Smart Contract

Это смарт-контракт на Solana (Rust + Anchor framework) для хранения состояния питомцев on-chain.

## 🎯 Функциональность

### Основные функции:

1. **create_pet** - Создание нового питомца
   - Сохраняет питомца on-chain
   - Инициализирует все параметры
   - Привязывается к кошельку владельца

2. **feed_pet** - Кормление питомца
   - Увеличивает голод (+30)
   - Добавляет здоровье (+5)
   - Дает опыт (+5)

3. **play_with_pet** - Игра с питомцем
   - Увеличивает счастье (+25)
   - Уменьшает энергию (-15)
   - Дает опыт (+8)

4. **heal_pet** - Лечение питомца
   - Восстанавливает здоровье до 100
   - Дает опыт (+3)

5. **rest_pet** - Отдых питомца
   - Увеличивает энергию (+40)
   - Добавляет здоровье (+10)
   - Дает опыт (+3)

6. **get_pet_info** - Получение информации о питомце

### Автоматические механизмы:

- **Деградация статов** - Со временем голод, счастье и энергия уменьшаются
- **Эволюция** - Автоматическая эволюция при достижении опыта
- **Смерть** - Если здоровье падает до 0, питомец "умирает"

## 📊 Структура данных Pet

```rust
pub struct Pet {
    pub owner: Pubkey,           // Владелец
    pub name: String,            // Имя (до 32 символов)
    pub stage: u8,               // Стадия эволюции (0-4)
    pub level: u16,              // Уровень
    pub health: u8,              // Здоровье (0-100)
    pub hunger: u8,              // Голод (0-100)
    pub happiness: u8,           // Счастье (0-100)
    pub energy: u8,              // Энергия (0-100)
    pub experience: u32,         // Опыт
    pub age: u32,                // Возраст в днях
    pub total_earned: u64,       // Всего заработано
    pub created_at: i64,         // Время создания
    pub last_action: i64,        // Последнее действие
    pub is_alive: bool,          // Жив ли питомец
}
```

## 🛠 Установка и сборка

### Требования:

1. **Rust** (>= 1.70)
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Solana CLI** (>= 1.16)
   ```bash
   sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
   ```

3. **Anchor CLI** (>= 0.29)
   ```bash
   cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
   avm install latest
   avm use latest
   ```

### Сборка проекта:

```bash
# Инициализация (если нужно)
anchor init

# Сборка
anchor build

# Получение Program ID
anchor keys list

# Обновить Program ID в lib.rs и Anchor.toml
# Заменить TAMAxxxxx... на реальный ID

# Пересобрать
anchor build
```

## 🚀 Деплой

### В Devnet:

```bash
# Настроить devnet
solana config set --url https://api.devnet.solana.com

# Создать кошелек (если нет)
solana-keygen new

# Получить airdrop
solana airdrop 2

# Деплой
anchor deploy --provider.cluster devnet

# Проверить
solana program show <PROGRAM_ID> --url devnet
```

### В Mainnet:

```bash
# ВАЖНО: Тщательно протестируйте в devnet перед mainnet!

# Настроить mainnet
solana config set --url https://api.mainnet-beta.solana.com

# Деплой (требует SOL для комиссии)
anchor deploy --provider.cluster mainnet
```

## 🧪 Тестирование

### Unit тесты:

```bash
# Запуск тестов
anchor test
```

### Интеграционные тесты:

Создайте файл `tests/tamagotchi.ts`:

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Tamagotchi } from "../target/types/tamagotchi";

describe("tamagotchi", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Tamagotchi as Program<Tamagotchi>;

  it("Create pet", async () => {
    const tx = await program.methods
      .createPet("My Pet")
      .accounts({
        owner: provider.wallet.publicKey,
      })
      .rpc();
    
    console.log("Transaction:", tx);
  });

  it("Feed pet", async () => {
    const tx = await program.methods
      .feedPet()
      .accounts({
        owner: provider.wallet.publicKey,
      })
      .rpc();
    
    console.log("Fed pet:", tx);
  });
});
```

## 🔗 Интеграция с фронтендом

### JavaScript/TypeScript пример:

```javascript
import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";

// Подключение к программе
const connection = new Connection("https://api.devnet.solana.com");
const wallet = window.solana; // Phantom
const provider = new anchor.AnchorProvider(connection, wallet, {});
const programId = new PublicKey("YOUR_PROGRAM_ID");
const program = new anchor.Program(IDL, programId, provider);

// Создать питомца
async function createPet(name) {
  const [petPDA] = await PublicKey.findProgramAddress(
    [Buffer.from("pet"), wallet.publicKey.toBuffer()],
    programId
  );

  const tx = await program.methods
    .createPet(name)
    .accounts({
      pet: petPDA,
      owner: wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();

  console.log("Pet created:", tx);
}

// Покормить питомца
async function feedPet() {
  const [petPDA] = await PublicKey.findProgramAddress(
    [Buffer.from("pet"), wallet.publicKey.toBuffer()],
    programId
  );

  const tx = await program.methods
    .feedPet()
    .accounts({
      pet: petPDA,
      owner: wallet.publicKey,
    })
    .rpc();

  console.log("Pet fed:", tx);
}

// Получить информацию о питомце
async function getPetInfo() {
  const [petPDA] = await PublicKey.findProgramAddress(
    [Buffer.from("pet"), wallet.publicKey.toBuffer()],
    programId
  );

  const pet = await program.account.pet.fetch(petPDA);
  console.log("Pet info:", pet);
  return pet;
}
```

## 📋 События (Events)

Смарт-контракт генерирует события для мониторинга:

- **PetCreated** - Когда создается питомец
- **PetFed** - Когда питомец покормлен
- **PetPlayed** - Когда играли с питомцем
- **PetHealed** - Когда питомец вылечен
- **PetRested** - Когда питомец отдыхал
- **PetEvolved** - Когда питомец эволюционировал

Подписка на события:

```javascript
program.addEventListener("PetEvolved", (event) => {
  console.log("Pet evolved to stage:", event.newStage);
});
```

## 💰 Стоимость деплоя

Примерные затраты на Solana:

- **Devnet**: Бесплатно (используйте faucet)
- **Mainnet**: ~2-5 SOL (зависит от размера программы)

Стоимость создания аккаунта Pet: ~0.002 SOL (rent-exempt)

## 🔒 Безопасность

### Реализованные проверки:

✅ Только владелец может взаимодействовать с питомцем  
✅ Проверка состояния "жив/мертв"  
✅ Валидация входных данных  
✅ Защита от переполнения  
✅ PDA (Program Derived Address) для детерминированных адресов  

### Рекомендации:

1. **Аудит** - Проведите аудит перед mainnet деплоем
2. **Тестирование** - Тщательно протестируйте все функции
3. **Ограничения** - Установите лимиты на действия (anti-spam)
4. **Обновления** - Предусмотрите механизм обновления программы

## 🚧 Roadmap

### V1.0 (текущая):
- [x] Базовые функции (feed, play, heal, rest)
- [x] Эволюция
- [x] Деградация статов

### V2.0 (планируется):
- [ ] NFT интеграция
- [ ] Breeding (скрещивание питомцев)
- [ ] Marketplace
- [ ] Staking токенов

### V3.0 (будущее):
- [ ] Битвы питомцев
- [ ] Гильдии
- [ ] Редкие предметы
- [ ] Seasonal events

## 📚 Дополнительные ресурсы

- **Anchor Book**: https://book.anchor-lang.com/
- **Solana Docs**: https://docs.solana.com/
- **Rust Book**: https://doc.rust-lang.org/book/
- **Solana Cookbook**: https://solanacookbook.com/

## 🐛 Известные проблемы

1. **Clock drift** - Время может немного отличаться между валидаторами
2. **Transaction size** - Большие транзакции могут не пройти
3. **Compute units** - Сложные операции могут превысить лимит

## 💡 Советы по оптимизации

1. **Минимизируйте размер аккаунтов** - Меньше rent
2. **Batch операции** - Группируйте действия
3. **Используйте PDA** - Экономия на проверках
4. **Кэшируйте данные** - Меньше RPC запросов

## 📞 Поддержка

Если возникли вопросы:
- GitHub Issues
- Solana Discord: https://discord.gg/solana
- Anchor Discord: https://discord.gg/anchor

---

**Удачи с деплоем! 🚀**













