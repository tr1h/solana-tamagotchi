@echo off
chcp 65001 > nul
echo ========================================
echo   Deploying Crypto Tamagotchi to Vercel
echo ========================================
echo.

cd /d "C:\NEW proekt"
echo Current directory: %CD%
echo.

vercel --yes

pause













