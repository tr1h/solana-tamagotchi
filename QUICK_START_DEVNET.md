# ⚡ Быстрый старт Devnet тестирования

## 🎯 Цель
Протестировать игру Crypto Tamagotchi с реальными транзакциями токенов в безопасной тестовой среде.

## 📝 Шаги (5 минут)

### 1️⃣ Установите Solana CLI

**Windows:**
```powershell
# Скачайте и установите:
https://github.com/solana-labs/solana/releases

# После установки проверьте:
solana --version
```

**Mac/Linux:**
```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

### 2️⃣ Установите Phantom Wallet

1. Перейдите: https://phantom.app/
2. Установите расширение для браузера
3. Создайте новый кошелек
4. **ВАЖНО:** Settings → Developer Settings → Change Network → **Devnet**

### 3️⃣ Запустите setup скрипт

```powershell
# В PowerShell (от администратора если нужно)
cd "C:\NEW proekt"
.\setup_devnet.ps1
```

**Что произойдет:**
- ✅ Создастся кошелек
- ✅ Получите бесплатный devnet SOL
- ✅ Создастся токен TAMA
- ✅ Заминтится 1 млрд токенов
- ✅ Сохранится конфиг в `devnet_config.json`

### 4️⃣ Получите токены в Phantom

```powershell
# Скопируйте ваш адрес из Phantom (клик на адрес сверху)
# Затем выполните:
spl-token transfer <TOKEN_MINT_ИЗ_КОНФИГА> 10000 <ВАШ_PHANTOM_АДРЕС>

# Или используйте скрипт:
python airdrop_tokens.py <ВАШ_PHANTOM_АДРЕС> 10000
```

### 5️⃣ Запустите игру

1. Откройте `tamagotchi_devnet.html` в браузере (двойной клик)
2. Нажмите "Подключить кошелек (Devnet)"
3. Подтвердите в Phantom
4. Нажмите "Завести питомца" (10 TAMA)
5. Играйте! Каждое действие = реальная транзакция 🎮

## 🎮 Действия в игре

| Кнопка | Стоимость | Эффект |
|--------|-----------|--------|
| 🍖 Кормить | 5 TAMA | +30% голод, +5% здоровье |
| 🎮 Играть | 3 TAMA | +25% счастье, +8 опыт |
| 💊 Лечить | 8 TAMA | 100% здоровье |
| 😴 Спать | 2 TAMA | +40% энергия |

## 🔍 Проверка

### Балансы:
```bash
# SOL
solana balance

# TAMA
spl-token balance <TOKEN_MINT>
```

### Транзакции:
```
https://explorer.solana.com/address/<ВАШ_АДРЕС>?cluster=devnet
```

### Token info:
```
https://explorer.solana.com/address/<TOKEN_MINT>?cluster=devnet
```

## ⚠️ Частые проблемы

### "Недостаточно SOL"
```bash
solana airdrop 2
# или https://faucet.solana.com/
```

### "Недостаточно TAMA"
```bash
spl-token mint <TOKEN_MINT> 1000
```

### "Phantom не на Devnet"
Settings → Developer Settings → Change Network → **Devnet**

### "Token account does not exist"
```bash
spl-token create-account <TOKEN_MINT>
```

## 📊 Что тестировать

✅ **Основное:**
- [ ] Подключение кошелька
- [ ] Отображение балансов
- [ ] Создание питомца (10 TAMA)
- [ ] Все 4 действия с питомцем
- [ ] Система эволюции
- [ ] Сохранение прогресса

✅ **Граничные случаи:**
- [ ] Действие без токенов
- [ ] Отмена транзакции в Phantom
- [ ] Переподключение кошелька
- [ ] Обновление страницы

✅ **UI/UX:**
- [ ] Анимации работают
- [ ] Уведомления понятные
- [ ] Баланс обновляется
- [ ] Кнопки отзывчивые

## 📚 Дополнительно

Подробная документация: **DEVNET_TESTING.md**

## 💡 Советы

1. **Держите консоль открытой** (F12) - там логи транзакций
2. **Сохраняйте токены** - для нескольких тестов
3. **Тестируйте с друзьями** - дайте им токены через airdrop
4. **Записывайте баги** - чтобы исправить перед mainnet

## 🚀 Готовы к mainnet?

После успешного тестирования:
1. Прочитайте **PUMPFUN_GUIDE.md**
2. Подготовьте маркетинг (MARKETING.md)
3. Запустите токен
4. Измените RPC на mainnet
5. Запускайтесь! 🎉

---

**Вопросы?** Откройте issue или прочитайте полную документацию в DEVNET_TESTING.md













