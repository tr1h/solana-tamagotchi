# 🧪 Тестирование в Solana Devnet

Это руководство поможет вам протестировать Crypto Tamagotchi с реальными транзакциями токенов в тестовой сети Solana (Devnet).

## 🎯 Что такое Devnet?

**Devnet** - это тестовая сеть Solana, где:
- Токены бесплатные (тестовые)
- Транзакции реальные, но без ценности
- Можно безопасно тестировать перед mainnet
- Все работает как в реальной сети

## 📋 Требования

### 1. Установка Solana CLI

**Windows:**
```powershell
# Скачайте и установите с:
https://github.com/solana-labs/solana/releases

# Или используйте:
cmd /c "curl https://release.solana.com/v1.17.0/solana-install-init-x86_64-pc-windows-msvc.exe --output C:\solana-install-tmp\solana-install-init.exe --create-dirs"
```

**Linux/Mac:**
```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

После установки перезапустите терминал и проверьте:
```bash
solana --version
```

### 2. Phantom Wallet

1. Установите расширение: https://phantom.app/
2. Создайте кошелек
3. В настройках переключитесь на Devnet:
   - Settings → Developer Settings → Change Network → **Devnet**

## 🚀 Пошаговая инструкция

### Шаг 1: Настройка Solana Devnet

**Windows PowerShell:**
```powershell
# Перейдите в папку проекта
cd "C:\NEW proekt"

# Запустите скрипт
.\setup_devnet.ps1
```

**Linux/Mac:**
```bash
# Перейдите в папку проекта
cd /path/to/project

# Сделайте скрипт исполняемым
chmod +x setup_devnet.sh

# Запустите
./setup_devnet.sh
```

### Что делает скрипт:

1. ✅ Проверяет установку Solana CLI
2. 🔧 Переключается на devnet
3. 👛 Создает кошелек (если нет)
4. 💰 Запрашивает airdrop SOL
5. 🪙 Создает токен TAMA
6. 📦 Создает token account
7. ⚡ Минтит 1,000,000,000 токенов
8. 💾 Сохраняет конфигурацию в `devnet_config.json`

### Шаг 2: Проверка токена

После выполнения скрипта откройте `devnet_config.json`:

```json
{
  "network": "devnet",
  "rpcUrl": "https://api.devnet.solana.com",
  "walletAddress": "YOUR_WALLET_ADDRESS",
  "tokenMint": "YOUR_TOKEN_MINT",
  "tokenAccount": "YOUR_TOKEN_ACCOUNT",
  "decimals": 9,
  "symbol": "TAMA",
  "name": "Crypto Tamagotchi"
}
```

Проверьте токен в Solana Explorer:
```
https://explorer.solana.com/address/YOUR_TOKEN_MINT?cluster=devnet
```

### Шаг 3: Настройка Phantom для devnet

1. Откройте Phantom
2. Settings (⚙️) → Developer Settings
3. Change Network → **Devnet**
4. Вы должны увидеть "Devnet" в верхней части кошелька

### Шаг 4: Получение devnet SOL

**Вариант А: Через CLI (рекомендуется)**
```bash
solana airdrop 2
```

**Вариант Б: Через faucet**
1. Откройте: https://faucet.solana.com/
2. Вставьте адрес из Phantom
3. Запросите 2 SOL
4. Подождите ~30 секунд

### Шаг 5: Перевод TAMA токенов в Phantom

Чтобы использовать токены в игре, переведите их в Phantom:

```bash
# Замените YOUR_PHANTOM_ADDRESS на адрес из Phantom
spl-token transfer YOUR_TOKEN_MINT 10000 YOUR_PHANTOM_ADDRESS
```

Или через Python скрипт:
```python
# Будет создан позже
python airdrop_tokens.py YOUR_PHANTOM_ADDRESS 10000
```

### Шаг 6: Запуск игры

1. Откройте `tamagotchi_devnet.html` в браузере:
   ```
   Двойной клик по файлу ИЛИ
   Правая кнопка → Открыть с помощью → Chrome/Firefox
   ```

2. Нажмите **"Подключить кошелек (Devnet)"**

3. Подтвердите подключение в Phantom

4. Проверьте, что баланс TAMA отображается

5. Нажмите **"Завести питомца"** (стоит 10 TAMA)

6. Подтвердите транзакцию в Phantom

7. Играйте! Каждое действие = реальная транзакция в devnet

## 🎮 Тестирование функций

### Действия с питомцем:

| Действие | Стоимость | Что тестируем |
|----------|-----------|---------------|
| 🥚 Завести питомца | 10 TAMA | Создание NFT (будущее) |
| 🍖 Кормить | 5 TAMA | Базовая транзакция |
| 🎮 Играть | 3 TAMA | Взаимодействие |
| 💊 Лечить | 8 TAMA | Сложная логика |
| 😴 Спать | 2 TAMA | Минимальная транзакция |

### Проверка транзакций:

1. После каждого действия в Phantom появится запрос на подтверждение
2. В консоли браузера (F12) смотрите логи
3. Проверяйте транзакции в Explorer:
   ```
   https://explorer.solana.com/address/YOUR_WALLET?cluster=devnet
   ```

## 🔧 Полезные команды

### Проверка балансов:

```bash
# SOL баланс
solana balance

# TAMA баланс
spl-token balance YOUR_TOKEN_MINT

# Все токены
spl-token accounts
```

### Дополнительный airdrop TAMA:

```bash
# Минт еще токенов себе
spl-token mint YOUR_TOKEN_MINT 1000
```

### Проверка token accounts:

```bash
# Список всех token accounts
spl-token accounts

# Информация о конкретном токене
spl-token account-info YOUR_TOKEN_ACCOUNT
```

### Перевод токенов:

```bash
# Перевод TAMA другому адресу
spl-token transfer YOUR_TOKEN_MINT AMOUNT RECIPIENT_ADDRESS
```

### Просмотр истории транзакций:

```bash
# Последние транзакции
solana transaction-history YOUR_WALLET_ADDRESS
```

## 🐛 Troubleshooting

### ❌ "Insufficient funds"

**Причина:** Недостаточно SOL для комиссий

**Решение:**
```bash
solana airdrop 2
# или
# https://faucet.solana.com/
```

### ❌ "Token account does not exist"

**Причина:** У получателя нет token account для TAMA

**Решение:**
```bash
spl-token create-account YOUR_TOKEN_MINT
```

### ❌ "Airdrop request limit exceeded"

**Причина:** Слишком много запросов airdrop

**Решение:**
- Подождите 10-15 минут
- Используйте https://faucet.solana.com/
- Используйте другой кошелек

### ❌ "Transaction simulation failed"

**Причина:** Ошибка в логике транзакции

**Решение:**
- Проверьте баланс SOL и TAMA
- Проверьте что Phantom на Devnet
- Посмотрите лог ошибок в консоли (F12)

### ❌ Phantom не видит токены

**Причина:** Нужно добавить токен вручную

**Решение:**
1. В Phantom: Settings → Manage Token List
2. Нажмите "+" 
3. Вставьте Token Mint Address
4. Нажмите Add

### ❌ "Failed to fetch"

**Причина:** Проблемы с сетью или RPC

**Решение:**
- Проверьте интернет
- Попробуйте другой RPC:
  ```javascript
  const connection = new solanaWeb3.Connection(
    'https://api.devnet.solana.com',
    'confirmed'
  );
  ```

## 📊 Мониторинг

### Инструменты для мониторинга:

1. **Solana Explorer** (основной)
   ```
   https://explorer.solana.com/?cluster=devnet
   ```

2. **Solscan** (альтернатива)
   ```
   https://solscan.io/?cluster=devnet
   ```

3. **SolanaFM**
   ```
   https://solana.fm/?cluster=devnet-solana
   ```

### Что смотреть:

- ✅ Token Mint: Общая информация о токене
- ✅ Token Accounts: Кто держит токены
- ✅ Transactions: История переводов
- ✅ Program Logs: Детали выполнения

## 🚀 Переход на Mainnet

После успешного тестирования в devnet:

### Шаг 1: Проверка

- [ ] Все транзакции работают
- [ ] Нет ошибок в консоли
- [ ] UI отзывчивый и понятный
- [ ] Балансы корректно обновляются
- [ ] Логика игры работает правильно

### Шаг 2: Подготовка

1. Измените RPC в коде:
   ```javascript
   const connection = new solanaWeb3.Connection(
     'https://api.mainnet-beta.solana.com',
     'confirmed'
   );
   ```

2. Запустите токен через Pump.Fun (см. PUMPFUN_GUIDE.md)

3. Обновите `tokenMint` в конфигурации

### Шаг 3: Финальное тестирование

1. Протестируйте с минимальными суммами
2. Проверьте все функции
3. Убедитесь что комиссии разумные

### Шаг 4: Запуск

1. Объявите в соцсетях
2. Дайте ссылку на игру
3. Мониторьте транзакции
4. Реагируйте на feedback

## 💡 Советы

### Для разработки:

1. **Используйте несколько кошельков**
   - Один для разработки
   - Один для тестирования как пользователь

2. **Логируйте всё**
   ```javascript
   console.log('Transaction:', signature);
   console.log('Balance:', balance);
   ```

3. **Обрабатывайте ошибки**
   ```javascript
   try {
     await sendTransaction();
   } catch (error) {
     console.error('Error:', error);
     showUserFriendlyError(error);
   }
   ```

4. **Тестируйте edge cases**
   - Нулевой баланс
   - Максимальные значения
   - Отмена транзакции
   - Сетевые ошибки

### Для пользователей:

1. **Всегда проверяйте сеть**
   - Devnet = тестовые токены
   - Mainnet = реальные деньги

2. **Сохраняйте приватные ключи**
   - Запишите seed phrase
   - Храните в безопасном месте
   - Никому не показывайте

3. **Начинайте с малого**
   - Протестируйте с небольшими суммами
   - Убедитесь что всё работает
   - Потом увеличивайте

## 📞 Поддержка

### Документация:

- **Solana Docs**: https://docs.solana.com/
- **Phantom Docs**: https://docs.phantom.app/
- **SPL Token**: https://spl.solana.com/token

### Сообщество:

- **Solana Discord**: https://discord.gg/solana
- **Phantom Discord**: https://discord.gg/phantom
- **Stack Overflow**: `[solana]` tag

### Видео туториалы:

- Solana Cookbook: https://solanacookbook.com/
- Solana Bootcamp: https://www.youtube.com/@SolanaFndn

---

## ✅ Чеклист готовности к тестированию

Перед началом убедитесь:

- [ ] Solana CLI установлен и работает
- [ ] Phantom установлен и настроен на Devnet
- [ ] `setup_devnet.ps1` выполнен успешно
- [ ] `devnet_config.json` создан
- [ ] В кошельке есть devnet SOL
- [ ] В кошельке есть TAMA токены
- [ ] `tamagotchi_devnet.html` открывается в браузере
- [ ] Кошелек подключается к игре
- [ ] Балансы отображаются корректно

**Если всё ✅ - вы готовы к тестированию! 🎮🚀**

---

**Удачного тестирования!** Если что-то не работает, проверьте раздел Troubleshooting или задайте вопрос в Issues.















