@echo off
echo ======================================
echo     VERCEL RE-DEPLOY (FIXED VERSION)
echo ======================================
echo.

echo Checking Vercel CLI...
where vercel >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Vercel CLI not found!
    echo Install it: npm i -g vercel
    pause
    exit /b 1
)

echo.
echo Current directory: %cd%
echo.
echo Starting deployment...
echo.

vercel --prod

echo.
echo ======================================
echo     DEPLOYMENT COMPLETE!
echo ======================================
echo.
echo Check your site at:
echo https://crypto-tamagotchi-devnet.vercel.app
echo.
echo Open browser console (F12) to verify:
echo   - No React errors
echo   - Game loads correctly
echo   - Solana wallet works
echo.
pause






