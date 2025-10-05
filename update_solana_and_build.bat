@echo off
echo ============================================
echo   ОБНОВЛЕНИЕ SOLANA + СБОРКА NFT КОНТРАКТА
echo ============================================
echo.

set HOME=%USERPROFILE%

echo Шаг 1: Обновляем Solana CLI...
echo.
solana-install update

echo.
echo Шаг 2: Проверяем версии...
echo.
solana --version
rustc --version

echo.
echo Шаг 3: Собираем NFT контракт...
echo.
cd /d "%~dp0"
anchor build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo   ✅ SUCCESS! NFT КОНТРАКТ ГОТОВ!
    echo ============================================
    echo.
    echo 📦 Файл: target\deploy\tamagotchi.so
    echo 🔑 Keypair: target\deploy\tamagotchi-keypair.json
    echo.
    echo 🚀 Теперь деплоим в devnet:
    echo    anchor deploy --provider.cluster devnet
    echo.
) else (
    echo.
    echo ============================================
    echo   ⚠️  Если ошибка, попробуй Plan B:
    echo ============================================
    echo.
    echo Используй более новый Rust:
    echo   rustup override set stable
    echo   cargo build-sbf
    echo.
)

pause
