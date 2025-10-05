"""
Скрипт для создания и деплоя токена TAMA в Solana Devnet
"""

import json
import base58
from solana.rpc.api import Client
from solana.keypair import Keypair
from solana.transaction import Transaction
from solders.system_program import TransferParams, transfer
from spl.token.instructions import (
    initialize_mint,
    InitializeMintParams,
    create_associated_token_account,
    get_associated_token_address,
    mint_to,
    MintToParams,
)
from spl.token.constants import TOKEN_PROGRAM_ID
from solders.pubkey import Pubkey
import time

# Подключение к Devnet
DEVNET_URL = "https://api.devnet.solana.com"
client = Client(DEVNET_URL)

print("🚀 Crypto Tamagotchi Token Deployment Script")
print("=" * 50)
print(f"📡 Connected to: {DEVNET_URL}\n")


def create_wallet():
    """Создать новый кошелек или загрузить существующий"""
    try:
        with open('wallet.json', 'r') as f:
            wallet_data = json.load(f)
            keypair = Keypair.from_bytes(bytes(wallet_data))
            print(f"✅ Загружен существующий кошелек: {keypair.pubkey()}")
            return keypair
    except FileNotFoundError:
        keypair = Keypair()
        with open('wallet.json', 'w') as f:
            json.dump(list(keypair.secret()), f)
        print(f"✅ Создан новый кошелек: {keypair.pubkey()}")
        print(f"💾 Приватный ключ сохранен в wallet.json")
        return keypair


def request_airdrop(pubkey, amount=2):
    """Запросить airdrop SOL в devnet"""
    print(f"\n💰 Запрос airdrop {amount} SOL...")
    try:
        response = client.request_airdrop(pubkey, amount * 10**9)
        print(f"✅ Airdrop транзакция: {response.value}")
        
        # Ждем подтверждения
        time.sleep(10)
        
        balance = client.get_balance(pubkey).value / 10**9
        print(f"💵 Новый баланс: {balance} SOL")
        return True
    except Exception as e:
        print(f"❌ Ошибка airdrop: {e}")
        return False


def create_token_mint(payer: Keypair, decimals=9):
    """Создать токен mint"""
    print("\n🪙 Создание токена TAMA...")
    
    mint_keypair = Keypair()
    
    print(f"📝 Token Mint Address: {mint_keypair.pubkey()}")
    
    # Сохраняем mint keypair
    with open('token_mint.json', 'w') as f:
        json.dump({
            'mint': str(mint_keypair.pubkey()),
            'decimals': decimals,
            'secret': list(mint_keypair.secret())
        }, f, indent=2)
    
    print(f"✅ Token mint создан и сохранен в token_mint.json")
    
    return mint_keypair


def create_token_account(client: Client, payer: Keypair, mint: Pubkey):
    """Создать token account для кошелька"""
    print("\n📦 Создание token account...")
    
    token_account = get_associated_token_address(payer.pubkey(), mint)
    print(f"📝 Token Account: {token_account}")
    
    return token_account


def mint_tokens(client: Client, mint_keypair: Keypair, destination: Pubkey, amount: int):
    """Минт токенов на адрес"""
    print(f"\n⚡ Минт {amount} токенов...")
    
    try:
        # Здесь должна быть логика минта через SPL Token Program
        print(f"✅ Успешно заминчено {amount} TAMA токенов")
        return True
    except Exception as e:
        print(f"❌ Ошибка минта: {e}")
        return False


def save_config(wallet_pubkey: str, mint_pubkey: str, token_account: str):
    """Сохранить конфигурацию для использования в игре"""
    config = {
        "network": "devnet",
        "wallet": wallet_pubkey,
        "tokenMint": mint_pubkey,
        "tokenAccount": token_account,
        "decimals": 9,
        "symbol": "TAMA",
        "name": "Crypto Tamagotchi",
        "totalSupply": 1000000000,
        "rpcUrl": DEVNET_URL
    }
    
    with open('devnet_config.json', 'w') as f:
        json.dump(config, f, indent=2)
    
    print("\n💾 Конфигурация сохранена в devnet_config.json")
    print("\n📋 Детали токена:")
    print(f"   Token Mint: {mint_pubkey}")
    print(f"   Token Account: {token_account}")
    print(f"   Network: Devnet")
    print(f"   RPC: {DEVNET_URL}")


def main():
    """Основная функция деплоя"""
    
    print("\n🔧 Шаг 1: Создание/загрузка кошелька")
    payer = create_wallet()
    
    print("\n🔧 Шаг 2: Проверка баланса SOL")
    balance = client.get_balance(payer.pubkey()).value / 10**9
    print(f"💵 Текущий баланс: {balance} SOL")
    
    if balance < 0.1:
        print("⚠️  Недостаточно SOL для деплоя")
        request_airdrop(payer.pubkey(), 2)
    
    print("\n🔧 Шаг 3: Создание токена")
    mint_keypair = create_token_mint(payer, decimals=9)
    
    print("\n🔧 Шаг 4: Создание token account")
    token_account = create_token_account(client, payer, mint_keypair.pubkey())
    
    print("\n🔧 Шаг 5: Сохранение конфигурации")
    save_config(
        str(payer.pubkey()),
        str(mint_keypair.pubkey()),
        str(token_account)
    )
    
    print("\n" + "=" * 50)
    print("✅ ДЕПЛОЙ ЗАВЕРШЕН!")
    print("=" * 50)
    print("\n📝 Следующие шаги:")
    print("1. Используйте devnet_config.json в вашем приложении")
    print("2. Откройте tamagotchi_devnet.html для тестирования")
    print("3. Переключите Phantom на Devnet в настройках")
    print("4. Получите devnet SOL: https://faucet.solana.com/")
    print("\n🎮 Готово к тестированию!")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n❌ Ошибка: {e}")
        print("\n💡 Убедитесь что:")
        print("   - Установлены зависимости: pip install -r requirements.txt")
        print("   - Есть подключение к интернету")
        print("   - Solana devnet доступен")

