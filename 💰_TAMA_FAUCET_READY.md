# 💰 TAMA TOKEN FAUCET - ГОТОВ!

## 🎉 Что добавлено:

### 1. Кнопка "Get Free TAMA"
- **Расположение:** Справа вверху, между "Get Devnet SOL" и "Report Bug"
- **Цвет:** Золотой градиент (FFD700 → FFA500)
- **Функция:** Открывает модальное окно для запроса TAMA токенов

### 2. Модальное окно с инструкциями
- Показывает адрес кошелька тестера
- Объясняет как получить токены
- Кнопка "Request 1000 TAMA"
- Показывает лимиты и cooldown

### 3. Cooldown система
- **Лимит:** 1000 TAMA за запрос
- **Cooldown:** 5 минут между запросами
- Сохраняется в localStorage по адресу кошелька

### 4. Python скрипт для airdrop
**Файл:** `tama_faucet.py`

Позволяет раздавать TAMA токены тестерам:
```bash
python tama_faucet.py <wallet_address>
```

---

## 🚀 Как использовать (для тестеров):

1. **Подключи кошелек** в игре
2. **Нажми кнопку** "💰 Get Free TAMA" (справа вверху)
3. **Скопируй адрес** своего кошелька из модального окна
4. **Нажми** "Request 1000 TAMA"
5. **Подожди 10 секунд** - токены придут автоматически!

---

## 🔧 Как раздавать токены (для админа):

### Вариант 1: Python скрипт (рекомендуется)

```bash
# Установить зависимости (если еще не установлены)
pip install solana solders spl-token

# Раздать 1000 TAMA токенов
python tama_faucet.py BXLs...8cRz
```

**Что делает скрипт:**
- ✅ Подключается к Devnet
- ✅ Загружает кошелек из `wallet-devnet.json`
- ✅ Создает Associated Token Account если нужно
- ✅ Отправляет 1000 TAMA токенов
- ✅ Показывает ссылку на explorer

### Вариант 2: Ручная раздача через SPL Token CLI

```bash
spl-token transfer 8qoV9ChnezQrvWijh7M1TDHzA7rBPEJBjxz7QyxcPdtG 1000 <recipient_wallet> --fund-recipient
```

### Вариант 3: Backend API (TODO)

Создать простой backend который будет:
1. Принимать POST запросы с адресом кошелька
2. Проверять cooldown в БД
3. Отправлять токены через Python скрипт
4. Возвращать TX signature

---

## 📊 Статус:

✅ **Frontend готов** - кнопка и модальное окно работают  
✅ **Python скрипт готов** - можно раздавать токены вручную  
⏳ **Backend API** - пока нет (токены раздаются вручную)  
⏳ **Автоматическая раздача** - пока нет (нужен backend)  

---

## 💡 Текущее решение:

**Сейчас игра работает БЕЗ TAMA токенов!**
- Все действия (Feed, Play, Heal, Rest) - **БЕСПЛАТНЫЕ**
- Не требуют TAMA токенов
- Это сделано специально для упрощения тестирования

Когда нажимаешь "Get Free TAMA":
```javascript
// Показывает:
⚠️ TAMA Faucet coming soon! For now, actions are FREE (no TAMA needed)
```

---

## 🎯 Планы на будущее:

1. **Создать простой Backend API**
   - Express.js или Flask
   - База данных для cooldown
   - Автоматическая раздача токенов

2. **Включить TAMA в действиях**
   - Feed = 1 TAMA
   - Play = 2 TAMA
   - Heal = 5 TAMA
   - Rest = 1 TAMA

3. **Добавить заработок TAMA**
   - +5 TAMA за каждое действие (бонус!)
   - +10 TAMA за level up
   - +50 TAMA за выполнение квестов

---

## 🔗 Deployed:

**Production:** https://crypto-tamagotchi-devnet-15m8295bj-ivans-projects-4717924b.vercel.app

---

## 📝 Инструкция для тестеров:

Добавь в README или модальное окно:

```
💰 How to get TAMA tokens:

1. Connect your Phantom wallet
2. Switch to Devnet in wallet settings
3. Click "Get Devnet SOL" (need for gas fees)
4. Click "Get Free TAMA" (get 1000 TAMA)
5. Create your pet & play!

⚠️ Currently all actions are FREE (no TAMA needed)
We're testing game mechanics first!
```

---

## 🎮 Тестирование:

1. **Открой игру** - видишь кнопку "💰 Get Free TAMA"?
2. **Подключи кошелек** - кнопка показывается?
3. **Нажми на кнопку** - модальное окно открывается?
4. **Проверь cooldown** - работает ограничение 5 минут?
5. **Запроси токены 2 раза** - второй раз показывает cooldown?

Perfect! 🎯


