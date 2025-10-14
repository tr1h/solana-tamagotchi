# 🎮 Solana Tamagotchi - Referral Landing

**GitHub**: https://github.com/tr1h/solana-tamagotchi  
**Live**: https://tr1h.github.io/solana-tamagotchi/

Публичная страница для реферальных ссылок Solana Tamagotchi.

## 🎯 Назначение

Этот репозиторий содержит:
- 📱 **s.html** - короткая реферальная страница с автоматическим редиректом
- 🎨 **referral.html** - полный лендинг с красивым превью
- 🖼️ **assets/** - изображения для соцсетей (Open Graph)

## 📁 Структура

```
solana-tamagotchi-public/
├── s.html                 # Короткая реферальная ссылка
├── referral.html          # Полный лендинг
├── index.html             # Главная страница
├── assets/
│   ├── referral-preview.png  # Картинка для соцсетей (1200x630)
│   └── referral-preview.svg  # Исходник
├── css/                   # Стили
│   ├── landing.css
│   ├── main.css
│   └── mobile.css
├── docs/                  # Документация
│   ├── BEAUTIFUL_SHARING_SETUP.md
│   └── CREATE_PNG_IMAGE.md
└── README.md             # Этот файл
```

## 🔗 Как работает

### 1. Пользователь получает ссылку в боте:
```
/ref → https://tr1h.github.io/solana-tamagotchi/s.html?ref=TAMA3F2A1C
```

### 2. s.html обрабатывает ссылку:
```javascript
// Получает код из URL
const refCode = urlParams.get('ref'); // TAMA3F2A1C

// Создаёт ссылку на бота
const botLink = `https://t.me/solana_tamagotchi_v3_bot?start=ref${refCode}`;

// Автоматически редиректит через 2 секунды
setTimeout(() => window.location.href = botLink, 2000);
```

### 3. Пользователь попадает в бот:
```
Бот получает: /start refTAMA3F2A1C
Находит реферера по коду
Начисляет 100 TAMA мгновенно!
```

## 🎨 Open Graph Preview

Когда ссылка расшаривается в соцсетях, показывается:
- 📸 **Картинка**: 1200x630px (referral-preview.png)
- 📝 **Заголовок**: "🎮 Join Solana Tamagotchi - Get 100 TAMA Bonus!"
- 💬 **Описание**: "Play-to-Earn NFT pet game on Solana! Grow unique pets, earn TAMA tokens..."

### Метатеги:
```html
<meta property="og:title" content="🎮 Join Solana Tamagotchi - Get 100 TAMA Bonus!">
<meta property="og:description" content="...">
<meta property="og:image" content="...referral-preview.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
```

## 🚀 Деплой на GitHub Pages

### 1. Пуш в GitHub:
```bash
git add .
git commit -m "Update referral landing"
git push origin main
```

### 2. Настройка Pages:
```
Settings → Pages → Source: Deploy from branch
Branch: main → / (root) → Save
```

### 3. Проверка:
```
https://tr1h.github.io/solana-tamagotchi/s.html?ref=TEST123
```

## 🔧 Кастомизация

### Изменить картинку:
1. Создай новую картинку 1200x630px
2. Сохрани как `assets/referral-preview.png`
3. Пуш в GitHub

### Изменить текст:
Отредактируй метатеги в `s.html`:
```html
<meta property="og:title" content="Твой заголовок">
<meta property="og:description" content="Твоё описание">
```

### Изменить время редиректа:
В `s.html` найди:
```javascript
setTimeout(() => window.location.href = link.href, 2000); // 2 секунды
```

## 📊 Аналитика

Страница отправляет данные о кликах (закомментировано):
```javascript
// Раскомментируй когда развернёшь analytics API
fetch('https://your-analytics-api.herokuapp.com/track_click', {
    method: 'POST',
    body: JSON.stringify({
        referral_code: refCode,
        clicked_at: new Date().toISOString(),
        user_agent: navigator.userAgent,
        referrer: document.referrer
    })
});
```

## 🎯 Best Practices

### SEO оптимизация:
- ✅ Open Graph теги
- ✅ Twitter Card теги
- ✅ Meta description
- ✅ Semantic HTML

### Performance:
- ✅ Минифицированный CSS
- ✅ Inline стили для критического CSS
- ✅ Оптимизированные изображения
- ✅ Быстрый редирект (2 сек)

### Mobile-first:
- ✅ Responsive дизайн
- ✅ Touch-friendly кнопки
- ✅ Viewport meta tag

## 📱 Тестирование

### Проверка Open Graph:
- https://developers.facebook.com/tools/debug/
- https://cards-dev.twitter.com/validator

### Проверка мобильной версии:
- Chrome DevTools → Device Toolbar
- https://search.google.com/test/mobile-friendly

## 📚 Документация

- [Настройка Beautiful Sharing](docs/BEAUTIFUL_SHARING_SETUP.md)
- [Создание PNG изображения](docs/CREATE_PNG_IMAGE.md)

## 🔗 Связь с основным проектом

Этот репозиторий работает вместе с:
- **Основной проект**: https://github.com/tr1h/huma-chain-xyz
- **Telegram бот**: @solana_tamagotchi_v3_bot

## 📝 License

MIT License

---

**Simple, fast, beautiful! 🎨**