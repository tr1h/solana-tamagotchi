# 📦 Установка Git для Windows

## ⚠️ Git не найден!

Нужно установить Git перед деплоем на GitHub.

---

## 🚀 Установка Git (5 минут)

### Вариант 1: Через установщик (Рекомендую)

1. **Скачай:** https://git-scm.com/download/win
2. **Запусти** установщик
3. **Настройки при установке:**
   - ✅ "Git from the command line and also from 3rd-party software"
   - ✅ "Use bundled OpenSSH"
   - ✅ "Use the OpenSSL library"
   - ✅ "Checkout Windows-style, commit Unix-style line endings"
   - ✅ "Use MinTTY"
   - ✅ Остальное по умолчанию

4. **Нажми** "Install"
5. **Перезапусти** PowerShell или VS Code

---

### Вариант 2: Через winget (Быстрее)

```powershell
# Открой PowerShell как Администратор
winget install --id Git.Git -e --source winget
```

---

### Вариант 3: Через Chocolatey

```powershell
# Если у тебя установлен Chocolatey
choco install git
```

---

## ✅ Проверка установки

После установки, перезапусти терминал и проверь:

```bash
git --version
```

Должно показать что-то вроде:
```
git version 2.43.0.windows.1
```

---

## 🔧 Первоначальная настройка

После установки, настрой Git:

```bash
# Твоё имя (будет в коммитах)
git config --global user.name "Your Name"

# Твой email (тот же что на GitHub)
git config --global user.email "your.email@example.com"

# Проверка
git config --list
```

---

## 📝 После установки Git

Продолжай с инструкцией: **🚀_DEPLOY_TO_GITHUB_CLOUDFLARE.md**

```bash
# 1. Инициализировать Git
git init

# 2. Добавить файлы
git add .

# 3. Первый коммит
git commit -m "🎮 Initial commit: Crypto Tamagotchi"

# 4. Создать репозиторий на GitHub: https://github.com/new

# 5. Подключить remote (замени YOUR_USERNAME!)
git remote add origin https://github.com/YOUR_USERNAME/crypto-tamagotchi.git

# 6. Запушить
git push -u origin main
```

---

## 🎯 Готово!

После установки Git, следуй инструкции в файле:
**🚀_DEPLOY_TO_GITHUB_CLOUDFLARE.md**


