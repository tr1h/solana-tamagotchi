# 🐣 Crypto Tamagotchi - Play-to-Earn NFT Game on Solana

A modern Web3 Tamagotchi game built on Solana blockchain with real-time mechanics, NFT pets, and TAMA token economy.

## 🎮 Live Demo

**Devnet (Testing):** [Play Now](https://crypto-tamagotchi-devnet-chtd6u8sb-ivans-projects-4717924b.vercel.app)

## ✨ Features

### 🐾 Core Gameplay
- **Create Unique Pets** - Each pet is a unique NFT with DNA-based traits
- **Real-Time Care System** - Feed, play, heal, and rest with your pet
- **Experience & Leveling** - Earn XP and level up your pet
- **Lives System** - 3 lives per pet, resurrection available
- **Decay Mechanics** - Stats decrease in real-time based on blockchain time

### 💰 Economy
- **TAMA Token** - In-game currency (SPL Token on Solana)
- **Free Actions** - All gameplay is currently free for testing
- **Token Faucet** - Get free TAMA tokens for testing
- **Referral System** - Invite friends and earn rewards

### 🎨 NFT Features
- **Rarity System** - Common, Uncommon, Rare, Epic, Legendary
- **Unique DNA** - Each pet has unique genetic code
- **Visual Traits** - Species, accessories, backgrounds
- **On-Chain Metadata** - All data stored on Solana

### 🔐 Security
- **Anchor Framework** - Smart contracts built with Rust
- **Wallet Integration** - Phantom wallet support
- **Anti-Scam Protection** - Built-in security measures
- **Real-Time Updates** - Live blockchain data

## 🚀 Tech Stack

### Frontend
- **Pure HTML/CSS/JS** - No frameworks, fast loading
- **Solana Web3.js** - Blockchain interaction
- **Lottie Animations** - Smooth pet animations
- **Responsive Design** - Mobile-first approach

### Backend
- **Solana Blockchain** - Devnet for testing, Mainnet ready
- **Anchor Framework** - Smart contract development
- **Rust** - High-performance smart contracts
- **SPL Token Program** - Token management

### Infrastructure
- **Vercel** - Current hosting
- **Cloudflare Pages** - Alternative hosting (coming soon)
- **Multiple RPC Endpoints** - Reliable blockchain access
- **Real-Time Updates** - Live data synchronization

## 📋 Smart Contract

**Program ID (Devnet):** `uY5hZR2uYzkquJDuDkFBj29tfzZRPE96BBTHYGaYnwX`

**TAMA Token Mint:** `d8g1m1s14GFKw1P4kUjcTPjHrawwaPoJYPUhssXEjR6`

### Instructions
- `create_pet` - Create a new pet (free)
- `create_pet_nft` - Create NFT pet with TAMA
- `create_pet_nft_sol` - Create NFT pet with SOL
- `feed_pet` - Feed your pet
- `play_with_pet` - Play with your pet
- `heal_pet` - Heal your pet
- `rest_pet` - Let your pet rest
- `update_decay` - Update pet stats based on time
- `resurrect_pet` - Resurrect dead pet
- `close_pet` - Close pet account (get rent back)

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- Rust 1.70+
- Solana CLI 1.18+
- Anchor 0.29+

### Setup

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/crypto-tamagotchi.git
cd crypto-tamagotchi

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# Build smart contract
anchor build

# Deploy to Devnet
anchor deploy --provider.cluster devnet
```

## 🎮 How to Play

### 1. Setup Wallet
- Install [Phantom Wallet](https://phantom.app/)
- Switch to Devnet in settings
- Get free SOL from [Solana Faucet](https://faucet.solana.com)

### 2. Create Pet
- Connect wallet
- Click "Create Pet" (FREE!)
- Wait for confirmation

### 3. Care for Your Pet
- **Feed** - Increase hunger
- **Play** - Increase happiness
- **Heal** - Restore health
- **Rest** - Restore energy

### 4. Level Up
- Earn +5 EXP per action
- Level up for better stats
- Unlock new features

## 💰 TAMA Token Faucet

Get free TAMA tokens for testing:

```bash
# Using Python script
python tama_faucet.py <YOUR_WALLET_ADDRESS>

# Using SPL Token CLI
spl-token transfer d8g1m1s14GFKw1P4kUjcTPjHrawwaPoJYPUhssXEjR6 1000 <WALLET> --fund-recipient --url devnet
```

## 📊 Game Mechanics

### Stats System
- **Health** (0-100) - Pet's vitality
- **Hunger** (0-100) - Food level
- **Happiness** (0-100) - Mood level
- **Energy** (0-100) - Activity level

### Decay Rates
- **Hunger:** -5 per hour
- **Happiness:** -3 per hour
- **Energy:** -4 per hour
- **Health:** Decreases if other stats are low

### Death & Resurrection
- Pet dies when health reaches 0
- Free resurrection (once per pet)
- Close account to create new pet

## 🔧 Development

### Run Locally

```bash
# Open game file
open tamagotchi_devnet_v2_improved.html

# Or use Python server
python -m http.server 8000
# Visit: http://localhost:8000
```

### Deploy to Cloudflare Pages

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Deploy
wrangler pages deploy vercel_deploy --project-name crypto-tamagotchi
```

### Build Smart Contract

```bash
# Build
anchor build

# Test
anchor test

# Deploy
anchor deploy --provider.cluster devnet
```

## 📁 Project Structure

```
crypto-tamagotchi/
├── programs/
│   └── tamagotchi/
│       └── src/
│           └── lib.rs              # Smart contract
├── vercel_deploy/
│   └── tamagotchi_devnet_v2_improved.html  # Main game
├── tama_faucet.py                  # Token faucet script
├── Anchor.toml                     # Anchor config
└── README.md
```

## 🎯 Roadmap

### Phase 1: Beta Testing (Current)
- [x] Core gameplay mechanics
- [x] Smart contract deployment
- [x] NFT system
- [x] TAMA token integration
- [x] Web interface
- [x] Real-time updates

### Phase 2: Mainnet Launch
- [ ] Audit smart contracts
- [ ] Deploy to Mainnet
- [ ] Launch TAMA token
- [ ] NFT marketplace integration
- [ ] Community features

### Phase 3: Expansion
- [ ] Mobile app
- [ ] More pet types
- [ ] PvP battles
- [ ] Breeding system
- [ ] Governance (DAO)

## 🐛 Bug Reports

Found a bug? [Report it here](https://github.com/YOUR_USERNAME/crypto-tamagotchi/issues)

Or use the in-game "🐛 Report Bug" button!

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Solana Foundation
- Anchor Framework
- Phantom Wallet
- Vercel
- Cloudflare
- All beta testers!

## 📞 Contact

- **Twitter:** [@YourTwitter](https://twitter.com/your_twitter)
- **Discord:** [Join Server](https://discord.gg/your_server)
- **Email:** your.email@example.com

## 🌟 Support

If you like this project, please give it a ⭐ on GitHub!

---

**Built with ❤️ on Solana**

**Play Now:** [crypto-tamagotchi-devnet.vercel.app](https://crypto-tamagotchi-devnet-chtd6u8sb-ivans-projects-4717924b.vercel.app)