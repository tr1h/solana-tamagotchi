# ✅ Devnet Setup - Текущий статус

## 🎯 Что уже сделано

✅ **Solana CLI установлен** (версия 1.18.4)  
✅ **Настроен Devnet** (https://api.devnet.solana.com)  
✅ **Создан кошелек:** `3grSgLGKkbd8pR7tzNssXMHn8ctTX7r6TE6uhRToF55h`  
✅ **Кошелек сохранен:** `wallet-devnet.json` (в папке проекта)  
✅ **Базовая конфигурация:** `devnet_config.json`

## ⚠️ Что нужно сделать

### Шаг 1: Получить Devnet SOL 💰

**Проблема:** CLI airdrop достиг лимита  
**Решение:** Использовать веб-faucet!

#### Вариант А: Официальный Solana Faucet (БЫСТРЕЕ!)

1. Откройте: https://faucet.solana.com/

2. Введите адрес:
   ```
   3grSgLGKkbd8pR7tzNssXMHn8ctTX7r6TE6uhRToF55h
   ```

3. Выберите **2 SOL** и нажмите **"Request Airdrop"**

4. Подождите 10-30 секунд

#### Вариант Б: QuickNode Faucet

1. Откройте: https://faucet.quicknode.com/solana/devnet
2. Введите адрес и запросите SOL

#### Проверка баланса:

```powershell
solana balance
```

Должно показать: **2 SOL** (или больше)

---

### Шаг 2: Создать токен TAMA 🪙

После получения SOL выполните:

```powershell
# 1. Создать токен
spl-token create-token --decimals 9
```

**Вы получите адрес токена**, например:
```
Creating token ABC123...xyz
Address: ABC123...xyz
Signature: ...
```

**ВАЖНО:** Скопируйте адрес токена!

```powershell
# 2. Создать token account
spl-token create-account <АДРЕС_ТОКЕНА>
```

```powershell
# 3. Заминтить 1 миллиард токенов
spl-token mint <АДРЕС_ТОКЕНА> 1000000000
```

```powershell
# 4. Проверить баланс
spl-token balance <АДРЕС_ТОКЕНА>
```

Должно показать: **1000000000**

---

### Шаг 3: Обновить конфигурацию ⚙️

Откройте `devnet_config.json` и замените:

```json
{
  "tokenMint": "ВАШ_АДРЕС_ТОКЕНА_ЗДЕСЬ",
  "tokenAccount": "ВАШ_TOKEN_ACCOUNT_ЗДЕСЬ"
}
```

---

### Шаг 4: Запустить игру! 🎮

```powershell
# Откройте в браузере
start tamagotchi_devnet.html
```

#### В игре:

1. Нажмите **"Подключить кошелек (Devnet)"**
2. В Phantom выберите **Settings → Developer Settings → Change Network → Devnet**
3. Подключите кошелек
4. Импортируйте токен TAMA (если не виден автоматически)
5. Играйте!

---

## 🔥 Быстрая команда (после получения SOL)

Скопируйте и выполните всё сразу:

```powershell
# Создать и настроить токен
$TOKEN = (spl-token create-token --decimals 9 | Select-String "Address: " | ForEach-Object { $_ -replace "Address: ", "" }).Trim()
Write-Host "Token created: $TOKEN" -ForegroundColor Green

$ACCOUNT = (spl-token create-account $TOKEN | Select-String "Creating account " | ForEach-Object { $_ -replace "Creating account ", "" }).Trim()
Write-Host "Account created: $ACCOUNT" -ForegroundColor Green

spl-token mint $TOKEN 1000000000
Write-Host "Minted 1,000,000,000 TAMA tokens!" -ForegroundColor Green

# Обновить конфиг
$config = Get-Content devnet_config.json | ConvertFrom-Json
$config.tokenMint = $TOKEN
$config.tokenAccount = $ACCOUNT
$config.status = "ready"
$config | ConvertTo-Json | Set-Content devnet_config.json

Write-Host "`n✅ SETUP COMPLETE!" -ForegroundColor Green
Write-Host "Token Mint: $TOKEN" -ForegroundColor Cyan
Write-Host "Token Account: $ACCOUNT" -ForegroundColor Cyan
Write-Host "`nOpen tamagotchi_devnet.html to play!" -ForegroundColor Yellow
```

---

## 📊 Мониторинг

### Проверить токен в Explorer:

```
https://explorer.solana.com/address/<ВАШ_ТОКЕН>?cluster=devnet
```

### Проверить кошелек:

```
https://explorer.solana.com/address/3grSgLGKkbd8pR7tzNssXMHn8ctTX7r6TE6uhRToF55h?cluster=devnet
```

---

## 🆘 Troubleshooting

### "Недостаточно SOL"
➡️ Получите больше с https://faucet.solana.com/

### "Token account does not exist"
➡️ Выполните: `spl-token create-account <TOKEN_MINT>`

### "Transaction failed"
➡️ Проверьте что вы на Devnet: `solana config get`

### Phantom не видит токены
➡️ 
1. Settings → Manage Token List
2. Нажмите "+"
3. Вставьте Token Mint Address
4. Нажмите Add

---

## 📁 Важные файлы

- **wallet-devnet.json** - Ваш кошелек (НЕ делитесь!)
- **devnet_config.json** - Конфигурация (обновляется автоматически)
- **tamagotchi_devnet.html** - Игра для devnet

---

## 🎉 После завершения

После успешного создания токена и тестирования:

1. ✅ Все работает в devnet
2. 📖 Читайте [PUMPFUN_GUIDE.md](PUMPFUN_GUIDE.md) для запуска в mainnet
3. 📣 Подготовьте маркетинг ([MARKETING.md](MARKETING.md))
4. 🚀 Запускайте токен!

---

## 💡 Полезные команды

```powershell
# Проверить баланс SOL
solana balance

# Проверить баланс токенов
spl-token balance <TOKEN_MINT>

# Список всех токенов
spl-token accounts

# Перевести токены (для тестирования)
spl-token transfer <TOKEN_MINT> <КОЛИЧЕСТВО> <АДРЕС>

# Проверить конфигурацию
solana config get
```

---

**Следующий шаг:** Получите SOL через https://faucet.solana.com/ и продолжайте! 🚀













