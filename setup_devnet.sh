#!/bin/bash

# Скрипт для настройки Solana Devnet и создания токена TAMA
# Для Windows используйте Git Bash или WSL

echo "🚀 Crypto Tamagotchi Devnet Setup"
echo "=================================="

# Проверка установки Solana CLI
if ! command -v solana &> /dev/null
then
    echo "❌ Solana CLI не установлен"
    echo "📥 Установите с: https://docs.solana.com/cli/install-solana-cli-tools"
    echo ""
    echo "Быстрая установка:"
    echo "sh -c \"\$(curl -sSfL https://release.solana.com/stable/install)\""
    exit 1
fi

echo "✅ Solana CLI установлен"
solana --version

# Переключение на devnet
echo ""
echo "🔧 Переключение на Devnet..."
solana config set --url https://api.devnet.solana.com

# Создание кошелька (если не существует)
if [ ! -f ~/.config/solana/id.json ]; then
    echo ""
    echo "👛 Создание нового кошелька..."
    solana-keygen new --outfile ~/.config/solana/id.json
else
    echo ""
    echo "✅ Кошелек уже существует"
fi

# Показать адрес
WALLET_ADDRESS=$(solana address)
echo ""
echo "📝 Ваш адрес: $WALLET_ADDRESS"

# Проверить баланс
BALANCE=$(solana balance)
echo "💰 Баланс: $BALANCE"

# Запросить airdrop если нужно
echo ""
echo "💸 Запрос airdrop SOL..."
solana airdrop 2
sleep 5
solana airdrop 2

echo ""
echo "💰 Новый баланс: $(solana balance)"

# Создать токен
echo ""
echo "🪙 Создание токена TAMA..."
TOKEN_MINT=$(spl-token create-token --decimals 9 | grep -oP 'Creating token \K\w+')

if [ -z "$TOKEN_MINT" ]; then
    echo "❌ Ошибка создания токена"
    exit 1
fi

echo "✅ Token Mint: $TOKEN_MINT"

# Создать token account
echo ""
echo "📦 Создание token account..."
TOKEN_ACCOUNT=$(spl-token create-account $TOKEN_MINT | grep -oP 'Creating account \K\w+')
echo "✅ Token Account: $TOKEN_ACCOUNT"

# Минт токенов
echo ""
echo "⚡ Минт 1,000,000,000 TAMA токенов..."
spl-token mint $TOKEN_MINT 1000000000

# Проверить баланс токенов
echo ""
echo "📊 Баланс токенов:"
spl-token balance $TOKEN_MINT

# Сохранить конфигурацию
echo ""
echo "💾 Сохранение конфигурации..."
cat > devnet_config.json << EOF
{
  "network": "devnet",
  "rpcUrl": "https://api.devnet.solana.com",
  "walletAddress": "$WALLET_ADDRESS",
  "tokenMint": "$TOKEN_MINT",
  "tokenAccount": "$TOKEN_ACCOUNT",
  "decimals": 9,
  "symbol": "TAMA",
  "name": "Crypto Tamagotchi",
  "totalSupply": 1000000000
}
EOF

echo ""
echo "=================================="
echo "✅ SETUP ЗАВЕРШЕН!"
echo "=================================="
echo ""
echo "📋 Детали токена:"
echo "   Token Mint: $TOKEN_MINT"
echo "   Token Account: $TOKEN_ACCOUNT"
echo "   Wallet: $WALLET_ADDRESS"
echo ""
echo "🔗 Проверить токен:"
echo "   https://explorer.solana.com/address/$TOKEN_MINT?cluster=devnet"
echo ""
echo "📝 Следующие шаги:"
echo "1. Откройте devnet_config.json - там все данные"
echo "2. Запустите tamagotchi_devnet.html"
echo "3. В Phantom переключитесь на Devnet (Settings > Developer Settings)"
echo "4. Импортируйте кошелек в Phantom (если нужно)"
echo ""
echo "🎮 Готово к тестированию!"

