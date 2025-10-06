"""
Скрипт для airdrop TAMA токенов в devnet
Использование: python airdrop_tokens.py <адрес> <количество>
"""

import sys
import json
import subprocess

def load_config():
    """Загрузить конфигурацию devnet"""
    try:
        with open('devnet_config.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print("❌ Файл devnet_config.json не найден!")
        print("💡 Сначала запустите setup_devnet.ps1")
        sys.exit(1)

def check_balance(token_mint):
    """Проверить текущий баланс токенов"""
    try:
        result = subprocess.run(
            ['spl-token', 'balance', token_mint],
            capture_output=True,
            text=True,
            check=True
        )
        balance = float(result.stdout.strip())
        return balance
    except Exception as e:
        print(f"⚠️  Не удалось проверить баланс: {e}")
        return None

def transfer_tokens(token_mint, recipient, amount):
    """Перевести токены получателю"""
    try:
        print(f"\n⚡ Отправка {amount} TAMA на {recipient}...")
        
        result = subprocess.run(
            ['spl-token', 'transfer', token_mint, str(amount), recipient],
            capture_output=True,
            text=True,
            check=True
        )
        
        print(f"✅ Успешно отправлено {amount} TAMA!")
        print(f"📝 Транзакция: {result.stdout.strip()}")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Ошибка транзакции: {e.stderr}")
        return False

def mint_tokens(token_mint, amount):
    """Заминтить дополнительные токены себе"""
    try:
        print(f"\n⚡ Минт {amount} TAMA...")
        
        result = subprocess.run(
            ['spl-token', 'mint', token_mint, str(amount)],
            capture_output=True,
            text=True,
            check=True
        )
        
        print(f"✅ Успешно заминчено {amount} TAMA!")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Ошибка минта: {e.stderr}")
        return False

def main():
    print("🎁 TAMA Token Airdrop Script")
    print("=" * 50)
    
    # Проверка аргументов
    if len(sys.argv) < 3:
        print("\n📖 Использование:")
        print("   python airdrop_tokens.py <адрес> <количество>")
        print("\n📝 Пример:")
        print("   python airdrop_tokens.py GjW...xyz 1000")
        sys.exit(1)
    
    recipient = sys.argv[1]
    amount = float(sys.argv[2])
    
    # Загрузка конфига
    config = load_config()
    token_mint = config.get('tokenMint')
    
    if not token_mint:
        print("❌ Token mint не найден в конфигурации!")
        sys.exit(1)
    
    print(f"\n📋 Детали:")
    print(f"   Token: {config.get('name')} ({config.get('symbol')})")
    print(f"   Mint: {token_mint}")
    print(f"   Получатель: {recipient}")
    print(f"   Количество: {amount}")
    
    # Проверка баланса
    balance = check_balance(token_mint)
    if balance is not None:
        print(f"\n💰 Ваш текущий баланс: {balance} TAMA")
        
        if balance < amount:
            print(f"⚠️  Недостаточно токенов! Нужно заминтить еще {amount - balance}")
            response = input("Заминтить дополнительные токены? (y/n): ")
            if response.lower() == 'y':
                mint_tokens(token_mint, amount - balance + 100)  # +100 запас
    
    # Перевод
    success = transfer_tokens(token_mint, recipient, amount)
    
    if success:
        print("\n" + "=" * 50)
        print("✅ AIRDROP ЗАВЕРШЕН!")
        print("=" * 50)
        print(f"\n🔗 Проверить транзакцию:")
        print(f"   https://explorer.solana.com/address/{recipient}?cluster=devnet")
    else:
        print("\n❌ Airdrop не выполнен")
        print("\n💡 Возможные причины:")
        print("   - У получателя нет token account для TAMA")
        print("   - Недостаточно SOL для комиссии")
        print("   - Неверный адрес")
        print("\n🔧 Попробуйте:")
        print(f"   spl-token create-account {token_mint} --owner {recipient}")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Отменено пользователем")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Неожиданная ошибка: {e}")
        sys.exit(1)















