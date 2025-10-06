# ⚡ БЫСТРОЕ ОБНОВЛЕНИЕ ПРОЕКТА

## 🔄 КАК ОБНОВИТЬ ИГРУ НА VERCEL:

### **Вариант 1: Быстрое обновление (из vercel_deploy папки)**

```bash
# 1. Скопируй обновленный файл
Copy-Item "tamagotchi_devnet_v2_improved.html" -Destination "vercel_deploy\" -Force

# 2. Перейди в папку
cd vercel_deploy

# 3. Deploy!
vercel --prod
```

**Готово!** Обновления онлайн через 10 секунд! ⚡

---

### **Вариант 2: Из основной папки (если изменил несколько файлов)**

```bash
# Скопируй все нужные файлы
Copy-Item "tamagotchi_devnet_v2_improved.html" -Destination "vercel_deploy\" -Force
Copy-Item "index.html" -Destination "vercel_deploy\" -Force
Copy-Item "vercel.json" -Destination "vercel_deploy\" -Force

# Deploy
cd vercel_deploy
vercel --prod
```

---

## 🎯 **ТИПИЧНЫЕ СЦЕНАРИИ:**

### **Изменил HTML код:**
```bash
# Скопируй и деплой
Copy-Item "tamagotchi_devnet_v2_improved.html" -Destination "vercel_deploy\" -Force
cd vercel_deploy
vercel --prod
```

### **Обновил Program ID (после деплоя контракта):**
```bash
# 1. Обнови в обоих местах:
#    - lib.rs (строка 11)
#    - tamagotchi_devnet_v2_improved.html (строка ~942)

# 2. Скопируй и деплой
Copy-Item "tamagotchi_devnet_v2_improved.html" -Destination "vercel_deploy\" -Force
cd vercel_deploy
vercel --prod
```

### **Добавил новые файлы (картинки, звуки):**
```bash
# Скопируй файлы
Copy-Item "og-image.png" -Destination "vercel_deploy\" -Force
Copy-Item "sounds/*" -Destination "vercel_deploy\sounds\" -Recurse -Force

# Deploy
cd vercel_deploy
vercel --prod
```

---

## 📊 **ПРОВЕРКА ДЕПЛОЯ:**

### **После каждого деплоя:**
```
1. Открой URL в incognito mode (Ctrl+Shift+N)
2. Проверь что изменения применились
3. Тестируй функционал
4. Готово! ✅
```

### **Если изменения не видны:**
```
→ Очисти cache (Ctrl+F5)
→ Открой в incognito
→ Подожди 1-2 минуты
→ Проверь в Vercel Dashboard что деплой успешен
```

---

## 🔗 **ПОЛЕЗНЫЕ ССЫЛКИ:**

**Твой проект:**
```
https://crypto-tamagotchi-devnet-qobc58j2o-ivans-projects-4717924b.vercel.app
```

**Vercel Dashboard:**
```
https://vercel.com/ivans-projects-4717924b/crypto-tamagotchi-devnet
```

**Vercel Logs:**
```bash
vercel logs
```

---

## 🚨 **ВАЖНО:**

### **Всегда редактируй в основной папке:**
```
✅ Редактируй: C:\NEW proekt\tamagotchi_devnet_v2_improved.html
❌ НЕ редактируй: C:\NEW proekt\vercel_deploy\...
```

### **Потом копируй в vercel_deploy:**
```bash
Copy-Item "tamagotchi_devnet_v2_improved.html" -Destination "vercel_deploy\" -Force
```

**Почему?**
- Основная папка = source of truth
- vercel_deploy = только для деплоя
- Так не потеряешь изменения!

---

## 💡 **ЧАСТЫЕ ОБНОВЛЕНИЯ:**

### **Изменил баланс токенов:**
```javascript
// В tamagotchi_devnet_v2_improved.html
const FEED_COST = 5;  // Было 5, стало...
```
→ Скопируй → Deploy

### **Изменил treasury wallet:**
```javascript
const TEAM_WALLET = 'новый_адрес';
```
→ Скопируй → Deploy

### **Добавил новые фичи:**
```javascript
// Твой новый код
```
→ Скопируй → Deploy

---

## ⚡ **SUPER QUICK UPDATE:**

```bash
# Одна команда для всего!
Copy-Item "tamagotchi_devnet_v2_improved.html" -Destination "vercel_deploy\" -Force; cd vercel_deploy; vercel --prod; cd ..
```

**Готово!** 🚀

---

## 🎯 **ROLLBACK (откат на предыдущую версию):**

### **Если что-то сломалось:**
```bash
# Вернись к предыдущей версии
cd vercel_deploy
vercel rollback

# Или через Dashboard:
# https://vercel.com/ivans-projects-4717924b/crypto-tamagotchi-devnet
# → Найди старую версию → Promote to Production
```

---

**Теперь ты знаешь как быстро обновлять проект!** 💪

**Запомни:**
1. Редактируй в основной папке
2. Копируй в vercel_deploy
3. vercel --prod
4. Готово! ✅








