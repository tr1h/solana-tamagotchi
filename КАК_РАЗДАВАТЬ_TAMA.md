# 💰 КАК РАЗДАВАТЬ TAMA ТОКЕНЫ

## 🚀 Простая инструкция (3 шага):

### Шаг 1: Тестер присылает адрес кошелька

Тестер:
1. Открывает игру: https://crypto-tamagotchi-devnet-15m8295bj-ivans-projects-4717924b.vercel.app
2. Подключает кошелек Phantom
3. Нажимает кнопку "💰 Get Free TAMA"
4. Копирует свой адрес из модального окна
5. Присылает тебе: например `BXLsYmJ4vJ7dG7U8Bw7JnD4qgQsvHk31qijTvZ8cRz`

---

### Шаг 2: Ты раздаешь через Python скрипт

```bash
cd "C:\NEW proekt"

python tama_faucet.py BXLsYmJ4vJ7dG7U8Bw7JnD4qgQsvHk31qijTvZ8cRz
```

**Скрипт автоматически:**
- ✅ Создаст Token Account если нужно
- ✅ Отправит 1000 TAMA
- ✅ Покажет ссылку на транзакцию

---

### Шаг 3: Готово!

Тестер получит уведомление в кошельке через 5-10 секунд.

---

## 📝 Альтернативный способ (через SPL Token CLI):

```bash
# Раздать 1000 TAMA
spl-token transfer d8g1m1s14GFKw1P4kUjcTPjHrawwaPoJYPUhssXEjR6 1000 <WALLET_ADDRESS> --fund-recipient --url devnet

# Пример:
spl-token transfer d8g1m1s14GFKw1P4kUjcTPjHrawwaPoJYPUhssXEjR6 1000 BXLsYmJ4vJ7dG7U8Bw7JnD4qgQsvHk31qijTvZ8cRz --fund-recipient --url devnet
```

---

## 💡 Сначала убедись что у тебя есть токены:

### A) Проверить баланс:

```bash
spl-token accounts --url devnet
```

Должен увидеть токен `d8g1m1s14GFKw1P4kUjcTPjHrawwaPoJYPUhssXEjR6`

---

### B) Если токенов нет - накопи больше:

```bash
# Накопить 1,000,000 TAMA (хватит для 1000 тестеров)
spl-token mint d8g1m1s14GFKw1P4kUjcTPjHrawwaPoJYPUhssXEjR6 1000000 --url devnet

# Проверить что накопились:
spl-token accounts --url devnet
```

---

## 🎯 БЫСТРАЯ РАЗДАЧА (пример):

### Тестер пишет:
> "Привет! Мой адрес: BXLsYmJ4vJ7dG7U8Bw7JnD4qgQsvHk31qijTvZ8cRz"

### Ты делаешь:
```bash
python tama_faucet.py BXLsYmJ4vJ7dG7U8Bw7JnD4qgQsvHk31qijTvZ8cRz
```

### Вывод:
```
💰 TAMA TOKEN FAUCET - Devnet
🔗 Connected to https://api.devnet.solana.com
💳 Payer: ваш_адрес
🔨 Creating token account for BXLs...8cRz...
✅ Token account created

💰 Sending 1000 TAMA...
   From: ваш_ATA
   To: его_ATA

✅ SUCCESS! Sent 1000 TAMA to BXLs...8cRz
   Signature: 5QJt...xyz
   Explorer: https://explorer.solana.com/tx/...
```

### Тестер получает:
- ✅ 1000 TAMA в кошельке
- ✅ Уведомление в Phantom
- ✅ Может проверить в explorer

---

## 🔧 Обновить скрипт с правильным mint:

Открой `tama_faucet.py` и проверь:

```python
TOKEN_MINT = "d8g1m1s14GFKw1P4kUjcTPjHrawwaPoJYPUhssXEjR6"  # ✅ Правильный
```

---

## 📊 Раздать многим тестерам сразу:

Создай файл `testers_list.txt`:
```
BXLsYmJ4vJ7dG7U8Bw7JnD4qgQsvHk31qijTvZ8cRz
5QJtxYzaBcDefGhIjKlMnOpQrStUvWxYz123456789
9KpLmNoBaQrStUvWxYz123456789AbCdEfGhIjKl
```

Раздай всем:
```powershell
# PowerShell
Get-Content testers_list.txt | ForEach-Object { python tama_faucet.py $_ }
```

---

## ⚠️ ВАЖНО:

**Сейчас игра работает БЕЗ TAMA токенов!**
- Все действия БЕСПЛАТНЫЕ
- TAMA не требуются для игры
- Это для удобства тестирования

**Токены нужны только для:**
- Тестирования faucet кнопки
- Проверки что SPL токены работают
- Подготовки к mainnet

---

## ✅ Чеклист перед раздачей:

- [ ] У меня есть `wallet-devnet.json`
- [ ] На кошельке есть TAMA токены (проверил `spl-token accounts`)
- [ ] Скрипт `tama_faucet.py` работает
- [ ] Mint address = `d8g1m1s14GFKw1P4kUjcTPjHrawwaPoJYPUhssXEjR6`
- [ ] Тестер прислал корректный адрес

---

## 🎮 Готово!

Теперь ты можешь раздавать TAMA токены тестерам одной командой! 🚀


