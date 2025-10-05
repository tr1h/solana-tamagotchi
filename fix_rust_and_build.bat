@echo off
echo ============================================
echo   ИСПРАВЛЕНИЕ И СБОРКА NFT КОНТРАКТА
echo ============================================
echo.

REM Устанавливаем переменные
set HOME=%USERPROFILE%

echo 1. Обновляем Solana toolchain...
echo.
solana-install update

echo.
echo 2. Проверяем версию Rust...
rustc --version

echo.
echo 3. Собираем контракт...
echo.

cd /d "%~dp0"
anchor build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo   УСПЕХ! NFT контракт собран!
    echo ============================================
    echo.
    echo Файл: target\deploy\tamagotchi.so
    echo.
    echo Теперь деплой:
    echo   anchor deploy --provider.cluster devnet
    echo.
) else (
    echo.
    echo ============================================
    echo   Если ошибка, попробуй:
    echo ============================================
    echo.
    echo   cargo build-sbf
    echo.
)

pause
