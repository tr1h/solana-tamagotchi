#!/usr/bin/env python3
"""
Создает отдельный Faucet кошелек и пополняет его TAMA токенами
"""

import json
from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solana.rpc.api import Client
from spl.token.instructions import transfer_checked, TransferCheckedParams, get_associated_token_address
from solana.transaction import Transaction
from spl.token.constants import TOKEN_PROGRAM_ID

RPC_URL = "https://api.devnet.solana.com"
TOKEN_MINT = "d8g1m1s14GFKw1P4kUjcTPjHrawwaPoJYPUhssXEjR6"  # ✅ TAMA Token на Devnet
DECIMALS = 9
FAUCET_AMOUNT = 500_000 * (10 ** DECIMALS)  # 500,000 TAMA для faucet

def create_faucet_wallet():
    """Создает новый кошелек для faucet"""
    print("🔨 Creating Faucet wallet...")
    
    # Генерировать новый keypair
    faucet_keypair = Keypair()
    
    # Сохранить в файл
    secret_key_list = list(faucet_keypair.secret())
    
    with open('faucet-wallet.json', 'w') as f:
        json.dump(secret_key_list, f)
    
    print(f"✅ Faucet wallet created!")
    print(f"   Address: {faucet_keypair.pubkey()}")
    print(f"   Saved to: faucet-wallet.json")
    
    return faucet_keypair

def fund_faucet(main_wallet_path='wallet-devnet.json'):
    """Переводит TAMA токены на faucet кошелек"""
    print("\n💰 Funding Faucet wallet...")
    
    client = Client(RPC_URL)
    
    # Загрузить основной кошелек
    with open(main_wallet_path, 'r') as f:
        main_keypair = Keypair.from_bytes(bytes(json.load(f)))
    
    # Загрузить faucet кошелек
    with open('faucet-wallet.json', 'r') as f:
        faucet_keypair = Keypair.from_bytes(bytes(json.load(f)))
    
    print(f"   From: {main_keypair.pubkey()}")
    print(f"   To: {faucet_keypair.pubkey()}")
    print(f"   Amount: {FAUCET_AMOUNT / (10 ** DECIMALS)} TAMA")
    
    # Получить token accounts
    mint_pubkey = Pubkey.from_string(TOKEN_MINT)
    sender_ata = get_associated_token_address(main_keypair.pubkey(), mint_pubkey)
    
    # Создать ATA для faucet если нужно
    from spl.token.instructions import create_associated_token_account
    faucet_ata = get_associated_token_address(faucet_keypair.pubkey(), mint_pubkey)
    
    try:
        account_info = client.get_account_info(faucet_ata)
        if account_info.value is None:
            print(f"   Creating token account for faucet...")
            ix = create_associated_token_account(
                payer=main_keypair.pubkey(),
                owner=faucet_keypair.pubkey(),
                mint=mint_pubkey
            )
            tx = Transaction().add(ix)
            client.send_transaction(tx, main_keypair)
    except:
        pass
    
    # Transfer токенов
    ix = transfer_checked(
        TransferCheckedParams(
            program_id=TOKEN_PROGRAM_ID,
            source=sender_ata,
            mint=mint_pubkey,
            dest=faucet_ata,
            owner=main_keypair.pubkey(),
            amount=FAUCET_AMOUNT,
            decimals=DECIMALS,
        )
    )
    
    tx = Transaction().add(ix)
    response = client.send_transaction(tx, main_keypair)
    
    print(f"\n✅ SUCCESS! Faucet funded with 500,000 TAMA")
    print(f"   Signature: {response.value}")
    print(f"   Explorer: https://explorer.solana.com/tx/{response.value}?cluster=devnet")

if __name__ == "__main__":
    print("=" * 60)
    print("🚰 TAMA FAUCET WALLET SETUP")
    print("=" * 60)
    
    # Создать faucet кошелек
    create_faucet_wallet()
    
    # Пополнить токенами
    input("\n⏸️  Press Enter to fund faucet with TAMA tokens...")
    fund_faucet()
    
    print("\n" + "=" * 60)
    print("✨ Faucet Ready!")
    print("=" * 60)
    print("\n📝 Next steps:")
    print("1. Update tama_faucet.py to use 'faucet-wallet.json'")
    print("2. Keep faucet-wallet.json secure")
    print("3. Start distributing tokens!")
