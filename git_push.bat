@echo off
chcp 65001 >nul
cd /d "C:\NEW proekt"

echo ✅ Настраиваем Git...
git config core.autocrlf true

echo.
echo 📦 Добавляем файлы...
git add .

echo.
echo 💾 Создаём коммит...
git commit -m "🎮 Initial commit: Crypto Tamagotchi on Solana"

echo.
echo 🌿 Переименовываем ветку в main...
git branch -M main

echo.
echo 🚀 Пушим на GitHub...
git push -u origin main

echo.
echo ✅ ГОТОВО! Проверь: https://github.com/tr1h/crypto-tamagotchi
pause
