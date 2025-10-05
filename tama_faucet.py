#!/usr/bin/env python3
"""
💰 TAMA Token Faucet для Devnet
Раздает 1000 TAMA токенов тестерам
"""

import os
import sys
from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solana.rpc.api import Client
from spl.token.instructions import transfer_checked, TransferCheckedParams
from solana.transaction import Transaction

# 🔧 Конфигурация
RPC_URL = "https://api.devnet.solana.com"
TOKEN_MINT = "d8g1m1s14GFKw1P4kUjcTPjHrawwaPoJYPUhssXEjR6"  # ✅ TAMA Token на Devnet
DECIMALS = 9
AIRDROP_AMOUNT = 1_000 * (10 ** DECIMALS)  # 1000 TAMA

def load_wallet():
    """Загружает кошелек из wallet-devnet.json"""
    try:
        import json
        with open('wallet-devnet.json', 'r') as f:
            secret_key = json.load(f)
        return Keypair.from_bytes(bytes(secret_key))
    except FileNotFoundError:
        print("❌ wallet-devnet.json not found!")
        sys.exit(1)

def get_or_create_token_account(client, owner_pubkey, mint_pubkey, payer):
    """Получает или создает Associated Token Account"""
    from spl.token.constants import TOKEN_PROGRAM_ID
    from spl.token.instructions import get_associated_token_address, create_associated_token_account
    
    ata = get_associated_token_address(owner_pubkey, mint_pubkey)
    
    # Проверяем существует ли аккаунт
    try:
        account_info = client.get_account_info(ata)
        if account_info.value is not None:
            print(f"✅ Token account exists: {ata}")
            return ata
    except:
        pass
    
    # Создаем новый ATA
    print(f"🔨 Creating token account for {owner_pubkey}...")
    ix = create_associated_token_account(
        payer=payer.pubkey(),
        owner=owner_pubkey,
        mint=mint_pubkey
    )
    
    tx = Transaction().add(ix)
    response = client.send_transaction(tx, payer)
    print(f"✅ Token account created: {ata}")
    print(f"   TX: {response.value}")
    
    return ata

def send_tama_airdrop(recipient_address: str):
    """Отправляет 1000 TAMA токенов на указанный адрес"""
    try:
        # Подключение
        client = Client(RPC_URL)
        print(f"🔗 Connected to {RPC_URL}")
        
        # Загрузка кошелька
        payer = load_wallet()
        print(f"💳 Payer: {payer.pubkey()}")
        
        # Публичные ключи
        mint_pubkey = Pubkey.from_string(TOKEN_MINT)
        recipient_pubkey = Pubkey.from_string(recipient_address)
        
        # Получить/создать token accounts
        from spl.token.instructions import get_associated_token_address
        sender_ata = get_associated_token_address(payer.pubkey(), mint_pubkey)
        recipient_ata = get_or_create_token_account(client, recipient_pubkey, mint_pubkey, payer)
        
        print(f"\n💰 Sending {AIRDROP_AMOUNT / (10 ** DECIMALS)} TAMA...")
        print(f"   From: {sender_ata}")
        print(f"   To: {recipient_ata}")
        
        # Создать транзакцию transfer
        from spl.token.constants import TOKEN_PROGRAM_ID
        
        ix = transfer_checked(
            TransferCheckedParams(
                program_id=TOKEN_PROGRAM_ID,
                source=sender_ata,
                mint=mint_pubkey,
                dest=recipient_ata,
                owner=payer.pubkey(),
                amount=AIRDROP_AMOUNT,
                decimals=DECIMALS,
            )
        )
        
        tx = Transaction().add(ix)
        response = client.send_transaction(tx, payer)
        signature = response.value
        
        print(f"\n✅ SUCCESS! Sent 1000 TAMA to {recipient_address}")
        print(f"   Signature: {signature}")
        print(f"   Explorer: https://explorer.solana.com/tx/{signature}?cluster=devnet")
        
        return signature
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    print("=" * 60)
    print("💰 TAMA TOKEN FAUCET - Devnet")
    print("=" * 60)
    
    if len(sys.argv) < 2:
        print("\n📝 Usage:")
        print("   python tama_faucet.py <recipient_wallet_address>")
        print("\nExample:")
        print("   python tama_faucet.py BXLs...8cRz")
        sys.exit(1)
    
    recipient = sys.argv[1]
    print(f"\n🎯 Recipient: {recipient}")
    
    # Отправить токены
    send_tama_airdrop(recipient)
    
    print("\n" + "=" * 60)
    print("✨ Done!")
    print("=" * 60)
