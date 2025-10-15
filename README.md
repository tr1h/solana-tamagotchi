# 🎮 Solana Tamagotchi - Referral Landing

**GitHub**: https://github.com/tr1h/solana-tamagotchi  
**Live**: https://tr1h.github.io/solana-tamagotchi/

Public page for Solana Tamagotchi referral links.

## 🎯 Purpose

This repository contains:
- 📱 **s.html** - short referral page with automatic redirect
- 🎨 **referral.html** - full landing page with beautiful preview
- 🏠 **index.html** - main landing page
- ⚙️ **admin.html** - admin panel
- 🖼️ **assets/** - images and generators for social media (Open Graph)
- 📝 **group_welcome_message.md** - Telegram group welcome message
- 📌 **group_pinned_message.md** - Telegram group pinned message

## 📁 Structure

```
solana-tamagotchi-public/
├── s.html                 # Short referral link
├── referral.html          # Full landing page
├── index.html             # Main page
├── admin.html             # Admin panel
├── assets/
│   ├── referral-preview.png  # Social media image (1200x630)
│   ├── referral-preview.svg  # Source file
│   ├── create-preview.html   # Image generator
│   ├── create-simple-png.html # Simple PNG creator
│   └── convert-to-png.html   # PNG converter
├── css/                   # Styles
│   ├── landing.css
│   ├── main.css
│   ├── mobile.css
│   ├── mint.css
│   └── animations.css
├── docs/                  # Documentation
│   ├── BEAUTIFUL_SHARING_SETUP.md
│   └── CREATE_PNG_IMAGE.md
├── group_welcome_message.md    # Telegram group welcome
├── group_pinned_message.md     # Telegram group pinned
└── README.md             # This file
```

## 🔗 How it works

### 1. User gets link from bot:
```
/ref → https://tr1h.github.io/solana-tamagotchi/s.html?ref=TAMA3F2A1C
```

### 2. s.html processes the link:
```javascript
// Gets code from URL
const refCode = urlParams.get('ref'); // TAMA3F2A1C

// Creates bot link
const botLink = `https://t.me/solana_tamagotchi_v3_bot?start=ref${refCode}`;

// Automatically redirects after 2 seconds
setTimeout(() => window.location.href = botLink, 2000);
```

### 3. User lands in bot:
```
Bot receives: /start refTAMA3F2A1C
Finds referrer by code
Awards 1,000 TAMA instantly!
```

## 🎨 Open Graph Preview

When link is shared on social media, shows:
- 📸 **Image**: 1200x630px (referral-preview.png)
- 📝 **Title**: "🎮 Join Solana Tamagotchi - Get 1,000 TAMA Bonus!"
- 💬 **Description**: "Play-to-Earn NFT pet game on Solana! Grow unique pets, earn TAMA tokens..."

### Meta tags:
```html
<meta property="og:title" content="🎮 Join Solana Tamagotchi - Get 1,000 TAMA Bonus!">
<meta property="og:description" content="...">
<meta property="og:image" content="...referral-preview.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
```

## 🚀 Deploy to GitHub Pages

### 1. Push to GitHub:
```bash
git add .
git commit -m "Update referral landing"
git push origin main
```

### 2. Setup Pages:
```
Settings → Pages → Source: Deploy from branch
Branch: main → / (root) → Save
```

### 3. Test:
```
https://tr1h.github.io/solana-tamagotchi/s.html?ref=TEST123
```

## 🔧 Customization

### Change image:
1. Create new image 1200x630px
2. Save as `assets/referral-preview.png`
3. Push to GitHub

### Change text:
Edit meta tags in `s.html`:
```html
<meta property="og:title" content="Your title">
<meta property="og:description" content="Your description">
```

### Change redirect time:
In `s.html` find:
```javascript
setTimeout(() => window.location.href = link.href, 2000); // 2 seconds
```

## 📊 Analytics

Page sends click data (commented out):
```javascript
// Uncomment when you deploy analytics API
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

### SEO optimization:
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Meta description
- ✅ Semantic HTML

### Performance:
- ✅ Minified CSS
- ✅ Inline styles for critical CSS
- ✅ Optimized images
- ✅ Fast redirect (2 sec)

### Mobile-first:
- ✅ Responsive design
- ✅ Touch-friendly buttons
- ✅ Viewport meta tag

## 📱 Testing

### Check Open Graph:
- https://developers.facebook.com/tools/debug/
- https://cards-dev.twitter.com/validator

### Check mobile version:
- Chrome DevTools → Device Toolbar
- https://search.google.com/test/mobile-friendly

## 📚 Documentation

- [Beautiful Sharing Setup](docs/BEAUTIFUL_SHARING_SETUP.md)
- [Create PNG Image](docs/CREATE_PNG_IMAGE.md)

## 🔗 Connection with main project

This repository works together with:
- **Main project**: https://github.com/tr1h/huma-chain-xyz
- **Telegram bot**: @solana_tamagotchi_v3_bot

## 📝 License

MIT License

---

**Simple, fast, beautiful! 🎨**