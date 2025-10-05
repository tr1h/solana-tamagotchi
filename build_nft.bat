@echo off
echo ============================================
echo   СБОРКА NFT КОНТРАКТА
echo ============================================
echo.

REM Устанавливаем HOME переменную
set HOME=%USERPROFILE%
set LOCALAPPDATA=%USERPROFILE%\AppData\Local

echo HOME установлен: %HOME%
echo.
echo Запускаем сборку...
echo.

cd /d "%~dp0"
anchor build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo   УСПЕХ! Контракт собран!
    echo ============================================
    echo.
    echo Теперь можешь деплоить:
    echo   anchor deploy --provider.cluster devnet
    echo.
) else (
    echo.
    echo ============================================
    echo   ОШИБКА при сборке!
    echo ============================================
    echo.
)

pause
