#!/bin/bash

echo "🚀 УСТАНОВКА ANCHOR В WSL UBUNTU"
echo "================================"
echo ""

# Обновление системы
echo "📦 Шаг 1/5: Обновление системы..."
sudo apt update && sudo apt upgrade -y

# Установка зависимостей
echo ""
echo "🔧 Шаг 2/5: Установка зависимостей..."
sudo apt install -y \
    pkg-config \
    build-essential \
    libudev-dev \
    libssl-dev \
    curl \
    git

# Установка Rust
echo ""
echo "🦀 Шаг 3/5: Установка Rust..."
if ! command -v rustc &> /dev/null; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
    echo 'source $HOME/.cargo/env' >> ~/.bashrc
else
    echo "✅ Rust уже установлен"
    source $HOME/.cargo/env
fi

# Установка Solana CLI
echo ""
echo "☀️ Шаг 4/5: Установка Solana CLI..."
if ! command -v solana &> /dev/null; then
    sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
    echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc
else
    echo "✅ Solana CLI уже установлен"
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
fi

# Установка Anchor
echo ""
echo "⚓ Шаг 5/5: Установка Anchor..."
source $HOME/.cargo/env
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

if ! command -v anchor &> /dev/null; then
    cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
    $HOME/.cargo/bin/avm install latest
    $HOME/.cargo/bin/avm use latest
else
    echo "✅ Anchor уже установлен"
fi

# Проверка
echo ""
echo "✅ УСТАНОВКА ЗАВЕРШЕНА!"
echo "======================="
echo ""
echo "Проверка версий:"
rustc --version
cargo --version
solana --version
anchor --version

echo ""
echo "🎯 ГОТОВО! Теперь можешь собирать контракт:"
echo "cd /mnt/c/NEW\\ proekt"
echo "anchor build"
echo ""












