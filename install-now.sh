#!/bin/bash
set -e

clear
echo "=================================="
echo "  УСТАНОВКА ANCHOR - ЗАПУЩЕНА!"
echo "=================================="
echo ""

# Go to project
cd /mnt/c/NEW\ proekt || { echo "❌ Не найден проект!"; exit 1; }
echo "✅ В папке: $(pwd)"
echo ""

# 1. Update system
echo "📦 Обновление системы (может занять 2-3 минуты)..."
sudo apt-get update -qq
echo "✅ Система обновлена"
echo ""

# 2. Install dependencies
echo "🔧 Установка зависимостей..."
sudo apt-get install -y -qq pkg-config build-essential libudev-dev libssl-dev curl git
echo "✅ Зависимости установлены"
echo ""

# 3. Install Rust
echo "🦀 Установка Rust..."
if ! command -v rustc &> /dev/null; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
    echo "✅ Rust установлен: $(rustc --version)"
else
    echo "✅ Rust уже есть: $(rustc --version)"
    source $HOME/.cargo/env
fi
echo ""

# 4. Install Solana
echo "☀️ Установка Solana CLI..."
if ! command -v solana &> /dev/null; then
    sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
    echo "✅ Solana установлен"
else
    echo "✅ Solana уже есть"
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
fi
echo ""

# 5. Install Anchor (самое долгое - 5-10 минут)
echo "⚓ Установка Anchor (это займет 5-10 минут, жди)..."
source $HOME/.cargo/env
if ! command -v anchor &> /dev/null; then
    cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
    $HOME/.cargo/bin/avm install latest
    $HOME/.cargo/bin/avm use latest
    echo "✅ Anchor установлен"
else
    echo "✅ Anchor уже есть"
fi
echo ""

# Update bashrc
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc

echo "=================================="
echo "  ✅ ВСЁ УСТАНОВЛЕНО!"
echo "=================================="
echo ""
echo "Версии:"
source $HOME/.cargo/env
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
rustc --version
cargo --version
solana --version
anchor --version || $HOME/.cargo/bin/anchor --version
echo ""
echo "🎯 ТЕПЕРЬ МОЖНО СОБИРАТЬ!"
echo ""
echo "Выполни эти команды:"
echo "  source ~/.bashrc"
echo "  anchor build"
echo ""












