@echo off
chcp 65001 >nul
echo.
echo ╔════════════════════════════════════════════╗
echo ║    💰 TAMA TOKEN FAUCET - Раздача         ║
echo ╚════════════════════════════════════════════╝
echo.

REM Проверка что Python установлен
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python не найден!
    echo    Установи Python: https://python.org
    pause
    exit /b 1
)

REM Проверка что wallet-devnet.json существует
if not exist "wallet-devnet.json" (
    echo ❌ wallet-devnet.json не найден!
    echo    Создай кошелек сначала
    pause
    exit /b 1
)

REM Проверка что tama_faucet.py существует
if not exist "tama_faucet.py" (
    echo ❌ tama_faucet.py не найден!
    pause
    exit /b 1
)

echo ✅ Всё готово к раздаче!
echo.
echo 📝 Инструкция:
echo    1. Тестер присылает адрес кошелька
echo    2. Вставь его ниже и нажми Enter
echo    3. Скрипт отправит 1000 TAMA автоматически
echo.
echo ═══════════════════════════════════════════════
echo.

:input
set /p WALLET=💳 Введи адрес кошелька тестера: 

if "%WALLET%"=="" (
    echo.
    echo ⚠️  Адрес не может быть пустым!
    echo.
    goto input
)

echo.
echo 🚀 Отправляю 1000 TAMA на %WALLET%...
echo.

python tama_faucet.py %WALLET%

echo.
echo ═══════════════════════════════════════════════
echo.
set /p CONTINUE=Раздать еще? (y/n): 

if /i "%CONTINUE%"=="y" goto input
if /i "%CONTINUE%"=="yes" goto input
if /i "%CONTINUE%"=="д" goto input
if /i "%CONTINUE%"=="да" goto input

echo.
echo 👋 Готово! Спасибо за раздачу!
pause


