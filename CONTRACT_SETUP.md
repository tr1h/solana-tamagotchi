# 🔨 УСТАНОВКА И ДЕПЛОЙ СМАРТ-КОНТРАКТА

## ⚠️ ВАЖНО: Установка Build Tools (Windows)

### **ШАГ 1: Visual Studio Build Tools**

**Без этого Rust не скомпилируется!**

1. **Скачай Build Tools:**
   ```
   https://visualstudio.microsoft.com/downloads/
   → Scroll down → "Tools for Visual Studio 2022"
   → Build Tools for Visual Studio 2022 → Download
   ```

2. **Установи с этими компонентами:**
   ```
   ✅ Desktop development with C++
   ✅ MSVC v143 - VS 2022 C++ x64/x86 build tools
   ✅ Windows 10/11 SDK
   ```

3. **Перезагрузи компьютер!**

---

## 📦 ШАГ 2: Установка Rust

```powershell
# Скачай и запусти:
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Выбери: 1 (default installation)
# После установки:
rustc --version
cargo --version
```

---

## 🔧 ШАГ 3: Solana CLI

```powershell
# PowerShell (Admin):
cmd /c "curl https://release.solana.com/v1.18.0/solana-install-init-x86_64-pc-windows-msvc.exe --output C:\solana-install-tmp\solana-install-init.exe --create-dirs"

C:\solana-install-tmp\solana-install-init.exe v1.18.0

# Добавь в PATH:
# C:\Users\ИМЯ\.local\share\solana\install\active_release\bin

# Проверка:
solana --version
```

---

## ⚓ ШАГ 4: Anchor CLI

```powershell
# Установка Anchor:
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked --force

# Это займет ~20-30 минут!

# Проверка:
anchor --version
```

---

## 🚀 ШАГ 5: Настройка Wallet

```powershell
# В папке проекта:
cd "C:\NEW proekt"

# Используем существующий devnet wallet:
solana config set --keypair wallet-devnet.json

# Установить devnet:
solana config set --url devnet

# Проверка:
solana config get
solana balance
```

---

## 🔨 ШАГ 6: Build Контракта

```powershell
# В папке проекта:
cd "C:\NEW proekt"

# Build:
anchor build

# Это создаст:
# - target/deploy/tamagotchi.so (программа)
# - target/deploy/tamagotchi-keypair.json (keypair)
# - target/idl/tamagotchi.json (IDL для frontend)
```

---

## 🎯 ШАГ 7: Получить Program ID

```powershell
# Узнать Program ID:
solana address -k target/deploy/tamagotchi-keypair.json

# Скопируй этот адрес!
# Например: 7xYzK3H2vF9nQtZ8mP4sL1wE6bV5cU3jA2hR9dT6yN8m
```

---

## ✏️ ШАГ 8: Обновить Program ID в коде

Открой `programs/tamagotchi/src/lib.rs`:

```rust
// БЫЛО:
declare_id!("11111111111111111111111111111111");

// СТАЛО (твой Program ID):
declare_id!("7xYzK3H2vF9nQtZ8mP4sL1wE6bV5cU3jA2hR9dT6yN8m");
```

Открой `Anchor.toml`:

```toml
[programs.devnet]
tamagotchi = "7xYzK3H2vF9nQtZ8mP4sL1wE6bV5cU3jA2hR9dT6yN8m"
```

---

## 🔁 ШАГ 9: Rebuild

```powershell
# После изменения Program ID:
anchor build

# Проверка что всё ОК:
# Должно скомпилироваться без ошибок
```

---

## ☁️ ШАГ 10: Deploy на Devnet

```powershell
# Убедись что есть SOL:
solana balance
# Нужно минимум 5-10 SOL для деплоя

# Если мало - получи с faucet:
solana airdrop 5

# Deploy:
anchor deploy

# Вывод покажет:
# Program Id: 7xYzK3H2vF9nQtZ8mP4sL1wE6bV5cU3jA2hR9dT6yN8m
# Success!
```

---

## ✅ ШАГ 11: Проверка

```powershell
# Проверь что программа задеплоена:
solana program show 7xYzK3H2vF9nQtZ8mP4sL1wE6bV5cU3jA2hR9dT6yN8m

# Должно показать:
# Program Id: ...
# Owner: BPFLoaderUpgradeab1e...
# ProgramData Address: ...
# Authority: твой wallet
# Last Deployed In Slot: ...
# Data Length: ... bytes
```

---

## 🧪 ШАГ 12: Тестирование

Создай файл `test-contract.js`:

```javascript
const anchor = require("@coral-xyz/anchor");
const { SystemProgram, PublicKey } = require("@solana/web3.js");

async function testContract() {
    // Setup
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    
    const programId = new PublicKey("7xYzK3H2vF9nQtZ8mP4sL1wE6bV5cU3jA2hR9dT6yN8m");
    const idl = require("./target/idl/tamagotchi.json");
    const program = new anchor.Program(idl, programId, provider);
    
    const tokenMint = new PublicKey("74KGR9mdiiiqVW9QCnFmZz8cyj39ZoCaKexrSxF8fpQD");
    
    // Найти PDA для питомца
    const [petPDA, bump] = await PublicKey.findProgramAddress(
        [Buffer.from("pet"), provider.wallet.publicKey.toBuffer()],
        programId
    );
    
    console.log("Pet PDA:", petPDA.toString());
    
    try {
        // Создать питомца
        console.log("Создаем питомца...");
        await program.methods
            .createPet()
            .accounts({
                pet: petPDA,
                owner: provider.wallet.publicKey,
                tokenMint: tokenMint,
                systemProgram: SystemProgram.programId,
            })
            .rpc();
        
        console.log("✅ Питомец создан!");
        
        // Загрузить данные
        const pet = await program.account.pet.fetch(petPDA);
        console.log("Питомец:", {
            id: pet.petId,
            species: pet.species,
            rarity: pet.rarity,
            level: pet.level,
            health: pet.health,
        });
        
    } catch (err) {
        if (err.message.includes("already in use")) {
            console.log("Питомец уже существует!");
            const pet = await program.account.pet.fetch(petPDA);
            console.log("Текущий питомец:", {
                id: pet.petId,
                level: pet.level,
                health: pet.health,
            });
        } else {
            console.error("Ошибка:", err);
        }
    }
}

testContract().then(() => console.log("Done!")).catch(console.error);
```

Запустить:
```powershell
node test-contract.js
```

---

## 🎮 ШАГ 13: Интеграция с Frontend

Обнови `tamagotchi_devnet.html`:

```javascript
// Добавь в начало:
const PROGRAM_ID = new window.solanaWeb3.PublicKey("7xYzK3H2vF9nQtZ8mP4sL1wE6bV5cU3jA2hR9dT6yN8m");

// Загрузка IDL:
const IDL = await fetch('/target/idl/tamagotchi.json').then(r => r.json());

// Создание программы:
const program = new anchor.Program(IDL, PROGRAM_ID, provider);

// Найти PDA питомца:
const [petPDA] = await window.solanaWeb3.PublicKey.findProgramAddress(
    [Buffer.from("pet"), wallet.publicKey.toBuffer()],
    PROGRAM_ID
);

// Создать питомца:
await program.methods
    .createPet()
    .accounts({
        pet: petPDA,
        owner: wallet.publicKey,
        tokenMint: TOKEN_MINT,
        systemProgram: window.solanaWeb3.SystemProgram.programId,
    })
    .rpc();

// Покормить:
await program.methods
    .feedPet()
    .accounts({
        pet: petPDA,
        owner: wallet.publicKey,
        userTokenAccount: userTokenAccountPDA,
        tokenMint: TOKEN_MINT,
        tokenProgram: TOKEN_PROGRAM_ID,
    })
    .rpc();

// Загрузить данные:
const pet = await program.account.pet.fetch(petPDA);
console.log("Pet data:", pet);
```

---

## 🚀 MAINNET DEPLOY

Когда всё протестировано на devnet:

```powershell
# 1. Переключись на mainnet:
solana config set --url mainnet-beta

# 2. Проверь баланс (нужно ~10 SOL):
solana balance

# 3. Deploy:
anchor deploy --provider.cluster mainnet

# 4. Обнови Program ID в коде:
# Используй НОВЫЙ mainnet Program ID!

# 5. Rebuild и redeploy если нужно

# 6. Обнови frontend:
# - Поменяй RPC на mainnet
# - Поменяй token mint на mainnet
# - Поменяй Program ID на mainnet
```

---

## 🐛 TROUBLESHOOTING:

### **Ошибка: `link.exe not found`**
```
Решение: Установи Visual Studio Build Tools (ШАГ 1)
```

### **Ошибка: `anchor: command not found`**
```
Решение: Добавь в PATH:
C:\Users\ИМЯ\.cargo\bin
```

### **Ошибка: `insufficient funds`**
```
Решение:
solana airdrop 5
# или
# https://faucet.solana.com
```

### **Ошибка: `Program account already in use`**
```
Решение: Питомец уже создан для этого wallet!
Используй другой wallet или удали старого питомца.
```

### **Ошибка при compile: `failed to run custom build command`**
```
Решение:
rustup update
cargo clean
anchor build
```

---

## 📊 CHECKLIST:

```
[ ] Visual Studio Build Tools установлен
[ ] Rust установлен (rustc --version)
[ ] Solana CLI установлен (solana --version)
[ ] Anchor CLI установлен (anchor --version)
[ ] Wallet настроен (solana balance)
[ ] anchor build работает
[ ] Program ID получен
[ ] Program ID обновлен в коде
[ ] Rebuild выполнен
[ ] anchor deploy работает
[ ] Контракт проверен (solana program show)
[ ] Тест прошел успешно
[ ] Frontend обновлен
```

---

## 💪 ГОТОВО!

Теперь у тебя:
- ✅ Смарт-контракт на Solana
- ✅ Полная децентрализация
- ✅ On-chain хранение
- ✅ Реальный burn в контракте
- ✅ Уникальные питомцы on-chain

**Начинай с ШАГ 1!** 🚀












