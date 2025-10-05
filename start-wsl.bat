@echo off
echo ============================================
echo   ЗАПУСК UBUNTU WSL ДЛЯ КОМПИЛЯЦИИ КОНТРАКТА
echo ============================================
echo.
echo Откроется терминал Ubuntu.
echo.
echo Выполни там:
echo   cd /mnt/c/NEW\ proekt
echo   chmod +x setup-wsl.sh
echo   ./setup-wsl.sh
echo.
echo ============================================
echo.
pause

wsl -d Ubuntu-22.04
