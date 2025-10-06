# 🎮 БЫСТРЫЙ СТАРТ - Crypto Tamagotchi Devnet

## ✅ ЧТО ГОТОВО:

1. ✅ **Токен TAMA создан в Solana Devnet**
2. ✅ **1,000,000,000 токенов заминчено**
3. ✅ **Игра открыта в браузере**
4. ✅ **Dashboard открыт**

---

## 🎯 ЧТО ДЕЛАТЬ СЕЙЧАС:

### Шаг 1: Настройте Phantom на Devnet

1. Откройте расширение **Phantom** в браузере
2. Нажмите **Settings** (⚙️ в правом верхнем углу)
3. **Developer Settings**
4. **Change Network** → выберите **Devnet**
5. Вверху должно появиться "**Devnet**"

### Шаг 2: Добавьте токен TAMA

1. В Phantom: **Settings** → **Manage Token List**
2. Нажмите **"+"** (Add Custom Token)
3. Вставьте адрес токена:
   ```
   74KGR9mdiiiqVW9QCnFmZz8cyj39ZoCaKexrSxF8fpQD
   ```
4. Нажмите **Add**
5. Токен TAMA должен появиться в списке

### Шаг 3: Играйте!

В открытой игре (`tamagotchi_devnet.html`):

1. Нажмите **"🔗 Подключить кошелек (Devnet)"**
2. Подтвердите подключение в Phantom
3. Должны отобразиться балансы:
   - **SOL**: ваш баланс
   - **TAMA**: должно быть 0 (пока не переведете)

---

## 💰 КАК ПОЛУЧИТЬ TAMA ТОКЕНЫ:

### Вариант A: Перевести с основного кошелька

Выполните в PowerShell (замените YOUR_PHANTOM_ADDRESS на ваш адрес):

```powershell
cd "C:\NEW proekt"
spl-token transfer 74KGR9mdiiiqVW9QCnFmZz8cyj39ZoCaKexrSxF8fpQD 10000 YOUR_PHANTOM_ADDRESS
```

Ваш Phantom адрес можно скопировать, кликнув на него в Phantom.

### Вариант B: Импортировать кошелек с токенами

1. В Phantom: **Add / Connect Wallet** → **Import Private Key**
2. Откройте файл `wallet-devnet.json` (в блокноте)
3. Скопируйте весь массив чисел `[123, 45, 67, ...]`
4. Вставьте в Phantom

**⚠️ Это тестовый кошелек для devnet!**

---

## 🎮 ИГРОВЫЕ ДЕЙСТВИЯ:

После получения TAMA токенов:

| Действие | Стоимость | Что делает |
|----------|-----------|------------|
| 🥚 Завести питомца | 10 TAMA | Создает питомца |
| 🍖 Кормить | 5 TAMA | +30% голод, +5% здоровье |
| 🎮 Играть | 3 TAMA | +25% счастье, +8 опыт |
| 💊 Лечить | 8 TAMA | 100% здоровье |
| 😴 Спать | 2 TAMA | +40% энергия |

**Каждое действие = реальная транзакция в Solana Devnet!** 🔥

---

## 📊 ЧТО ПРОВЕРИТЬ:

### В игре:
- [ ] Кошелек подключается?
- [ ] Отображается баланс TAMA?
- [ ] Можете завести питомца?
- [ ] Транзакции подтверждаются в Phantom?
- [ ] Баланс TAMA уменьшается после действий?
- [ ] Питомец эволюционирует?

### В Solana Explorer:
Откройте: https://explorer.solana.com/address/74KGR9mdiiiqVW9QCnFmZz8cyj39ZoCaKexrSxF8fpQD?cluster=devnet

- [ ] Видите токен TAMA?
- [ ] Видите транзакции?
- [ ] Supply показывает 1,000,000,000?

### В Dashboard:
- [ ] Показывает адрес токена?
- [ ] Ссылки работают?

---

## 🐛 ПРОБЛЕМЫ?

### "Phantom не видит токены"
➡️ Убедитесь:
1. Phantom на **Devnet** (не Mainnet!)
2. Токен добавлен через Manage Token List
3. У вас есть token account

### "Недостаточно TAMA"
➡️ Переведите токены:
```powershell
spl-token transfer 74KGR9mdiiiqVW9QCnFmZz8cyj39ZoCaKexrSxF8fpQD 10000 ВАШ_АДРЕС
```

### "Transaction failed"
➡️ Проверьте:
1. Достаточно ли SOL для комиссий? (получите с https://faucet.solana.com/)
2. Phantom на Devnet?
3. Правильный ли токен добавлен?

### "Кошелек не подключается"
➡️ 
1. Установите Phantom: https://phantom.app/
2. Обновите страницу (F5)
3. Разрешите подключение в popup

---

## 📝 ПОЛЕЗНЫЕ КОМАНДЫ:

### Проверить балансы:
```powershell
cd "C:\NEW proekt"

# SOL баланс
solana balance

# TAMA баланс основного кошелька
spl-token balance 74KGR9mdiiiqVW9QCnFmZz8cyj39ZoCaKexrSxF8fpQD

# Все токены
spl-token accounts
```

### Перевести TAMA другу:
```powershell
spl-token transfer 74KGR9mdiiiqVW9QCnFmZz8cyj39ZoCaKexrSxF8fpQD 1000 АДРЕС_ДРУГА
```

### Заминтить еще токены (если закончатся):
```powershell
spl-token mint 74KGR9mdiiiqVW9QCnFmZz8cyj39ZoCaKexrSxF8fpQD 1000000
```

---

## 🔗 ВАЖНЫЕ ССЫЛКИ:

### Ваш токен:
- **Explorer:** https://explorer.solana.com/address/74KGR9mdiiiqVW9QCnFmZz8cyj39ZoCaKexrSxF8fpQD?cluster=devnet
- **Token Mint:** `74KGR9mdiiiqVW9QCnFmZz8cyj39ZoCaKexrSxF8fpQD`

### Документация:
- **[SUCCESS_DEVNET.md](SUCCESS_DEVNET.md)** - Подробная инструкция
- **[PUMPFUN_GUIDE.md](PUMPFUN_GUIDE.md)** - Запуск в mainnet
- **[MARKETING.md](MARKETING.md)** - Маркетинговые материалы

### Инструменты:
- **Solana Faucet:** https://faucet.solana.com/ (получить devnet SOL)
- **Phantom:** https://phantom.app/

---

## 🚀 ЧТО ДАЛЬШЕ?

После успешного тестирования в devnet:

1. ✅ **Всё работает?** - Поздравляю!
2. 📖 **Изучите [PUMPFUN_GUIDE.md](PUMPFUN_GUIDE.md)**
3. 🎨 **Подготовьте визуалы** (логотип, баннеры)
4. 📣 **Создайте соцсети** (Twitter, Telegram)
5. 🚀 **Запускайте токен в mainnet!**

---

## 💡 СОВЕТ ДНЯ:

Phantom работает с локальными HTML файлами! 
Вам **НЕ НУЖЕН** HTTP сервер для тестирования! 
Просто откройте файл в браузере и подключите Phantom! ✨

---

## ✅ ЧЕКЛИСТ:

- [ ] Phantom установлен и настроен на Devnet
- [ ] Токен TAMA добавлен в Phantom
- [ ] Есть devnet SOL для комиссий
- [ ] Есть TAMA токены для игры
- [ ] Кошелек подключен к игре
- [ ] Питомец создан
- [ ] Все действия работают
- [ ] Транзакции видны в Explorer

**Когда всё работает - проект готов к mainnet! 🎉**

---

**Удачного тестирования! 🎮🚀**















