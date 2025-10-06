# 💰 Как получить Devnet SOL

## Проблема
Solana devnet airdrop через CLI имеет строгие лимиты. Если вы видите ошибку:
```
Error: airdrop request failed. This can happen when the rate limit is reached.
```

## ✅ Решение: Используйте веб-faucet

### Метод 1: Официальный Solana Faucet (рекомендуется)

1. **Откройте:** https://faucet.solana.com/

2. **Введите ваш адрес:**
   ```
   3grSgLGKkbd8pR7tzNssXMHn8ctTX7r6TE6uhRToF55h
   ```

3. **Выберите количество:** 1-2 SOL

4. **Нажмите "Request Airdrop"**

5. **Подождите 10-30 секунд**

6. **Проверьте баланс:**
   ```powershell
   solana balance
   ```

### Метод 2: QuickNode Faucet

1. **Откройте:** https://faucet.quicknode.com/solana/devnet

2. **Введите адрес:** `3grSgLGKkbd8pR7tzNssXMHn8ctTX7r6TE6uhRToF55h`

3. **Нажмите "Request"**

### Метод 3: Solana Explorer

1. **Откройте:** https://explorer.solana.com/address/3grSgLGKkbd8pR7tzNssXMHn8ctTX7r6TE6uhRToF55h?cluster=devnet

2. **Нажмите "Request Airdrop" в правом верхнем углу**

## 🔍 Проверка баланса

После получения SOL проверьте:

```powershell
solana balance
```

Должно показать: `1 SOL` или больше

## 📝 Ваш адрес для копирования

```
3grSgLGKkbd8pR7tzNssXMHn8ctTX7r6TE6uhRToF55h
```

## ➡️ Что дальше?

После получения SOL выполните:

```powershell
# Создать токен TAMA
spl-token create-token --decimals 9

# Создать token account
spl-token create-account <TOKEN_MINT>

# Заминтить токены
spl-token mint <TOKEN_MINT> 1000000000
```

## ⏰ Почему лимит?

Devnet faucet имеет лимиты для предотвращения злоупотребления:
- По IP адресу
- По времени
- По количеству запросов

Веб-faucet обычно имеет более мягкие лимиты!















