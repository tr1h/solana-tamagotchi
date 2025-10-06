# PowerShell скрипт для настройки Solana Devnet и создания токена TAMA
# Для Windows

Write-Host "🚀 Crypto Tamagotchi Devnet Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Проверка установки Solana CLI
$solanaInstalled = Get-Command solana -ErrorAction SilentlyContinue
if (-not $solanaInstalled) {
    Write-Host "❌ Solana CLI не установлен" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 Установка Solana CLI для Windows:" -ForegroundColor Yellow
    Write-Host "   1. Скачайте с: https://github.com/solana-labs/solana/releases" -ForegroundColor Yellow
    Write-Host "   2. Или установите через:" -ForegroundColor Yellow
    Write-Host "      cmd /c ""curl https://release.solana.com/v1.17.0/solana-install-init-x86_64-pc-windows-msvc.exe --output C:\solana-install-tmp\solana-install-init.exe --create-dirs""" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 После установки перезапустите PowerShell" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Solana CLI установлен" -ForegroundColor Green
solana --version
Write-Host ""

# Переключение на devnet
Write-Host "🔧 Переключение на Devnet..." -ForegroundColor Yellow
solana config set --url https://api.devnet.solana.com
Write-Host ""

# Путь к кошельку
$walletPath = "$env:USERPROFILE\.config\solana\id.json"

# Создание кошелька (если не существует)
if (-not (Test-Path $walletPath)) {
    Write-Host "👛 Создание нового кошелька..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.config\solana" | Out-Null
    solana-keygen new --outfile $walletPath --no-bip39-passphrase
} else {
    Write-Host "✅ Кошелек уже существует: $walletPath" -ForegroundColor Green
}
Write-Host ""

# Показать адрес
$walletAddress = solana address
Write-Host "📝 Ваш адрес: $walletAddress" -ForegroundColor Cyan

# Проверить баланс
$balance = solana balance
Write-Host "💰 Текущий баланс: $balance" -ForegroundColor Cyan
Write-Host ""

# Запросить airdrop
Write-Host "💸 Запрос airdrop SOL (может занять время)..." -ForegroundColor Yellow
try {
    solana airdrop 2 2>&1 | Out-Null
    Start-Sleep -Seconds 5
    solana airdrop 2 2>&1 | Out-Null
    Start-Sleep -Seconds 5
} catch {
    Write-Host "⚠️  Airdrop может не сработать если лимит исчерпан" -ForegroundColor Yellow
    Write-Host "   Попробуйте позже или используйте: https://faucet.solana.com/" -ForegroundColor Yellow
}

$newBalance = solana balance
Write-Host "💰 Новый баланс: $newBalance" -ForegroundColor Green
Write-Host ""

# Создать токен
Write-Host "🪙 Создание токена TAMA..." -ForegroundColor Yellow
$tokenOutput = spl-token create-token --decimals 9 2>&1 | Out-String
$tokenMint = if ($tokenOutput -match "Creating token (\w+)") { $matches[1] } else { $null }

if (-not $tokenMint) {
    Write-Host "❌ Ошибка создания токена" -ForegroundColor Red
    Write-Host "   Вывод: $tokenOutput" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Возможные причины:" -ForegroundColor Yellow
    Write-Host "   - Недостаточно SOL (получите больше с faucet)" -ForegroundColor Yellow
    Write-Host "   - Проблемы с сетью" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Token Mint: $tokenMint" -ForegroundColor Green
Write-Host ""

# Создать token account
Write-Host "📦 Создание token account..." -ForegroundColor Yellow
$accountOutput = spl-token create-account $tokenMint 2>&1 | Out-String
$tokenAccount = if ($accountOutput -match "Creating account (\w+)") { $matches[1] } else { 
    # Возможно аккаунт уже существует, попробуем получить его
    $associatedAccount = spl-token accounts $tokenMint 2>&1 | Select-String -Pattern "\w{32,}" | ForEach-Object { $_.Matches[0].Value } | Select-Object -First 1
    $associatedAccount
}

Write-Host "✅ Token Account: $tokenAccount" -ForegroundColor Green
Write-Host ""

# Минт токенов
Write-Host "⚡ Минт 1,000,000,000 TAMA токенов..." -ForegroundColor Yellow
spl-token mint $tokenMint 1000000000
Write-Host ""

# Проверить баланс токенов
Write-Host "📊 Баланс токенов:" -ForegroundColor Cyan
spl-token balance $tokenMint
Write-Host ""

# Сохранить конфигурацию
Write-Host "💾 Сохранение конфигурации..." -ForegroundColor Yellow

$config = @{
    network = "devnet"
    rpcUrl = "https://api.devnet.solana.com"
    walletAddress = $walletAddress
    tokenMint = $tokenMint
    tokenAccount = $tokenAccount
    decimals = 9
    symbol = "TAMA"
    name = "Crypto Tamagotchi"
    totalSupply = 1000000000
    explorerUrl = "https://explorer.solana.com/address/$tokenMint?cluster=devnet"
} | ConvertTo-Json

$config | Out-File -FilePath "devnet_config.json" -Encoding UTF8

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "✅ SETUP ЗАВЕРШЕН!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Детали токена:" -ForegroundColor Yellow
Write-Host "   Token Mint: $tokenMint" -ForegroundColor White
Write-Host "   Token Account: $tokenAccount" -ForegroundColor White
Write-Host "   Wallet: $walletAddress" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Проверить токен:" -ForegroundColor Yellow
Write-Host "   https://explorer.solana.com/address/$tokenMint?cluster=devnet" -ForegroundColor Blue
Write-Host ""
Write-Host "📝 Следующие шаги:" -ForegroundColor Yellow
Write-Host "   1. ✅ devnet_config.json создан - там все данные" -ForegroundColor White
Write-Host "   2. 🌐 Откройте tamagotchi_devnet.html в браузере" -ForegroundColor White
Write-Host "   3. 🦊 В Phantom: Settings > Developer Settings > Change Network > Devnet" -ForegroundColor White
Write-Host "   4. 💰 Получите devnet SOL: https://faucet.solana.com/" -ForegroundColor White
Write-Host ""
Write-Host "🎮 Готово к тестированию!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Дополнительная информация:" -ForegroundColor Yellow
Write-Host "   - Конфиг кошелька: $walletPath" -ForegroundColor White
Write-Host "   - Чтобы импортировать в Phantom, скопируйте приватный ключ" -ForegroundColor White
Write-Host "   - Используйте: solana-keygen pubkey $walletPath для адреса" -ForegroundColor White















