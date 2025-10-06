# 🎮 КАК ИСПОЛЬЗОВАТЬ API В ИГРЕ

## 🌍 Твой Production API:

```
https://my-vibe-sdk.travkevich.workers.dev
```

**Тестируй прямо сейчас:**
- Открой в браузере
- Жми на кнопки
- Смотри результаты в зелёном блоке

---

## 🎯 ИНТЕГРАЦИЯ В TAMAGOTCHI

### 1️⃣ Добавь API константу в HTML

В `tamagotchi_devnet_v2_improved.html` в начало `<script>`:

```javascript
// ⚡ Production API на Cloudflare Workers
const WORKERS_API = 'https://my-vibe-sdk.travkevich.workers.dev';
```

---

### 2️⃣ ГЕНЕРАЦИЯ СЛУЧАЙНЫХ ПИТОМЦЕВ

Используй при создании NFT:

```javascript
// Генерация уникального питомца
async function generateRandomPet() {
    try {
        const response = await fetch(`${WORKERS_API}/generate-pet`);
        const pet = await response.json();
        
        console.log('🐣 Новый питомец:', pet);
        
        return pet;
        // Результат:
        // {
        //   name: "Pet #4567",
        //   species: "Dragon",
        //   color: "Golden",
        //   rarity: "Legendary",
        //   power: 95,
        //   speed: 87,
        //   intelligence: 76,
        //   dna: "a7f8d3e2-9b4c-..."
        // }
    } catch (err) {
        console.error('❌ Ошибка генерации:', err);
        return null;
    }
}

// Интеграция в кнопку создания питомца
async function createPetWithRandomTraits() {
    showStatus('🎲 Генерирую случайного питомца...');
    
    const petData = await generateRandomPet();
    
    if (!petData) {
        showStatus('❌ Ошибка генерации');
        return;
    }
    
    showStatus(`✨ Создаю ${petData.species} (${petData.rarity})...`);
    
    // Создаём питомца в контракте
    await createPet();
    
    showStatus(`🎉 ${petData.name} создан!`);
}
```

---

### 3️⃣ LEADERBOARD

Добавь секцию лидеров:

```javascript
// Загрузка и отображение leaderboard
async function loadLeaderboard() {
    try {
        const response = await fetch(`${WORKERS_API}/leaderboard`);
        const leaders = await response.json();
        
        let html = `
            <div class="leaderboard-section">
                <h2>🏆 Top Players</h2>
                <div class="leaders-list">
        `;
        
        leaders.forEach(player => {
            html += `
                <div class="leader-row">
                    <span class="rank">#${player.rank}</span>
                    <span class="wallet">${player.wallet}</span>
                    <span class="pet-name">${player.petName}</span>
                    <span class="level">Lvl ${player.level}</span>
                    <span class="score">${player.score.toLocaleString()} pts</span>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
        
        document.getElementById('leaderboard-container').innerHTML = html;
    } catch (err) {
        console.error('❌ Ошибка загрузки leaderboard:', err);
    }
}

// Вызов при загрузке страницы
window.addEventListener('load', () => {
    loadLeaderboard();
    
    // Обновляем каждые 30 секунд
    setInterval(loadLeaderboard, 30000);
});
```

**HTML для leaderboard:**

```html
<!-- Добавь после контейнера с питомцем -->
<div id="leaderboard-container" style="margin-top: 20px;"></div>

<style>
.leaderboard-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    border-radius: 15px;
    color: white;
}

.leaders-list {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 10px;
}

.leader-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    margin: 5px 0;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    font-size: 14px;
}

.rank {
    font-weight: bold;
    font-size: 18px;
    min-width: 40px;
}

.wallet {
    font-family: monospace;
    font-size: 12px;
    opacity: 0.8;
}
</style>
```

---

### 4️⃣ СТАТИСТИКА ИГРЫ

Добавь панель статистики:

```javascript
// Загрузка глобальной статистики
async function loadGameStats() {
    try {
        const response = await fetch(`${WORKERS_API}/stats`);
        const stats = await response.json();
        
        document.getElementById('totalPets').textContent = stats.totalPets.toLocaleString();
        document.getElementById('totalPlayers').textContent = stats.totalPlayers.toLocaleString();
        document.getElementById('activeNow').textContent = stats.activeNow;
        document.getElementById('avgLevel').textContent = stats.avgLevel;
        document.getElementById('popularSpecies').textContent = stats.mostPopularSpecies;
        
        console.log('📊 Stats loaded:', stats);
    } catch (err) {
        console.error('❌ Ошибка загрузки stats:', err);
    }
}

// Обновляем при загрузке
window.addEventListener('load', () => {
    loadGameStats();
    setInterval(loadGameStats, 60000); // Каждую минуту
});
```

**HTML для статистики:**

```html
<!-- Добавь в верхнюю часть страницы -->
<div class="game-stats">
    <div class="stat-card">
        <div class="stat-value" id="totalPets">-</div>
        <div class="stat-label">Total Pets</div>
    </div>
    <div class="stat-card">
        <div class="stat-value" id="totalPlayers">-</div>
        <div class="stat-label">Players</div>
    </div>
    <div class="stat-card">
        <div class="stat-value" id="activeNow">-</div>
        <div class="stat-label">Active Now</div>
    </div>
    <div class="stat-card">
        <div class="stat-value" id="popularSpecies">-</div>
        <div class="stat-label">Most Popular</div>
    </div>
</div>

<style>
.game-stats {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.stat-card {
    flex: 1;
    min-width: 120px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 15px;
    border-radius: 12px;
    text-align: center;
    color: white;
}

.stat-value {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 5px;
}

.stat-label {
    font-size: 12px;
    opacity: 0.8;
    text-transform: uppercase;
}
</style>
```

---

### 5️⃣ РЕФЕРАЛЬНАЯ СИСТЕМА

Добавь генерацию реферальных ссылок:

```javascript
// Создание реферальной ссылки
async function createReferralLink() {
    if (!wallet) {
        showStatus('❌ Подключи кошелёк');
        return;
    }
    
    try {
        showStatus('🎁 Создаю реферальную ссылку...');
        
        const response = await fetch(`${WORKERS_API}/referral/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                wallet: wallet.publicKey.toString()
            })
        });
        
        const data = await response.json();
        
        document.getElementById('referralCode').textContent = data.code;
        document.getElementById('referralLink').value = data.link;
        document.getElementById('referralBonus').textContent = data.bonus;
        
        showStatus(`✅ Ссылка создана! Бонус: ${data.bonus} TAMA`);
        
        console.log('🎁 Referral:', data);
        // {
        //   code: "NDlrd0VL",
        //   link: "https://crypto-tamagotchi.pages.dev?ref=NDlrd0VL",
        //   bonus: 100
        // }
    } catch (err) {
        showStatus('❌ Ошибка создания ссылки');
        console.error(err);
    }
}

// Копирование ссылки
function copyReferralLink() {
    const link = document.getElementById('referralLink').value;
    navigator.clipboard.writeText(link);
    showStatus('✅ Ссылка скопирована!');
}
```

**HTML для реферальной системы:**

```html
<!-- Добавь новую секцию -->
<div class="referral-section">
    <h3>🎁 Invite Friends & Earn Rewards</h3>
    <p>Get <strong id="referralBonus">100</strong> TAMA for each friend!</p>
    
    <button onclick="createReferralLink()">🔗 Generate Referral Link</button>
    
    <div class="referral-result" style="margin-top: 15px; display: none;" id="referralResult">
        <p>Your code: <strong id="referralCode">-</strong></p>
        <div style="display: flex; gap: 10px;">
            <input 
                type="text" 
                id="referralLink" 
                readonly 
                style="flex: 1; padding: 10px; border-radius: 8px;"
            >
            <button onclick="copyReferralLink()">📋 Copy</button>
        </div>
    </div>
</div>

<style>
.referral-section {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    padding: 20px;
    border-radius: 15px;
    color: white;
    margin-top: 20px;
}

.referral-section h3 {
    margin-bottom: 10px;
}

.referral-section button {
    background: white;
    color: #f5576c;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
}

.referral-section button:hover {
    transform: scale(1.05);
}
</style>
```

---

## 🧪 ТЕСТИРОВАНИЕ

### 1. Открой в браузере:
```
https://my-vibe-sdk.travkevich.workers.dev
```

### 2. Попробуй все endpoints:
- 🎲 Generate Pet
- 📊 Stats
- 🏆 Leaderboard
- 🎁 Referral

### 3. Проверь CORS:
Открой консоль (F12) в игре и выполни:

```javascript
fetch('https://my-vibe-sdk.travkevich.workers.dev/generate-pet')
    .then(r => r.json())
    .then(data => console.log('✅ CORS работает!', data))
    .catch(err => console.error('❌ CORS ошибка:', err));
```

Должно вывести:
```
✅ CORS работает! { name: "Pet #1234", species: "Dragon", ... }
```

---

## 📋 CHECKLIST ИНТЕГРАЦИИ:

- [ ] Добавить константу `WORKERS_API`
- [ ] Интегрировать генерацию питомцев
- [ ] Добавить leaderboard секцию
- [ ] Добавить статистику игры
- [ ] Реализовать реферальную систему
- [ ] Протестировать все endpoints
- [ ] Задеплоить обновлённую игру

---

## 🚀 ДЕПЛОЙ ОБНОВЛЁННОЙ ИГРЫ:

После интеграции API:

```bash
# GitHub
git add .
git commit -m "🎮 Add Cloudflare Workers API integration"
git push

# Cloudflare Pages обновится автоматически
```

---

## 💡 ЧТО ДАЛЬШЕ:

### Уровень 2: База данных
- KV Storage для реального leaderboard
- Сохранение статистики
- Трекинг рефералов

### Уровень 3: AI генерация
- Workers AI для уникальных питомцев
- Генерация по описанию
- AI противники

**Готово к интеграции!** 🎉


