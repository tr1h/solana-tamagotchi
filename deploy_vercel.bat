@echo off
chcp 65001 > nul
echo.
echo ============================================
echo   🚀 ДЕПЛОЙ НА VERCEL
echo ============================================
echo.

cd /d "%~dp0"

echo 📂 Текущая папка: %cd%
echo.

REM Проверка Vercel CLI
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI не установлен!
    echo.
    echo Установи:
    echo npm install -g vercel
    echo.
    pause
    exit /b 1
)

echo ✅ Vercel CLI найден
echo.

REM Проверка файла
if not exist "tamagotchi_devnet.html" (
    echo ❌ Файл tamagotchi_devnet.html не найден!
    pause
    exit /b 1
)

echo ✅ Файл найден: tamagotchi_devnet.html
echo.

echo 🚀 Запуск деплоя...
echo.
echo ВАЖНО: Отвечай на вопросы Vercel:
echo - Set up and deploy? → Y
echo - Link to existing? → Y
echo - Project name? → crypto-tamagotchi-devnet
echo.

vercel --prod

echo.
echo ============================================
if %errorlevel% equ 0 (
    echo   ✅ ДЕПЛОЙ УСПЕШЕН!
    echo.
    echo 🌍 Проверь сайт:
    echo https://crypto-tamagotchi-devnet.vercel.app/tamagotchi_devnet.html
) else (
    echo   ❌ ОШИБКА ДЕПЛОЯ!
    echo.
    echo Попробуй через браузер:
    echo https://vercel.com/dashboard
)
echo ============================================
echo.
pause





