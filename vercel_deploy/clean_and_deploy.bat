@echo off
chcp 65001 >nul
echo ╔══════════════════════════════════════════════════════════════╗
echo ║    ОЧИСТКА И ДЕПЛОЙ (FIX REACT ERROR #418)                  ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [1/4] Удаление node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo ✓ node_modules удалён
) else (
    echo ✓ node_modules уже отсутствует
)
echo.

echo [2/4] Проверка vercel.json...
if exist vercel.json (
    findstr /C:"framework" vercel.json >nul
    if %ERRORLEVEL% EQU 0 (
        echo ✓ vercel.json настроен правильно
    ) else (
        echo ✗ ВНИМАНИЕ: vercel.json может быть не обновлён!
    )
) else (
    echo ✗ ОШИБКА: vercel.json не найден!
    pause
    exit /b 1
)
echo.

echo [3/4] Проверка Vercel CLI...
where vercel >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ✗ ОШИБКА: Vercel CLI не установлен!
    echo.
    echo Установите командой: npm i -g vercel
    echo.
    pause
    exit /b 1
)
echo ✓ Vercel CLI найден
echo.

echo [4/4] Запуск деплоя...
echo.
echo ═══════════════════════════════════════════════════════════════
vercel --prod --force
echo ═══════════════════════════════════════════════════════════════
echo.

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ╔══════════════════════════════════════════════════════════════╗
    echo ║                    ✓ ДЕПЛОЙ УСПЕШЕН!                        ║
    echo ╚══════════════════════════════════════════════════════════════╝
    echo.
    echo 🎯 Проверьте сайт:
    echo    https://crypto-tamagotchi-devnet.vercel.app
    echo.
    echo 🔍 Откройте консоль браузера (F12) и убедитесь:
    echo    ✓ НЕТ ошибки "Minified React error #418"
    echo    ✓ Игра загружается нормально
    echo    ✓ Solana кошелёк работает
    echo.
) else (
    echo.
    echo ╔══════════════════════════════════════════════════════════════╗
    echo ║                    ✗ ОШИБКА ДЕПЛОЯ!                         ║
    echo ╚══════════════════════════════════════════════════════════════╝
    echo.
    echo Попробуйте:
    echo 1. Проверьте подключение к интернету
    echo 2. Войдите в Vercel: vercel login
    echo 3. Проверьте настройки проекта в Dashboard
    echo.
)

pause






