# ✅ Cloudflare Pages - wrangler.toml Fix

## 🐛 Проблема:

**Ошибка при деплое на Cloudflare Pages:**
```
✘ [ERROR] Running configuration file validation for Pages:
  - Configuration file for Pages projects does not support "route"
```

**Причина:**
В `wrangler.toml` были указаны поля `route` и `env.production/preview`, которые используются для **Cloudflare Workers**, а не для **Cloudflare Pages**.

---

## ✅ Решение:

Упростил `wrangler.toml` для Cloudflare Pages:

### Было (❌):
```toml
name = "crypto-tamagotchi"
compatibility_date = "2024-01-01"

# Cloudflare Pages configuration
pages_build_output_dir = "vercel_deploy"

[env.production]
name = "crypto-tamagotchi"
route = "crypto-tamagotchi.pages.dev"  # ❌ Не поддерживается Pages!

[env.preview]
name = "crypto-tamagotchi-preview"
```

### Стало (✅):
```toml
name = "crypto-tamagotchi"
compatibility_date = "2024-01-01"

# Cloudflare Pages configuration
pages_build_output_dir = "vercel_deploy"
```

---

## 🔍 Разница между Workers и Pages:

### Cloudflare Workers (для backend):
- Нужен `route` или `routes[]`
- Поддерживает `[env.production]`, `[env.preview]`
- Запускает JavaScript/TypeScript код
- Используется для API, serverless functions

### Cloudflare Pages (для frontend):
- **НЕ нужен** `route`
- **НЕ нужны** env.production/preview
- Просто указываем `pages_build_output_dir`
- Деплоит статические файлы (HTML/CSS/JS)
- URL генерируется автоматически

---

## 📋 Минимальная конфигурация для Pages:

```toml
name = "crypto-tamagotchi"
compatibility_date = "2024-01-01"
pages_build_output_dir = "vercel_deploy"
```

**Этого достаточно!** Cloudflare Pages сам:
- Создаст URL: `crypto-tamagotchi.pages.dev`
- Настроит Preview deployments
- Подключит к GitHub для auto-deploy

---

## 🚀 Deploy снова:

После этого исправления, Cloudflare Pages сможет задеплоить проект.

**Что будет:**
1. Cloudflare увидит корректный `wrangler.toml`
2. Найдёт папку `vercel_deploy/`
3. Скопирует все HTML файлы
4. Опубликует на `crypto-tamagotchi.pages.dev`

---

## 💡 Если нужны переменные окружения:

Используй **Dashboard**, а не `wrangler.toml`:

1. Открой: https://dash.cloudflare.com/
2. Перейди в свой проект
3. **Settings** → **Environment variables**
4. Добавь переменные для Production/Preview

---

## ✅ Коммит запушен:

```bash
git add wrangler.toml
git commit -m "Fix wrangler.toml for Cloudflare Pages"
git push
```

**GitHub:** https://github.com/tr1h/crypto-tamagotchi

---

## 🎯 Следующий шаг:

**Retry deployment** на Cloudflare Pages:
1. Открой Cloudflare Dashboard
2. Найди свой проект
3. Нажми **"Retry deployment"**
4. ✅ Должно сработать!

---

## 📚 Документация:

- **Cloudflare Pages:** https://developers.cloudflare.com/pages/
- **wrangler.toml для Pages:** https://developers.cloudflare.com/pages/functions/wrangler-configuration/
- **Разница Workers vs Pages:** https://developers.cloudflare.com/pages/platform/functions/

---

**Готово! Попробуй Retry deployment на Cloudflare!** 🚀
