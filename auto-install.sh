#!/bin/bash

# Автоматическая установка без подтверждений
export DEBIAN_FRONTEND=noninteractive

echo "🚀 АВТОМАТИЧЕСКАЯ УСТАНОВКА ANCHOR"
echo "===================================="
echo ""

# 1. Обновление системы
echo "📦 1/5: Обновление системы..."
sudo -E apt-get update -y > /dev/null 2>&1
sudo -E apt-get upgrade -y > /dev/null 2>&1
echo "✅ Система обновлена"

# 2. Установка зависимостей
echo ""
echo "🔧 2/5: Установка зависимостей..."
sudo -E apt-get install -y \
    pkg-config \
    build-essential \
    libudev-dev \
    libssl-dev \
    curl \
    git > /dev/null 2>&1
echo "✅ Зависимости установлены"

# 3. Установка Rust
echo ""
echo "🦀 3/5: Установка Rust..."
if ! command -v rustc &> /dev/null; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y > /dev/null 2>&1
    source $HOME/.cargo/env
    echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
    echo "✅ Rust установлен: $(rustc --version)"
else
    echo "✅ Rust уже установлен: $(rustc --version)"
fi

# 4. Установка Solana CLI
echo ""
echo "☀️ 4/5: Установка Solana CLI..."
if ! command -v solana &> /dev/null; then
    sh -c "$(curl -sSfL https://release.solana.com/stable/install)" > /dev/null 2>&1
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
    echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc
    echo "✅ Solana установлен: $(~/.local/share/solana/install/active_release/bin/solana --version)"
else
    echo "✅ Solana уже установлен: $(solana --version)"
fi

# 5. Установка Anchor
echo ""
echo "⚓ 5/5: Установка Anchor (это займет ~5-10 минут)..."
source $HOME/.cargo/env
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

if ! command -v anchor &> /dev/null; then
    cargo install --git https://github.com/coral-xyz/anchor avm --locked --force > /tmp/avm-install.log 2>&1
    if [ $? -eq 0 ]; then
        $HOME/.cargo/bin/avm install latest > /tmp/anchor-install.log 2>&1
        $HOME/.cargo/bin/avm use latest > /dev/null 2>&1
        echo "✅ Anchor установлен: $($HOME/.cargo/bin/anchor --version)"
    else
        echo "❌ Ошибка установки AVM. См. /tmp/avm-install.log"
        exit 1
    fi
else
    echo "✅ Anchor уже установлен: $(anchor --version)"
fi

# 6. Добавить переменные в bashrc
echo ""
echo "🔧 Настройка окружения..."
grep -qxF 'export PATH="$HOME/.cargo/bin:$PATH"' ~/.bashrc || echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
grep -qxF 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' ~/.bashrc || echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc

echo ""
echo "✅ ВСЁ УСТАНОВЛЕНО!"
echo "==================="
echo ""
echo "Версии:"
source $HOME/.cargo/env
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
echo "  Rust: $(rustc --version 2>/dev/null || echo 'не найден')"
echo "  Cargo: $(cargo --version 2>/dev/null || echo 'не найден')"
echo "  Solana: $(solana --version 2>/dev/null || echo 'не найден')"
echo "  Anchor: $(anchor --version 2>/dev/null || $HOME/.cargo/bin/anchor --version 2>/dev/null || echo 'не найден')"
echo ""
echo "🎯 ТЕПЕРЬ МОЖНО СОБИРАТЬ КОНТРАКТ!"
echo ""
echo "Выполни:"
echo "  source ~/.bashrc"
echo "  cd /mnt/c/NEW\\ proekt"
echo "  anchor build"
echo ""














