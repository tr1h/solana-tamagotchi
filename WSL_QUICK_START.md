# ⚡ БЫСТРЫЙ СТАРТ WSL2

## ✅ WSL2 УЖЕ УСТАНОВЛЕН!

**Ubuntu 22.04** готов к работе!

---

## 🚀 КАК ЗАПУСТИТЬ (5 ШАГОВ):

### **ШАГ 1: Открыть Ubuntu**

Есть 3 способа:

**Способ A:** Нажми `Win + R` → введи `wsl` → Enter

**Способ B:** В меню Пуск найди "Ubuntu 22.04" → запусти

**Способ C:** В PowerShell:
```powershell
wsl
```

Откроется терминал Ubuntu! 🐧

---

### **ШАГ 2: Перейти в проект**

В Ubuntu терминале:

```bash
cd /mnt/c/NEW\ proekt
```

**Объяснение:**
- `/mnt/c/` = диск `C:\` в Windows
- Все файлы доступны!

---

### **ШАГ 3: Запустить установку**

```bash
# Дать права на выполнение
chmod +x setup-wsl.sh

# Запустить!
./setup-wsl.sh
```

**Это установит:**
- ✅ Rust
- ✅ Solana CLI
- ✅ Anchor CLI
- ✅ Все зависимости

**Время: ~15-20 минут**

Во время установки:
- Может попросить пароль (введи пароль Ubuntu)
- Rust попросит подтвердить: просто нажми Enter
- Всё установится автоматически!

---

### **ШАГ 4: Перезагрузить shell**

После установки:

```bash
# Перезагрузить переменные окружения
source ~/.bashrc

# Или просто закрой и открой Ubuntu заново
```

---

### **ШАГ 5: СОБРАТЬ КОНТРАКТ! 🔨**

```bash
# В папке проекта
cd /mnt/c/NEW\ proekt

# Build!
anchor build
```

**Должно скомпилироваться!** ✅

---

## 📊 ЧТО ДАЛЬШЕ:

После успешной компиляции:

### **1. Получить Program ID:**

```bash
solana address -k target/deploy/tamagotchi-keypair.json
```

Скопируй этот адрес!

### **2. Обновить Program ID в коде:**

Открой в Windows: `programs/tamagotchi/src/lib.rs`

Найди:
```rust
declare_id!("11111111111111111111111111111111");
```

Замени на:
```rust
declare_id!("ТВОЙ_PROGRAM_ID");
```

### **3. Rebuild:**

```bash
anchor build
```

### **4. Deploy на devnet:**

```bash
# Настроить devnet
solana config set --url devnet

# Настроить wallet
solana config set --keypair /mnt/c/NEW\ proekt/wallet-devnet.json

# Проверить баланс
solana balance

# Если нужен SOL, получи с faucet:
solana airdrop 5

# Deploy!
anchor deploy
```

**ГОТОВО!** 🎉

---

## 🐛 TROUBLESHOOTING:

### **Проблема: "command not found: rustc"**

```bash
source ~/.bashrc
# или
source $HOME/.cargo/env
```

### **Проблема: "command not found: solana"**

```bash
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
```

### **Проблема: "command not found: anchor"**

```bash
$HOME/.cargo/bin/avm use latest
```

### **Проблема: "permission denied"**

```bash
chmod +x setup-wsl.sh
```

---

## 💡 ПОЛЕЗНЫЕ КОМАНДЫ:

### **Проверить версии:**

```bash
rustc --version
cargo --version
solana --version
anchor --version
```

### **Выйти из WSL:**

```bash
exit
```

### **Открыть файлы Windows в WSL:**

```bash
# Текущая папка в Windows Explorer
explorer.exe .

# Открыть файл в VS Code
code programs/tamagotchi/src/lib.rs
```

### **Скопировать из WSL в Windows:**

Файлы уже доступны! Они в `C:\NEW proekt`

---

## 🎯 КРАТКАЯ ШПАРГАЛКА:

```bash
# 1. Открыть Ubuntu (Win+R → wsl)
wsl

# 2. Перейти в проект
cd /mnt/c/NEW\ proekt

# 3. Установить всё
chmod +x setup-wsl.sh && ./setup-wsl.sh

# 4. Перезагрузить shell
source ~/.bashrc

# 5. Собрать!
anchor build

# 6. Получить Program ID
solana address -k target/deploy/tamagotchi-keypair.json

# 7. Обновить lib.rs (в Windows)

# 8. Rebuild
anchor build

# 9. Deploy
solana config set --url devnet
solana config set --keypair /mnt/c/NEW\ proekt/wallet-devnet.json
solana airdrop 5
anchor deploy

# 10. ГОТОВО! 🎉
```

---

## 🚀 НАЧИНАЙ!

**Открой Ubuntu и запусти setup-wsl.sh!**

Через 20 минут контракт будет готов! 💪














