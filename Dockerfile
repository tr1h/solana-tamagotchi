# Anchor development environment
FROM rust:1.78-slim

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    libssl-dev \
    libudev-dev \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Solana CLI
RUN sh -c "$(curl -sSfL https://release.solana.com/stable/install)" && \
    echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc

ENV PATH="/root/.local/share/solana/install/active_release/bin:$PATH"

# Install Anchor
RUN cargo install --git https://github.com/coral-xyz/anchor avm --locked --force && \
    /root/.cargo/bin/avm install latest && \
    /root/.cargo/bin/avm use latest

# Set working directory
WORKDIR /workspace

# Default command
CMD ["bash"]












