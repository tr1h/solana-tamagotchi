# 💡 ДИЗАЙН ИГРОВОЙ МЕХАНИКИ

## 🤖 **АВТОКЛИКЕР - ПРОБЛЕМЫ И РЕШЕНИЯ**

### **Проблема #1: Обновление страницы**
```
❌ Сейчас: Обновил страницу → всё сбрасывается
   - Счетчики clicks обнуляются
   - Авто-кликеры теряются
   - Прогресс пропадает
```

### **Решение А: localStorage (Frontend)**
```javascript
Плюсы:
✅ Быстро работает
✅ Не требует транзакций
✅ Сохраняется между сессиями

Минусы:
❌ Можно читерить (изменить в консоли)
❌ Не синхронизируется между устройствами
❌ Теряется при очистке кэша

Реализация:
// При покупке авто-кликера
localStorage.setItem('autoClickers', autoClickers);
localStorage.setItem('totalClicks', totalClicks);

// При загрузке страницы
autoClickers = parseInt(localStorage.getItem('autoClickers')) || 0;
totalClicks = parseInt(localStorage.getItem('totalClicks')) || 0;
```

### **Решение B: On-Chain (Smart Contract)**
```rust
// В контракте добавить поля:
pub struct Pet {
    // ... существующие поля
    pub total_clicks: u64,           // Всего кликов
    pub auto_clickers: u8,           // Количество авто-кликеров
    pub last_autoclick_time: i64,    // Когда последний раз начислялись клики
}

Плюсы:
✅ Честная игра (нельзя читерить)
✅ Синхронизируется между устройствами
✅ Постоянное хранилище
✅ Можно проверить на блокчейне

Минусы:
❌ Каждый клик = транзакция (дорого!)
❌ Медленно (ждать подтверждения)
❌ Нужен SOL на комиссии
```

### **Решение C: HYBRID (ЛУЧШИЙ ВАРИАНТ!)**
```javascript
Frontend:
- Считаем клики локально (быстро)
- Сохраняем в localStorage
- Показываем пользователю

Smart Contract:
- Периодически синхронизируем (раз в час/день)
- Или синхронизируем при важных действиях (level up, покупка)
- Или только при выводе rewards

Пример:
1. Кликаешь → localStorage (мгновенно)
2. Покупаешь что-то → синхронизация с контрактом (1 транзакция)
3. Выводишь rewards → проверка контракта (честность)

Это как в Addicted.fun:
- Frontend показывает progress
- Blockchain = source of truth для наград
```

---

## 🎮 **АВТОКЛИКЕР: ВАРИАНТЫ МЕХАНИКИ**

### **Вариант А: Passive Income (пока игра открыта)**
```
Как работает:
- Покупаешь авто-кликер
- Пока игра ОТКРЫТА → автоматические клики каждую секунду
- Закрыл игру → клики останавливаются

Плюсы:
✅ Просто реализовать (setInterval)
✅ Стимулирует держать игру открытой
✅ Fair (нельзя abuse)

Минусы:
❌ Нужно держать вкладку открытой
❌ Не работает offline

Код:
setInterval(() => {
    if (autoClickers > 0 && pet.isAlive) {
        clicks += autoClickers;
        localStorage.setItem('totalClicks', clicks);
    }
}, 1000); // Каждую секунду
```

### **Вариант B: Накопительный (offline rewards)**
```
Как работает:
- Покупаешь авто-кликер
- Закрываешь игру
- Возвращаешься через час
- Получаешь накопленные клики!

Формула:
earned = autoClickers * secondsOffline * clicksPerSecond;

Плюсы:
✅ Работает offline
✅ Не нужно держать игру открытой
✅ Похоже на idle games

Минусы:
❌ Можно abuse (изменить системное время)
❌ Нужно хранить lastLoginTime

Реализация:
// При входе в игру
const now = Date.now();
const lastLogin = localStorage.getItem('lastLogin') || now;
const secondsOffline = (now - lastLogin) / 1000;
const earned = autoClickers * secondsOffline * 1; // 1 click/sec
totalClicks += earned;

// Лимит: максимум 24 часа offline
const maxOffline = 24 * 60 * 60; // 24 hours
const cappedSeconds = Math.min(secondsOffline, maxOffline);
```

### **Вариант C: Smart Contract Auto-Rewards**
```rust
// В контракте
pub fn claim_autoclick_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
    let pet = &mut ctx.accounts.pet;
    let clock = Clock::get()?;
    
    // Время с последнего claim
    let time_passed = clock.unix_timestamp - pet.last_autoclick_time;
    
    // Начисляем rewards
    let rewards = (time_passed as u64) * (pet.auto_clickers as u64);
    pet.total_clicks += rewards;
    pet.last_autoclick_time = clock.unix_timestamp;
    
    Ok(())
}

Плюсы:
✅ Честно (on-chain)
✅ Работает offline
✅ Нельзя читерить

Минусы:
❌ Нужна транзакция для claim
❌ Нужен SOL на gas
```

---

## 💰 **TOKENOMICS: ОТКУДА БЕРУТСЯ TAMA?**

### **КРИТИЧЕСКИЙ ВОПРОС!**

```
Проблема:
- Игрок платит 0.5 SOL
- Мы "даем" ему 1000 TAMA
- ОТКУДА эти 1000 TAMA?!

Если просто "печатаем" → инфляция → цена падает!
```

---

## 🎯 **РЕШЕНИЯ ДЛЯ TOKENOMICS:**

### **Вариант 1: PRE-MINE (как Bitcoin на старте)**
```
1. Создаем TAMA token
2. Сразу минтим 100M TAMA
3. Распределение:
   - 40% (40M) → Rewards Pool (для игроков)
   - 30% (30M) → Liquidity (DEX)
   - 20% (20M) → Team
   - 10% (10M) → Marketing

4. Игрок платит Entry Fee → получает из Rewards Pool

Плюсы:
✅ Фиксированный supply (дефляция!)
✅ Прозрачное распределение
✅ Не печатаем бесконечно

Минусы:
❌ Нужно заранее выделить rewards
❌ Rewards Pool может закончиться
```

### **Вариант 2: MINT ON DEMAND (как стейблкоины)**
```
1. Создаем TAMA token
2. Игрок платит Entry Fee (0.5 SOL)
3. Контракт МИНТИТ 1000 TAMA специально для него
4. Одновременно сжигаем TAMA от других действий

Баланс:
- Вход: +1000 TAMA (mint)
- Действия: -5 TAMA (burn)
- Авто-кликер: -100 TAMA (burn)

Если burn > mint → дефляция!

Плюсы:
✅ Не нужно pre-mine
✅ Баланс через burn rate
✅ Гибкая экономика

Минусы:
❌ Риск инфляции
❌ Сложнее балансировать
```

### **Вариант 3: КУПИТЬ ЗА SOL (как на DEX)**
```
1. Создаем TAMA token
2. Создаем Liquidity Pool (TAMA/SOL)
3. Игрок платит 0.5 SOL:
   - 0.3 SOL → Treasury
   - 0.2 SOL → автоматически покупает TAMA с DEX
   - Игрок получает купленные TAMA

Плюсы:
✅ Рыночная цена
✅ Реальная demand/supply
✅ Не печатаем токены
✅ Рост цены при спросе

Минусы:
❌ Нужна ликвидность сразу
❌ Цена может быть нестабильной
❌ Сложнее имплементировать
```

### **Вариант 4: TREASURY RESERVE (РЕКОМЕНДУЮ!)**
```
1. Создаем TAMA token
2. Минтим 100M TAMA
3. 40M TAMA → Treasury Contract (smart contract!)
4. Игрок платит Entry Fee:
   - 0.5 SOL → Team Wallet
   - 1000 TAMA → transfer из Treasury Contract

Treasury Contract:
- Хранит резервные TAMA
- Автоматически выдает при Entry Fee
- Отслеживает баланс
- Можно пополнить если нужно

Плюсы:
✅ Простая имплементация
✅ Контролируемая раздача
✅ Прозрачность (on-chain)
✅ Безопасность (smart contract)

Минусы:
❌ Нужен pre-mine
❌ Резерв может закончиться (но можно пополнить)
```

---

## 🏆 **РЕКОМЕНДУЕМАЯ МОДЕЛЬ:**

### **Hybrid: Treasury + Dynamic Pricing**

```
Phase 1: Launch (Pre-mine)
1. Минтим 100M TAMA
2. Распределение:
   - 40M → Treasury (для Entry Fee)
   - 30M → Liquidity Pool (DEX)
   - 20M → Team (vested 2 года)
   - 10M → Marketing

Phase 2: Entry Fee
1. Игрок платит 0.5 SOL
2. Получает 1000 TAMA из Treasury
3. SOL идет в Team Wallet

Phase 3: Burns (дефляция!)
1. Действия: 70% burn
2. Авто-кликер: 70% burn
3. Воскрешение: 100% burn (если TAMA)

Phase 4: Dynamic Rewards (когда Treasury кончается)
1. Treasury пустой?
2. Переключаемся на покупку с DEX
3. 0.2 SOL из Entry Fee → покупка TAMA
4. Игрок получает купленные TAMA

Результат:
✅ Старт: простая модель (из Treasury)
✅ Рост: рыночная модель (покупка с DEX)
✅ Всегда: massive burns (дефляция!)
✅ Долгосрочно: цена растет!
```

---

## 📊 **ПРИМЕР ЭКОНОМИКИ:**

### **Сценарий: 10,000 игроков**

```
ВХОДЯЩИЕ ТОКЕНЫ (MINT/РАСПРЕДЕЛЕНИЕ):
Entry Fee: 10,000 × 1,000 = 10M TAMA (из Treasury)

ИСХОДЯЩИЕ ТОКЕНЫ (BURN):
Actions: 10,000 игроков × 100 actions × 5 TAMA × 70% = 3.5M TAMA
Auto-clicker: 5,000 покупок × 100 TAMA × 70% = 350k TAMA
Resurrection: 3,000 × 5,000 TAMA × 100% = 15M TAMA

Total Burned: 18.85M TAMA
Total Distributed: 10M TAMA

NET: -8.85M TAMA (ДЕФЛЯЦИЯ!)

Результат: Supply уменьшается → Цена растет! 🚀
```

---

## 🎯 **КОНКРЕТНЫЙ ПЛАН:**

### **Для Devnet (тесты):**
```
1. Используем существующий TAMA token:
   74KGR9mdiiiqVW9QCnFmZz8cyj39ZoCaKexrSxF8fpQD

2. Создаем Treasury wallet с TAMA
3. При Entry Fee → transfer из Treasury
4. Burns работают как сейчас
```

### **Для Mainnet (launch):**
```
1. Создаем НОВЫЙ TAMA token на Pump.fun
2. Pre-mine: 100M TAMA
3. Распределение:
   - 40M → Treasury Contract
   - 30M → Liquidity (Raydium/Orca)
   - 20M → Team (vested)
   - 10M → Marketing

4. Entry Fee → transfer из Treasury
5. Когда Treasury < 1M → переход на DEX покупки
```

---

## 📝 **ЧТО НУЖНО СДЕЛАТЬ:**

### **1. Автокликер (Frontend):**
```javascript
✅ Сохранять в localStorage
✅ Offline rewards (макс 24 часа)
✅ Синхронизация с контрактом при важных действиях
```

### **2. Treasury Contract:**
```rust
✅ Создать PDA для Treasury
✅ Функция transfer_entry_reward()
✅ Отслеживание баланса4
```

### **3. Tokenomics:**
```
✅ Pre-mine 100M TAMA
✅ Распределить по wallets
✅ Настроить Treasury
✅ Документировать распределение
```

---

**ХОЧЕШЬ ИМПЛЕМЕНТИРОВАТЬ СЕЙЧАС ИЛИ СНАЧАЛА ОБСУДИМ ДЕТАЛИ?** 🚀💰


