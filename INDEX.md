# 🎮 Crypto Tamagotchi - Полный Гайд

Добро пожаловать в проект **Crypto Tamagotchi** - первая Play-to-Earn игра-тамагочи на Solana blockchain!

## 🚀 Быстрый старт

### Хочу просто поиграть:
👉 **Откройте [tamagotchi.html](tamagotchi.html)** - Демо версия (работает без блокчейна)

### Хочу улучшенную версию:
👉 **Откройте [tamagotchi_enhanced.html](tamagotchi_enhanced.html)** - С достижениями, комбо, улучшенной графикой

### Хочу тестировать с реальными транзакциями:
👉 **Читайте [QUICK_START_DEVNET.md](QUICK_START_DEVNET.md)** - Запуск за 5 минут

### Хочу запустить токен:
👉 **Читайте [PUMPFUN_GUIDE.md](PUMPFUN_GUIDE.md)** - Пошаговая инструкция запуска на Pump.Fun

---

## 📁 Структура проекта

### 🎮 Игровые файлы

| Файл | Описание | Для кого |
|------|----------|----------|
| **tamagotchi.html** | Базовая демо-версия | Демо и тестирование |
| **tamagotchi_enhanced.html** | Улучшенная версия | Игроки (лучшая версия!) |
| **tamagotchi_devnet.html** | С реальными транзакциями | Devnet тестирование |
| **tamagotchi_engine.js** | Игровой движок | Используется в enhanced версии |
| **dashboard.html** | Мониторинг токена | Аналитика и статистика |

### 📚 Документация

| Файл | Что внутри | Когда читать |
|------|------------|--------------|
| **README.md** ⭐ | Главная документация | Начните здесь! |
| **INDEX.md** (этот файл) | Навигация по проекту | Ищете что-то конкретное? |
| **PROJECT_STRUCTURE.md** | Описание всех файлов | Непонятно что где? |
| **QUICK_START_DEVNET.md** ⭐ | Быстрый старт (5 мин) | Хочу быстро потестить |
| **DEVNET_TESTING.md** | Подробное руководство | Серьезное тестирование |
| **PUMPFUN_GUIDE.md** ⭐ | Запуск на Pump.Fun | Готовы к запуску |
| **MARKETING.md** | Маркетинговые материалы | Нужны идеи для продвижения |
| **SMART_CONTRACT.md** | Документация контракта | Разработка on-chain версии |

### 🔧 Скрипты

| Файл | Что делает | Как запустить |
|------|-----------|---------------|
| **setup_devnet.ps1** ⭐ | Автоматическая настройка devnet | `.\setup_devnet.ps1` |
| **setup_devnet.sh** | То же для Linux/Mac | `./setup_devnet.sh` |
| **deploy_token_devnet.py** | Python деплой токена | `python deploy_token_devnet.py` |
| **airdrop_tokens.py** | Раздача токенов | `python airdrop_tokens.py <адрес> <кол-во>` |

### ⚙️ Конфигурация

| Файл | Описание |
|------|----------|
| **token_config.json** | Параметры токена TAMA |
| **devnet_config.json** | Создается автоматически после setup |
| **requirements.txt** | Python зависимости |
| **.gitignore** | Защита приватных ключей |
| **Anchor.toml** | Конфигурация Anchor |

### 📝 Смарт-контракт (Rust)

```
programs/tamagotchi/
├── src/
│   └── lib.rs           # Основной код контракта
├── Cargo.toml           # Зависимости Rust
```

---

## 🎯 Что делать дальше?

### Вариант 1: Просто поиграть
```
1. Откройте tamagotchi_enhanced.html
2. Нажмите "Завести питомца"
3. Играйте и получайте достижения!
```

### Вариант 2: Протестировать с блокчейном
```
1. Установите Solana CLI
2. Запустите setup_devnet.ps1
3. Откройте tamagotchi_devnet.html
4. Подключите Phantom (на Devnet!)
5. Тестируйте реальные транзакции
```

### Вариант 3: Запустить токен
```
1. Протестируйте все в devnet (см. Вариант 2)
2. Прочитайте PUMPFUN_GUIDE.md
3. Подготовьте маркетинг (MARKETING.md)
4. Создайте соцсети
5. Запуск на Pump.Fun!
6. Profit! 🚀
```

### Вариант 4: Разработать смарт-контракт
```
1. Установите Rust и Anchor
2. Читайте SMART_CONTRACT.md
3. Соберите: anchor build
4. Деплойте: anchor deploy
5. Интегрируйте с фронтендом
```

---

## 🎨 Функции по версиям

### tamagotchi.html (Базовая)
- ✅ Основная игровая механика
- ✅ 5 стадий эволюции
- ✅ Система статов
- ✅ Виртуальные токены
- ✅ Локальное сохранение

### tamagotchi_enhanced.html (Улучшенная) ⭐
- ✅ Всё из базовой +
- ✅ **Система достижений** (10 ачивок)
- ✅ **Комбо-система** (бонус за серию действий)
- ✅ **Улучшенная графика** (частицы, тени, анимации)
- ✅ **Настроение питомца** (динамические эмодзи)
- ✅ **Звуковые эффекты** (заглушки, легко добавить звуки)
- ✅ **Статистика** (серия действий, всего заработано)

### tamagotchi_devnet.html (Devnet)
- ✅ Всё из базовой +
- ✅ **Реальные транзакции** в Solana Devnet
- ✅ **Phantom интеграция**
- ✅ **Отображение балансов** (SOL и TAMA)
- ✅ **Автообновление** балансов

### dashboard.html (Аналитика)
- ✅ **Market Cap, Volume, Price**
- ✅ **Количество холдеров**
- ✅ **Активные игроки**
- ✅ **Лидерборд топ игроков**
- ✅ **Лента активности**
- ✅ **Быстрые ссылки** (Explorer, Chart, Trade)

---

## 📊 Сравнение версий

| Функция | Базовая | Enhanced | Devnet |
|---------|---------|----------|--------|
| Игровая механика | ✅ | ✅ | ✅ |
| Эволюция | ✅ | ✅ | ✅ |
| Достижения | ❌ | ✅ | ❌ |
| Комбо-система | ❌ | ✅ | ❌ |
| Улучшенная графика | ❌ | ✅ | ❌ |
| Блокчейн транзакции | ❌ | ❌ | ✅ |
| Реальные токены | ❌ | ❌ | ✅ |

**Рекомендация:** Играйте в **Enhanced** для лучшего опыта, тестируйте в **Devnet** перед запуском.

---

## 🛠 Инструменты и технологии

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Solana Web3.js
- SPL Token
- Phantom Wallet SDK

### Backend (будущее)
- Python 3.10+
- Solana SDK
- Flask (для API)

### Smart Contract
- Rust 1.70+
- Anchor Framework 0.29
- Solana Program Library

### Devtools
- Solana CLI
- Anchor CLI
- PowerShell / Bash

---

## 💡 Полезные ссылки

### Документация
- [Solana Docs](https://docs.solana.com/)
- [Anchor Book](https://book.anchor-lang.com/)
- [Phantom Docs](https://docs.phantom.app/)
- [SPL Token](https://spl.solana.com/token)

### Инструменты
- [Pump.Fun](https://pump.fun) - Запуск токена
- [Solana Explorer](https://explorer.solana.com) - Просмотр транзакций
- [Solana Faucet](https://faucet.solana.com/) - Devnet SOL
- [DEX Screener](https://dexscreener.com/) - Chart
- [Birdeye](https://birdeye.so/) - Аналитика

### Сообщество
- [Solana Discord](https://discord.gg/solana)
- [Phantom Discord](https://discord.gg/phantom)
- [r/solana](https://reddit.com/r/solana)

---

## 🎯 Roadmap

### ✅ Phase 1: MVP (Completed)
- [x] Базовая игра
- [x] Система эволюции
- [x] Улучшенная версия с достижениями
- [x] Devnet интеграция
- [x] Dashboard для мониторинга
- [x] Базовый смарт-контракт

### 🚧 Phase 2: Token Launch (In Progress)
- [ ] Запуск токена на Pump.Fun
- [ ] Маркетинговая кампания
- [ ] Интеграция реальных токенов в игру
- [ ] Листинг на DEX

### 📅 Phase 3: Smart Contracts
- [ ] Деплой смарт-контракта
- [ ] On-chain хранение питомцев
- [ ] Staking механизм
- [ ] Лотерейный контракт

### 📅 Phase 4: NFT & Marketplace
- [ ] Питомцы как NFT
- [ ] Редкие скины
- [ ] Marketplace
- [ ] Breeding система

### 📅 Phase 5: Social & Competitive
- [ ] Реальный лидерборд (on-chain)
- [ ] Битвы питомцев
- [ ] Гильдии
- [ ] Турниры с призами

### 📅 Phase 6: Expansion
- [ ] Мобильное приложение
- [ ] Кросс-чейн поддержка
- [ ] Партнерства
- [ ] GameFi интеграция

---

## 🏆 Достижения (Enhanced версия)

| Ачивка | Иконка | Как получить |
|--------|--------|--------------|
| Первый | 🥚 | Завести питомца |
| Повар | 🍖 | Покормить 10 раз |
| Игрок | 🎮 | Сыграть 50 раз |
| Мастер | ⭐ | Достичь 5 уровня |
| Богач | 💰 | Заработать 5000 токенов |
| Эволюция | 🐓 | Достичь 3 стадии |
| Легенда | 🦜 | Легендарная стадия |
| Комбо | 🔥 | 10 действий подряд |
| Неделя | 📅 | Питомцу 7 дней |
| Здоровяк | 💚 | 100% здоровье 24ч |

---

## ❓ FAQ

### Q: Какую версию игры выбрать?
**A:** Для игры - `tamagotchi_enhanced.html`. Для тестирования блокчейна - `tamagotchi_devnet.html`.

### Q: Как получить тестовые токены?
**A:** Запустите `setup_devnet.ps1`, затем используйте `airdrop_tokens.py`.

### Q: Сколько стоит запуск токена?
**A:** На Pump.Fun обычно от 0.1-1 SOL для начальной ликвидности.

### Q: Нужно ли знать программирование?
**A:** Нет для игры. Да для деплоя смарт-контрактов (Rust).

### Q: Безопасно ли это?
**A:** В devnet - полностью безопасно (тестовые токены). В mainnet - делайте DYOR.

### Q: Как добавить свои звуки?
**A:** В `tamagotchi_engine.js` функция `playSound()` - добавьте Audio API.

### Q: Можно ли изменить дизайн?
**A:** Да! Редактируйте CSS в HTML файлах.

### Q: Что если потеряю приватные ключи?
**A:** В devnet - не страшно, создайте новый кошелек. В mainnet - потеряете всё!

---

## 📞 Поддержка

### Возникли проблемы?
1. Проверьте [DEVNET_TESTING.md](DEVNET_TESTING.md) раздел Troubleshooting
2. Прочитайте [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
3. Откройте issue на GitHub
4. Спросите в Solana Discord

### Хотите помочь?
- 🐛 Нашли баг? Создайте issue
- 💡 Есть идея? Поделитесь!
- 🎨 Дизайнер? Улучшите графику
- 💻 Разработчик? Сделайте PR

---

## 🎉 Готовы начать?

### 1️⃣ Играть прямо сейчас:
```bash
# Откройте в браузере
tamagotchi_enhanced.html
```

### 2️⃣ Тестировать с блокчейном:
```bash
# PowerShell
.\setup_devnet.ps1

# Затем откройте
tamagotchi_devnet.html
```

### 3️⃣ Запускать токен:
```bash
# Читайте гайд
PUMPFUN_GUIDE.md
```

---

<div align="center">

## 🚀 **TO THE MOON WITH YOUR TAMAGOTCHI!** 🌕

### Создано с ❤️ для Solana комьюнити

[![Solana](https://img.shields.io/badge/Solana-14F195?style=for-the-badge&logo=solana&logoColor=white)](https://solana.com)
[![Play to Earn](https://img.shields.io/badge/Play_to_Earn-FFD700?style=for-the-badge&logo=gamepad&logoColor=black)](.)
[![Web3](https://img.shields.io/badge/Web3-F16822?style=for-the-badge&logo=web3.js&logoColor=white)](.)

**[🎮 Играть](tamagotchi_enhanced.html)** • 
**[📖 Документация](README.md)** • 
**[🚀 Запуск](PUMPFUN_GUIDE.md)** • 
**[💬 Discord](https://discord.gg/)** • 
**[🐦 Twitter](https://twitter.com/)**

</div>

---

*Последнее обновление: 2025*
*Версия: 1.0 (Enhanced)*













