# 🚀 Фаза 1: Быстрый Mainnet Запуск (День 1-2)

## 🎯 ЦЕЛЬ:
Запустить рабочую версию игры в mainnet БЕЗ NFT контракта для:
- ✅ Быстрой проверки спроса
- ✅ Сбора feedback
- ✅ Роста комьюнити
- ✅ Тестирования токеномики

---

## ⚠️ ЧТО ЭТО БУДЕТ:

### V1 (Сейчас запускаем):
- ✅ Рабочая игра
- ✅ Настоящий токен $TAMA на mainnet
- ✅ Phantom wallet интеграция
- ✅ Можно покупать/продавать $TAMA
- ❌ Питомцы НЕ NFT (данные в браузере)
- ❌ Токены НЕ сжигаются реально
- ❌ Нет торговли питомцами

### V2 (Через неделю):
- ✅ Всё из V1
- ✅ Питомцы = NFT on-chain
- ✅ Реальное сжигание токенов
- ✅ Торговля на Magic Eden
- ✅ Механика смерти
- ✅ Миграция пользователей с V1

---

## 📋 ЧЕКЛИСТ ФАЗА 1:

### ДЕНЬ 1: Подготовка

#### ☐ Шаг 1: Создать mainnet wallet
```bash
# ВАЖНО: Используй НОВЫЙ wallet для mainnet!
solana-keygen new -o wallet-mainnet.json

# Настроить на mainnet
solana config set --url https://api.mainnet-beta.solana.com
solana config set --keypair wallet-mainnet.json

# Проверить
solana address
solana balance
```

**Адрес кошелька:** [запиши сюда после создания]  
**Баланс:** 0 SOL (нужно пополнить!)

---

#### ☐ Шаг 2: Пополнить кошелек SOL

**Сколько нужно:** ~2-3 SOL

**Где купить:**
1. **Binance** → купить SOL → вывести на свой адрес
2. **Coinbase** → купить SOL → вывести
3. **Phantom** → встроенный обменник

**Куда выводить:** Адрес из wallet-mainnet.json

⚠️ **ВАЖНО:** 
- Проверь адрес 3 раза!
- Сначала пошли 0.1 SOL (тест)
- Потом остальное

---

#### ☐ Шаг 3: Создать mainnet токен

```bash
# Создать токен (9 decimals)
spl-token create-token --decimals 9

# ЗАПИШИ MINT ADDRESS! Он нужен!
MINT_ADDRESS: _______________________________

# Создать token account
spl-token create-account [MINT_ADDRESS]

# ЗАПИШИ ACCOUNT ADDRESS!
ACCOUNT_ADDRESS: _______________________________

# Mint токенов (1 миллиард)
spl-token mint [MINT_ADDRESS] 1000000000

# Проверить баланс
spl-token balance [MINT_ADDRESS]
```

**ВАЖНО:** Сохрани эти адреса! Они нужны для конфига!

---

#### ☐ Шаг 4: Обновить конфиг в игре

Открой `tamagotchi_devnet.html` и измени:

```javascript
// БЫЛО (devnet):
const config = {
    network: 'devnet',
    rpcUrl: 'https://api.devnet.solana.com',
    tokenMint: '74KGR9mdiiiqVW9QCnFmZz8cyj39ZoCaKexrSxF8fpQD',
    tokenAccount: '32oijtpcwy8V8NzY1UC73zMa3sTWdzb9auR4DhyW6Ruj',
    walletAddress: '3grSgLGKkbd8pR7tzNssXMHn8ctTX7r6TE6uhRToF55h',
};

// СТАЛО (mainnet):
const config = {
    network: 'mainnet-beta',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    tokenMint: 'YOUR_MAINNET_MINT',        // ← Из шага 3
    tokenAccount: 'YOUR_MAINNET_ACCOUNT',  // ← Из шага 3
    walletAddress: 'YOUR_MAINNET_WALLET',  // ← Из шага 1
};
```

**Переименуй файл:**
```
tamagotchi_devnet.html → tamagotchi.html
```

---

#### ☐ Шаг 5: Обновить заголовок

Убери "DEVNET TESTNET" бейдж:

```html
<!-- БЫЛО: -->
<div class="devnet-badge">🧪 DEVNET TESTNET</div>

<!-- СТАЛО: -->
<div class="badge" style="background: linear-gradient(135deg, #667eea, #764ba2);">
    🚀 V1 BETA - NFT Coming Soon!
</div>
```

---

#### ☐ Шаг 6: Добавить важное предупреждение

```html
<p style="color: #ff6b6b; font-size: 14px; margin-top: 10px;">
    ⚠️ V1 BETA: Pets are stored locally (not NFT yet)
    <br>
    🔥 V2 with real NFTs coming in 7 days!
    <br>
    💰 $TAMA token is real and tradeable
</p>
```

---

### ДЕНЬ 2: Запуск

#### ☐ Шаг 7: Создать liquidity pool (опционально)

**На Raydium:**
1. Иди на https://raydium.io/liquidity/create/
2. Подключи wallet (wallet-mainnet.json через Phantom)
3. Выбери пару: SOL / TAMA
4. Добавь ликвидность:
   - 1-2 SOL
   - 10,000,000 TAMA
5. Подтверди транзакцию

**Стартовая цена:** ~0.0000001 SOL за TAMA

⚠️ **Можно пропустить** если хочешь запустить без трейдинга!

---

#### ☐ Шаг 8: Деплой на хостинг

**Вариант A: Vercel (рекомендую)**
```bash
# Установить Vercel CLI
npm i -g vercel

# Логин
vercel login

# Деплой
cd "C:\NEW proekt"
vercel

# Следуй инструкциям
# Vercel даст ссылку типа: https://crypto-tamagotchi.vercel.app
```

**Вариант B: Netlify**
```bash
npm i -g netlify-cli
netlify login
netlify deploy
```

**Вариант C: GitHub Pages**
```bash
# Создай репозиторий на GitHub
# Загрузи файлы
# Включи GitHub Pages в настройках
```

---

#### ☐ Шаг 9: Проверить всё работает

1. Открой деплой ссылку
2. Подключи Phantom (mainnet)
3. Создай питомца
4. Покорми/поиграй
5. Проверь что токены отображаются

**Если всё ОК → Переходим к шагу 10!**

---

#### ☐ Шаг 10: Объявить в Twitter

```
🚨 WE ARE LIVE! 🚨

Crypto Tamagotchi V1 is now on Solana Mainnet! 🐣

🎮 Play NOW: [your-link]
💰 $TAMA Token: [mint-address]
📊 Chart: [dexscreener or raydium]

V1 Features:
✅ Real $TAMA token
✅ Full game mechanics
✅ Phantom integration

⚠️ V1 = pets stored locally
🔥 V2 = NFT upgrade in 7 days!

First 100 players → whitelist for V2 NFT! 👀

RT + Comment with your pet name! 🐣

#Solana #Crypto #Tamagotchi #Launch
```

---

## 📊 МЕТРИКИ УСПЕХА (ДЕНЬ 1-2):

### Минимальный успех:
- ✅ 10+ игроков
- ✅ Игра работает без багов
- ✅ Позитивный feedback

### Хороший успех:
- ✅ 50+ игроков
- ✅ 20+ твитов о проекте
- ✅ Люди покупают $TAMA

### Отличный успех:
- ✅ 200+ игроков
- ✅ Trending в Solana комьюнити
- ✅ Influencer заметил

---

## ⚠️ ВАЖНЫЕ ЗАМЕЧАНИЯ:

### Безопасность:
```
❗ НИКОГДА не показывай seed phrase
❗ Храни wallet-mainnet.json в безопасности
❗ Сделай backup на флешку
❗ Не доверяй никому приватный ключ
```

### Легальность:
```
⚠️ Добавь disclaimer:
"This is experimental software. Use at your own risk.
Not financial advice. DYOR."
```

### Баги:
```
Будь готов к багам!
- Мониторь Twitter/Discord 24/7
- Быстро фикси критичные баги
- Будь честен с комьюнити
```

---

## 💰 РАСХОДЫ:

### Минимальные:
- Создание токена: ~0.01 SOL
- Mint токенов: ~0.001 SOL
- Gas fees: ~0.01 SOL
- **ИТОГО:** ~0.03 SOL (~$5)

### С ликвидностью:
- Всё выше: 0.03 SOL
- Liquidity pool: 1-2 SOL
- **ИТОГО:** ~2 SOL (~$300)

### С маркетингом:
- Всё выше: 2 SOL
- Twitter ads (опционально): $100-500
- Influencer shoutouts: $50-200
- **ИТОГО:** ~2 SOL + $150-700

---

## 📞 ЕСЛИ ЧТО-ТО ПОШЛО НЕ ТАК:

### Ошибка при создании токена:
```bash
# Проверь баланс SOL
solana balance

# Проверь network
solana config get

# Попробуй снова
spl-token create-token --decimals 9
```

### Игра не подключается к wallet:
- Проверь что Phantom в mainnet режиме
- Проверь RPC URL в конфиге
- Попробуй другой RPC: https://solana-api.projectserum.com

### Недостаточно SOL:
- Нужно минимум 0.05 SOL для операций
- Пополни через Binance/Coinbase

---

## 🎯 ПОСЛЕ ЗАПУСКА:

### В первый день:
- ✅ Мониторь баги
- ✅ Отвечай в Twitter
- ✅ Собирай feedback
- ✅ Создай Discord (опционально)

### На следующий день:
- ✅ Пост обновления в Twitter
- ✅ Фикси баги если есть
- ✅ Начни планировать V2

### Через неделю:
- ✅ Объяви V2 с NFT
- ✅ Подготовь миграцию
- ✅ Запуск V2! 🚀

---

## ✅ ГОТОВ НАЧАТЬ?

**Начинаем с шага 1:**

Хочешь чтобы я помог создать mainnet wallet?
Или ты уже можешь сам по инструкции выше?

**Скажи когда будешь готов и я помогу с следующими шагами!** 💪

---

## 📄 ДОПОЛНИТЕЛЬНЫЕ ФАЙЛЫ:

После завершения Фазы 1, переходи к:
- **PHASE_2_COMMUNITY.md** - Рост комьюнити (день 3-5)
- **PHASE_3_NFT.md** - Разработка NFT контракта (день 6-10)

**LET'S GO! 🚀**















