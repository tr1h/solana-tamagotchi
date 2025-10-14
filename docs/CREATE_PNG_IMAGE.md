# 🎨 СОЗДАНИЕ PNG ДЛЯ ПРЕВЬЮ

## 🚨 ПРОБЛЕМА:
Telegram не показывает SVG в превью! Нужен PNG 1200x630px.

## ✅ РЕШЕНИЕ:

### Вариант 1: Онлайн-генератор (БЫСТРО)
1. Открой: https://www.canva.com/create/og-images/
2. Создай изображение 1200x630px:
   - Фон: Градиент (#667eea → #764ba2)
   - Текст: "Solana Tamagotchi"
   - Emoji: 🐾
   - Бонус: "100 TAMA"
3. Скачай как PNG
4. Переименуй в `referral-preview.png`
5. Загрузи в `C:\goooog\solana-tamagotchi-public\assets\`

### Вариант 2: Photopea (БЕСПЛАТНО)
1. Открой: https://www.photopea.com/
2. Создай новый файл 1200x630px
3. Дизайн как в SVG
4. Экспорт → PNG
5. Сохрани как `referral-preview.png`

### Вариант 3: Используй готовый шаблон
1. Открой конвертер: https://tr1h.github.io/solana-tamagotchi/assets/convert-to-png.html
2. Скачай PNG
3. Замени файл `referral-preview.png` в папке `assets/`

## 📤 ПОСЛЕ СОЗДАНИЯ PNG:

1. Удали старый файл:
```bash
rm C:\goooog\solana-tamagotchi-public\assets\referral-preview.png
```

2. Скопируй новый PNG в:
```
C:\goooog\solana-tamagotchi-public\assets\referral-preview.png
```

3. Закоммить:
```bash
cd C:\goooog\solana-tamagotchi-public
git add assets/referral-preview.png
git commit -m "Add PNG preview image for referral sharing"
git push
```

4. Проверь превью:
- Поделись ссылкой в Telegram
- Должно показать красивую картинку!

## 🎯 ВАЖНО:
- Размер: **1200x630px** (обязательно!)
- Формат: **PNG или JPG**
- Вес: до 5MB
- Качество: высокое

---

**🚀 ПОСЛЕ ЗАГРУЗКИ PNG ПРЕВЬЮ ЗАРАБОТАЕТ!**

