# 🔐 АВТОРИЗАЦИЯ В CLOUDFLARE

## ✅ ЧТО ДЕЛАТЬ:

### Шаг 1: Открой эту ссылку в браузере

Скопируй и открой в браузере:

```
https://dash.cloudflare.com/oauth2/auth?response_type=code&client_id=54d11594-84e4-41aa-b438-e81b8fa78ee7&redirect_uri=http%3A%2F%2Flocalhost%3A8976%2Foauth%2Fcallback&scope=account%3Aread%20user%3Aread%20workers%3Awrite%20workers_kv%3Awrite%20workers_routes%3Awrite%20workers_scripts%3Awrite%20workers_tail%3Aread%20d1%3Awrite%20pages%3Awrite%20zone%3Aread%20ssl_certs%3Awrite%20ai%3Awrite%20queues%3Awrite%20pipelines%3Awrite%20secrets_store%3Awrite%20containers%3Awrite%20cloudchamber%3Awrite%20connectivity%3Aadmin%20offline_access&state=fWJ3UO9IspfaIH9HkO1IIy0huK-lAWQn&code_challenge=-Q3vwjess_tsPtHXCNunqGvxoz151ACzNWd2CcHiwSQ&code_challenge_method=S256
```

### Шаг 2: Нажми "Allow"

Увидишь страницу:
```
✅ Allow Wrangler to access your Cloudflare account?
```

Жми **"Allow"** / **"Разрешить"**

### Шаг 3: Вернись в терминал

После "Allow" терминал автоматически продолжит!

---

## 🔄 АЛЬТЕРНАТИВА - API Token (ИСПОЛЬЗУЕМ ЭТО):

OAuth не работает из-за localhost. Создадим токен вручную!

### Шаг 1: Открой Cloudflare Dashboard

```
https://dash.cloudflare.com/profile/api-tokens
```

### Шаг 2: Создай токен

1. Нажми **"Create Token"**
2. Найди **"Edit Cloudflare Workers"** template
3. Нажми **"Use template"**

### Шаг 3: Настрой права (оставь всё как есть)

Должно быть:
```
✅ Account - Cloudflare Workers Scripts - Edit
✅ Account - Account Settings - Read
✅ User - User Details - Read
```

### Шаг 4: Создай и скопируй токен

1. Нажми **"Continue to summary"**
2. Нажми **"Create Token"**
3. **СКОПИРУЙ ТОКЕН** (покажется один раз!)

Пример:
```
FqXv8ZnK9mH7rBpD4wL2sY1cT6gN3jR5xA0oE8uI
```

### Шаг 5: Сохрани токен в переменную

В терминале:
```powershell
$env:CLOUDFLARE_API_TOKEN = "ТВОЙ_ТОКЕН_СЮДА"
```

### Шаг 6: Deploy!

```bash
cd my-vibe-sdk
npm run deploy
```

---

## 📋 ИНСТРУКЦИЯ ДЛЯ КОПИРОВАНИЯ:

1. Открой: https://dash.cloudflare.com/profile/api-tokens
2. Create Token → Edit Cloudflare Workers → Use template
3. Create Token → Скопируй токен
4. В терминале: `$env:CLOUDFLARE_API_TOKEN = "твой_токен"`
5. Deploy: `npm run deploy`

**Готово!** 🚀
