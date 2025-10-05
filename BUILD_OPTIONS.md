# 🔨 ВСЕ ВАРИАНТЫ ДЛЯ КОМПИЛЯЦИИ КОНТРАКТА

## ⚡ РЕКОМЕНДАЦИЯ: WSL2 (30-40 минут)

---

## 🎯 ВАРИАНТ 1: WSL2 (САМЫЙ БЫСТРЫЙ!)

### **Что это:**
Ubuntu Linux внутри Windows. Прямой доступ к файлам.

### **Установка:**

#### **Шаг 1: Установить WSL2 (10 минут)**

```powershell
# PowerShell (Admin):
wsl --install

# Перезагрузить компьютер

# После перезагрузки:
# - Откроется Ubuntu терминал
# - Создай username: ivan
# - Создай password: (любой)
```

#### **Шаг 2: Настроить WSL Ubuntu (20 минут)**

Откроется терминал Ubuntu:

```bash
# 1. Обновить систему (2 мин)
sudo apt update && sudo apt upgrade -y

# 2. Установить Rust (3 мин)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
# Выбрать: 1 (default installation)
source $HOME/.cargo/env

# 3. Установить зависимости (5 мин)
sudo apt install -y \
    pkg-config \
    build-essential \
    libudev-dev \
    libssl-dev \
    git

# 4. Установить Solana CLI (2 мин)
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Добавить в .bashrc
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc

# 5. Установить Anchor (5 мин)
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# 6. Проверка
anchor --version
# Должно показать: anchor-cli 0.31.1
```

#### **Шаг 3: Собрать контракт (3 мин)**

```bash
# Перейти в проект (Windows диск C: смонтирован в /mnt/c/)
cd /mnt/c/NEW\ proekt

# Собрать!
anchor build

# Должно скомпилироваться! ✅
```

#### **Готово!**

Program ID будет в:
```bash
solana address -k target/deploy/tamagotchi-keypair.json
```

---

## 🐳 ВАРИАНТ 2: Docker (40-60 минут)

### **Если WSL2 не работает.**

#### **Шаг 1: Установить Docker Desktop**

1. Скачай: https://www.docker.com/products/docker-desktop/
2. Установи
3. Перезагрузи
4. Запусти Docker Desktop

#### **Шаг 2: Build контейнер (30 мин)**

```powershell
# В PowerShell:
cd "C:\NEW proekt"

# Build Docker image (это займет ~30 минут!)
docker-compose build
```

#### **Шаг 3: Запустить контейнер**

```powershell
# Запустить
docker-compose up -d

# Войти в контейнер
docker-compose exec anchor-build bash
```

#### **Шаг 4: Собрать в контейнере**

```bash
# Внутри контейнера:
anchor build

# Готово! ✅
```

---

## ☁️ ВАРИАНТ 3: GitHub Codespaces (ОНЛАЙН!)

### **Компиляция в облаке GitHub.**

#### **Шаг 1: Push на GitHub**

```powershell
cd "C:\NEW proekt"
git init
git add .
git commit -m "Initial commit"
gh repo create tamagotchi-solana --public --push
```

#### **Шаг 2: Открыть Codespace**

1. Открой репо на GitHub
2. Нажми зеленую кнопку "Code"
3. Выбери "Codespaces" → "Create codespace"
4. Откроется VS Code в браузере!

#### **Шаг 3: Установить зависимости**

В терминале Codespace:

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Install dependencies
sudo apt update && sudo apt install -y pkg-config build-essential libudev-dev libssl-dev

# Install Solana
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# Build!
anchor build
```

**Преимущества:**
- ✅ Бесплатно (60 часов/месяц)
- ✅ Быстрая компиляция (мощные серверы)
- ✅ Не нагружает твой комп

---

## 🎮 ВАРИАНТ 4: GitPod (ОНЛАЙН!)

### **Альтернатива Codespaces.**

Создай `.gitpod.yml`:

```yaml
image: rust:1.78-slim

tasks:
  - init: |
      apt-get update && apt-get install -y pkg-config build-essential libudev-dev libssl-dev curl git
      sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
      export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
      cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
      avm install latest
      avm use latest
    command: |
      anchor build
```

Push на GitHub, затем открой:
```
https://gitpod.io/#https://github.com/YOUR_USERNAME/tamagotchi-solana
```

---

## 🚫 ВАРИАНТ 5: Отложить контракт, запустить V1

### **Что работает СЕЙЧАС:**

- ✅ `tamagotchi_devnet.html` - готов!
- ✅ Задеплоен на Vercel
- ✅ Реальный burn токенов on-chain
- ✅ Уникальные питомцы
- ✅ Можно тестировать!

**Минус:**
- ❌ localStorage (данные могут потеряться при очистке кеша)

**План:**
1. Запусти V1 СЕЙЧАС
2. Тестируй 2 недели пока на работе
3. Собери feedback
4. Потом вернешься к контракту (WSL2)
5. Мигрируешь в V2 через 2-3 недели

---

## ⏱️ СРАВНЕНИЕ:

| Вариант | Время установки | Сложность | Где компиляция |
|---------|----------------|-----------|----------------|
| **WSL2** | 30-40 мин | Легко | Локально |
| Docker | 40-60 мин | Средне | Локально |
| Codespaces | 20-30 мин | Легко | Облако GitHub |
| GitPod | 20-30 мин | Легко | Облако GitPod |
| V1 без контракта | 0 мин | Готово! | - |

---

## 💡 МОЯ РЕКОМЕНДАЦИЯ:

### **Если завтра на работу и 2 недели не будет времени:**

**ПЛАН A: Запусти V1 СЕЙЧАС (5 минут)**

```powershell
# Уже готово и задеплоено!
# Просто открой:
https://YOUR_VERCEL_URL.vercel.app/tamagotchi_devnet.html

# Готов к тестам! ✅
```

**ПЛАН B: Вечером/на выходных сделай WSL2 (40 минут)**

Следуй инструкции "ВАРИАНТ 1: WSL2" выше.

---

## 🎯 ЧТО ДЕЛАТЬ ПРЯМО СЕЙЧАС:

### **Вариант 1: Быстрый запуск V1 (5 минут)**

1. Открой Vercel URL
2. Подключи Phantom
3. Протестируй игру
4. Запости в Twitter
5. Собери feedback 2 недели
6. Потом WSL2 + контракт

### **Вариант 2: Сделать WSL2 СЕЙЧАС (40 минут)**

1. `wsl --install` (PowerShell Admin)
2. Перезагрузить
3. Следовать инструкции WSL2 выше
4. `anchor build`
5. Deploy контракт
6. Интегрировать с frontend
7. Запустить!

---

## ❓ ЧТО ВЫБИРАЕШЬ?

**A.** Запустить V1 сейчас, контракт через 2 недели (когда вернешься с работы)

**B.** Сделать WSL2 СЕЙЧАС и закончить контракт сегодня/завтра

**C.** Попробовать Docker

**D.** Codespaces/GitPod (онлайн компиляция)

---

**Скажи какой вариант и я помогу!** 💪












