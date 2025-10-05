# ⚡ БЫСТРЫЙ DEPLOY (3 шага)

## 📋 ШАГ 1: Создай API токен

### Открой:
```
https://dash.cloudflare.com/profile/api-tokens
```

### Действия:
1. ➡️ Нажми **"Create Token"**
2. ➡️ Найди **"Edit Cloudflare Workers"**
3. ➡️ Нажми **"Use template"**
4. ➡️ **"Continue to summary"**
5. ➡️ **"Create Token"**
6. ➡️ **СКОПИРУЙ токен** (покажется 1 раз!)

---

## ⚙️ ШАГ 2: Добавь токен в PowerShell

Скопируй свой токен и выполни в терминале:

```powershell
$env:CLOUDFLARE_API_TOKEN = "СЮДА_ВСТАВЬ_СВОЙ_ТОКЕН"
```

**Пример:**
```powershell
$env:CLOUDFLARE_API_TOKEN = "FqXv8ZnK9mH7rBpD4wL2sY1cT6gN3jR5xA0oE8uI"
```

---

## 🚀 ШАГ 3: Deploy!

```bash
cd my-vibe-sdk
npm run deploy
```

---

## ✅ ЧТО ПОЛУЧИШЬ:

После успешного deploy увидишь:
```
✨ Successfully deployed worker
🌍 https://my-vibe-sdk.ТВОЙ-ID.workers.dev
```

Это и есть твой **PRODUCTION API URL**! 🎉

---

## 🎮 КАК ИСПОЛЬЗОВАТЬ В ИГРЕ:

После deploy можешь использовать API из любой точки мира!

### В `tamagotchi_devnet_v2_improved.html`:

```javascript
// Замени localhost на production URL
const API_URL = 'https://my-vibe-sdk.ТВОЙ-ID.workers.dev';

// Генерация питомца
async function generateRandomPet() {
    try {
        const response = await fetch(`${API_URL}/generate-pet`);
        const pet = await response.json();
        
        console.log('🐣 Новый питомец:', pet);
        // {
        //   name: "Pet #4567",
        //   species: "Dragon",
        //   color: "Golden",
        //   rarity: "Legendary",
        //   power: 95
        // }
        
        return pet;
    } catch (err) {
        console.error('Ошибка API:', err);
    }
}

// Leaderboard
async function updateLeaderboard() {
    const response = await fetch(`${API_URL}/leaderboard`);
    const leaders = await response.json();
    
    let html = '<h2>🏆 Топ игроков</h2>';
    leaders.forEach(player => {
        html += `
            <div class="leader-row">
                <span class="rank">#${player.rank}</span>
                <span class="wallet">${player.wallet}</span>
                <span class="level">Lvl ${player.level}</span>
                <span class="score">${player.score} pts</span>
            </div>
        `;
    });
    
    document.getElementById('leaderboard').innerHTML = html;
}

// Статистика
async function loadStats() {
    const response = await fetch(`${API_URL}/stats`);
    const stats = await response.json();
    
    document.getElementById('totalPets').textContent = stats.totalPets;
    document.getElementById('totalPlayers').textContent = stats.totalPlayers;
    document.getElementById('activeNow').textContent = stats.activeNow;
}

// Реферальная ссылка
async function createReferral(wallet) {
    const response = await fetch(`${API_URL}/referral/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet })
    });
    
    const data = await response.json();
    
    console.log('🎁 Твоя реферальная ссылка:', data.link);
    // https://crypto-tamagotchi.pages.dev?ref=NDlrd0VL
    
    return data;
}

// Вызов при загрузке
window.addEventListener('load', async () => {
    await loadStats();
    await updateLeaderboard();
    
    // Обновляем каждые 30 секунд
    setInterval(async () => {
        await loadStats();
        await updateLeaderboard();
    }, 30000);
});
```

---

## 🌍 ENDPOINTS:

| URL | Метод | Описание |
|-----|-------|----------|
| `/generate-pet` | GET | Случайный питомец с traits |
| `/stats` | GET | Статистика игры |
| `/leaderboard` | GET | Топ-10 игроков |
| `/referral/create` | POST | Создать реферал код |

Все с **CORS enabled** → работает из браузера! ✅

---

## 💡 ТЕСТИРОВАНИЕ:

После deploy открой в браузере:

```
https://my-vibe-sdk.ТВОЙ-ID.workers.dev
```

Увидишь красивый UI с кнопками для теста! 🎨

---

## 📝 СКОПИРУЙ И ВЫПОЛНИ:

**1. Создай токен:**
https://dash.cloudflare.com/profile/api-tokens

**2. В терминале:**
```powershell
$env:CLOUDFLARE_API_TOKEN = "твой_токен_сюда"
cd my-vibe-sdk
npm run deploy
```

**3. Скопируй URL из вывода!**

**ПОЕХАЛИ!** 🚀
