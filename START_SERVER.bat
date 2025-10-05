@echo off
chcp 65001 > nul
echo.
echo ===============================================
echo   🎮 Crypto Tamagotchi - Server Launcher
echo ===============================================
echo.
echo 📍 Project: C:\NEW proekt
echo 🌐 Starting HTTP server on port 8000...
echo.

cd /d "C:\NEW proekt"

echo Starting server...
start "Tamagotchi Server" cmd /k "npx --yes http-server -p 8000 -c-1"

echo Waiting for server to start...
timeout /t 5 /nobreak >nul

echo Opening game in browser...
start http://localhost:8000/tamagotchi_devnet.html

timeout /t 1 /nobreak >nul
start http://localhost:8000/dashboard.html

echo.
echo ===============================================
echo   ✅ Server is running!
echo ===============================================
echo.
echo 🎮 Game: http://localhost:8000/tamagotchi_devnet.html
echo 📊 Dashboard: http://localhost:8000/dashboard.html
echo.
echo ⚠️  Keep the server window open!
echo    To stop: Close the "Tamagotchi Server" window
echo.
echo ===============================================
echo   📝 Next Steps:
echo ===============================================
echo.
echo 1. In Phantom wallet:
echo    - Settings → Developer Settings
echo    - Change Network → Devnet
echo.
echo 2. Add TAMA token:
echo    - Settings → Manage Token List → +
echo    - Paste: 74KGR9mdiiiqVW9QCnFmZz8cyj39ZoCaKexrSxF8fpQD
echo.
echo 3. Get TAMA tokens:
echo    Option A: Transfer from main wallet
echo      spl-token transfer 74KGR9mdiiiqVW9QCnFmZz8cyj39ZoCaKexrSxF8fpQD 10000 YOUR_ADDRESS
echo.
echo    Option B: Import wallet-devnet.json into Phantom
echo.
echo 4. In game: Connect wallet and play!
echo.
pause