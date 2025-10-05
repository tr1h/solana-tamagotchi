@echo off
echo ============================================
echo   ДЕПЛОЙ NFT КОНТРАКТА В DEVNET
echo ============================================
echo.

set HOME=%USERPROFILE%

echo Проверяем Solana config...
solana config get

echo.
echo Переключаемся на devnet...
solana config set --url devnet

echo.
echo Проверяем баланс...
solana balance

echo.
echo ВАЖНО: Если баланс 0, получи SOL:
echo   solana airdrop 2
echo.

pause

echo.
echo Деплоим контракт...
anchor deploy --provider.cluster devnet

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo   ✅ NFT КОНТРАКТ ЗАДЕПЛОЕН В DEVNET!
    echo ============================================
    echo.
    echo Теперь можно тестировать NFT минт! 🎉
    echo.
) else (
    echo.
    echo Ошибка деплоя!
    echo Проверь:
    echo 1. Есть ли SOL на балансе
    echo 2. Собран ли контракт (anchor build)
    echo.
)

pause
