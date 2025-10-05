# 💰 TAMA Faucet - Quick Start

## 🚀 Как раздать TAMA токены ПРЯМО СЕЙЧАС:

### Шаг 1: Получить адрес тестера

Тестер нажимает кнопку "💰 Get Free TAMA" и копирует свой адрес из модального окна.

### Шаг 2: Раздать токены через Python скрипт

```bash
cd "C:\NEW proekt"

python tama_faucet.py <WALLET_ADDRESS>
```

**Пример:**
```bash
python tama_faucet.py BXLsYmJ4vJ7dG7U8Bw7JnD4qgQsvHk31qijTvZ8cRz
```

### Шаг 3: Проверить результат

Скрипт покажет:
```
✅ SUCCESS! Sent 1000 TAMA to BXLs...8cRz
   Signature: 5QJt...xYz
   Explorer: https://explorer.solana.com/tx/5QJt...xYz?cluster=devnet
```

---

## 📋 Альтернативный способ (через SPL Token CLI):

```bash
# Если Python не работает, используй SPL Token CLI:
spl-token transfer 8qoV9ChnezQrvWijh7M1TDHzA7rBPEJBjxz7QyxcPdtG 1000 <WALLET> --fund-recipient --url devnet
```

---

## 🎯 Текущая ситуация:

**ВАЖНО:** Сейчас игра работает БЕЗ TAMA токенов!
- Все действия БЕСПЛАТНЫЕ
- Не требуют TAMA
- Это сделано специально для тестирования

**Кнопка "Get Free TAMA":**
- ✅ Показывается в игре
- ✅ Открывает модальное окно
- ✅ Показывает адрес кошелька
- ⚠️ Пока не раздает токены автоматически (только через скрипт)

---

## 💡 Что сказать тестерам:

```
🎮 Привет! Тестируй игру!

Сейчас все действия БЕСПЛАТНЫЕ - TAMA токены НЕ нужны!
Просто играй и тестируй функционал:
- Создай питомца
- Корми (Feed)
- Играй (Play)
- Лечи (Heal)
- Отдыхай (Rest)

Если хочешь протестировать TAMA токены - скинь мне свой адрес кошелька!
```

---

## 🔧 Если нужно раздать токены нескольким тестерам:

Создай файл `testers.txt`:
```
BXLsYmJ4vJ7dG7U8Bw7JnD4qgQsvHk31qijTvZ8cRz
5QJtxYzaBcDefGhIjKlMnOpQrStUvWxYz123456789
9KpLmNoBaQrStUvWxYz123456789AbCdEfGhIjKl
```

Раздай всем через цикл:
```bash
# PowerShell
Get-Content testers.txt | ForEach-Object { python tama_faucet.py $_ }

# Bash/WSL
while read wallet; do python tama_faucet.py $wallet; done < testers.txt
```

---

## ✅ Проверить что скрипт работает:

```bash
# Попробуй раздать себе:
python tama_faucet.py BXLsYmJ4vJ7dG7U8Bw7JnD4qgQsvHk31qijTvZ8cRz

# Проверь баланс:
spl-token accounts --url devnet
```

---

## 🎯 Готово!

Теперь ты можешь:
1. ✅ Принимать запросы от тестеров
2. ✅ Раздавать TAMA через Python скрипт
3. ✅ Отслеживать транзакции в explorer

**Ссылка на игру:** https://crypto-tamagotchi-devnet-15m8295bj-ivans-projects-4717924b.vercel.app


