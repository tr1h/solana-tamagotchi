# 🎮 Solana Playground - Деплой NFT контракта

## 🎯 ЧТО ЭТО:

**Solana Playground** - официальный онлайн IDE от Solana Foundation
- https://beta.solpg.io
- Как CodeSandbox, но для Solana
- Используется профессионалами
- Деплой в devnet и mainnet
- **БЕСПЛАТНО!**

---

## 🚀 ПОШАГОВАЯ ИНСТРУКЦИЯ:

### Шаг 1: Открой Solana Playground

```
1. Иди на https://beta.solpg.io
2. Нажми "Create a new project"
3. Выбери "Anchor" template
```

### Шаг 2: Загрузи свой код

**В файл `lib.rs`:**
1. Удали весь код template
2. Скопируй весь код из `C:\NEW proekt\programs\tamagotchi\src\lib.rs`
3. Вставь в редактор

**В файл `Cargo.toml`:**
1. Открой Cargo.toml
2. Скопируй из `C:\NEW proekt\programs\tamagotchi\Cargo.toml`
3. Вставь

### Шаг 3: Собери контракт

```
1. Нажми кнопку "Build" (значок молотка)
2. Дождись сообщения "Build successful"
3. Готово! Контракт собран!
```

### Шаг 4: Подключи кошелек

```
1. В левом меню нажми "Wallet"
2. Playground автоматически создаст кошелек
3. Или импортируй свой Phantom
```

### Шаг 5: Получи devnet SOL

```
1. В настройках выбери "Devnet"
2. Нажми "Airdrop" 
3. Получишь 2 SOL бесплатно!
```

### Шаг 6: Деплой!

```
1. Нажми кнопку "Deploy"
2. Выбери "Devnet"
3. Дождись "Deploy successful"
4. Скопируй Program ID
```

### Шаг 7: Тестируй NFT!

```javascript
// В Test tab или отдельном файле:

const programId = new PublicKey("ТУТ_ТВОЙ_PROGRAM_ID");

// Создай NFT питомца:
await program.methods
  .createPetNft(
    "Мой Тамагочи",
    "ipfs://твой_uri"
  )
  .accounts({...})
  .rpc();

// NFT создан в devnet!
```

---

## 📋 ЧТО МОЖНО ТЕСТИТЬ:

### ✅ Все функции контракта:
```rust
create_pet_nft()  - Создать NFT
feed_pet()        - Покормить
play_with_pet()   - Играть
heal_pet()        - Лечить
rest_pet()        - Отдохнуть
update_decay()    - Обновить статы
```

### ✅ Проверить NFT:
```
1. Открой Solana Explorer (devnet)
2. Найди свой Program ID
3. Увидишь все транзакции
4. NFT создан!
```

### ✅ Подключить Phantom:
```
1. Переключи Phantom на devnet
2. Подключи к Playground
3. Минт NFT
4. Увидишь NFT в кошельке!
```

---

## 🎯 ПРЕИМУЩЕСТВА:

### 🚀 Быстро:
- Не нужно настраивать окружение
- Не нужно устанавливать Rust/Anchor
- Всё в браузере!

### 💰 Бесплатно:
- Devnet SOL бесплатный
- Unlimited builds
- Unlimited deploys

### ✅ Профессионально:
- Используется везде
- Официальный инструмент
- Production-ready

---

## 🔥 ПОСЛЕ ТЕСТОВ В DEVNET:

### Готов к mainnet?

```
1. В Playground выбери "Mainnet"
2. Deploy (нужен реальный SOL ~0.5 SOL)
3. Твой NFT контракт в production!
4. Пользователи могут минтить!
```

---

## 💡 ПОЛЕЗНЫЕ ССЫЛКИ:

**Solana Playground:**
https://beta.solpg.io

**Solana Explorer (devnet):**
https://explorer.solana.com/?cluster=devnet

**Devnet Faucet:**
https://faucet.solana.com

**Phantom (devnet mode):**
Settings → Developer Settings → Testnet Mode

---

## 📝 ПРИМЕР ТЕСТА:

### Test.ts в Playground:

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Tamagotchi } from "../target/types/tamagotchi";
import { PublicKey, Keypair } from "@solana/web3.js";

describe("tamagotchi", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Tamagotchi as Program<Tamagotchi>;

  it("Создает NFT питомца", async () => {
    // Генерируем ключи для NFT
    const nftMint = Keypair.generate();
    
    // Получаем PDA питомца
    const [petPDA] = await PublicKey.findProgramAddress(
      [Buffer.from("pet"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    // Метаданные
    const name = "Test Pet";
    const uri = "https://test.com/metadata.json";

    // Создаем NFT питомца!
    const tx = await program.methods
      .createPetNft(name, uri)
      .accounts({
        pet: petPDA,
        owner: provider.wallet.publicKey,
        nftMint: nftMint.publicKey,
        // ... остальные аккаунты
      })
      .signers([nftMint])
      .rpc();

    console.log("✅ NFT создан! TX:", tx);

    // Проверяем данные питомца
    const petData = await program.account.pet.fetch(petPDA);
    console.log("Pet ID:", petData.petId);
    console.log("Rarity:", petData.rarity);
    console.log("NFT Mint:", petData.nftMint.toString());
  });
});
```

---

## ✅ ГОТОВО!

**С Solana Playground ты:**
- ✅ Соберешь NFT контракт
- ✅ Задеплоишь в devnet
- ✅ Протестишь все функции
- ✅ Создашь реальные NFT (testnet)
- ✅ Убедишься что всё работает
- 🚀 Потом деплой в mainnet!

---

## 🎉 ДАВАЙ ПОЕХАЛИ!

**1. Открой:** https://beta.solpg.io  
**2. Create project**  
**3. Вставь код**  
**4. Build**  
**5. Deploy**  
**6. ТЕСТИРУЙ NFT!** 🎮

Это легитимный профессиональный способ!  
Используют ВСЕ Solana разработчики! 💪
