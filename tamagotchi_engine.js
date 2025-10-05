// Crypto Tamagotchi Enhanced - Game Engine
// ==========================================

// Игровое состояние
let gameState = {
    petName: "Питомец",
    level: 1,
    stage: 0,
    health: 100,
    hunger: 100,
    happiness: 100,
    energy: 100,
    experience: 0,
    age: 0,
    tokens: 1000,
    earnedTokens: 0,
    walletConnected: false,
    lastUpdate: Date.now(),
    totalActions: 0,
    actionStreak: 0,
    lastActionTime: 0,
    achievements: {},
    comboMultiplier: 1
};

// Эволюционные стадии
const stages = [
    { name: "Яйцо", sprite: "🥚", expRequired: 0, mood: ["🤔"] },
    { name: "Младенец", sprite: "🐣", expRequired: 0, mood: ["😊", "😴", "😢", "🤗"] },
    { name: "Подросток", sprite: "🐥", expRequired: 100, mood: ["😎", "😁", "😴", "😤"] },
    { name: "Взрослый", sprite: "🐓", expRequired: 300, mood: ["😄", "😌", "😠", "🤩"] },
    { name: "Легендарный", sprite: "🦜", expRequired: 600, mood: ["🌟", "✨", "💫", "🎉"] }
];

// Система достижений
const achievements = {
    firstPet: { icon: "🥚", name: "Первый", desc: "Завести питомца", unlocked: false },
    feed10: { icon: "🍖", name: "Повар", desc: "Покормить 10 раз", unlocked: false, progress: 0, target: 10 },
    play50: { icon: "🎮", name: "Игрок", desc: "Сыграть 50 раз", unlocked: false, progress: 0, target: 50 },
    level5: { icon: "⭐", name: "Мастер", desc: "Достичь 5 уровня", unlocked: false, progress: 0, target: 5 },
    rich: { icon: "💰", name: "Богач", desc: "Заработать 5000 токенов", unlocked: false, progress: 0, target: 5000 },
    evolution3: { icon: "🐓", name: "Эволюция", desc: "Достичь 3 стадии", unlocked: false, progress: 0, target: 3 },
    legendary: { icon: "🦜", name: "Легенда", desc: "Легендарная стадия", unlocked: false },
    combo10: { icon: "🔥", name: "Комбо", desc: "10 действий подряд", unlocked: false, progress: 0, target: 10 },
    week: { icon: "📅", name: "Неделя", desc: "Питомцу 7 дней", unlocked: false, progress: 0, target: 7 },
    healthy: { icon: "💚", name: "Здоровяк", desc: "100% здоровье 24 часа", unlocked: false }
};

// Инициализация достижений
function initAchievements() {
    const grid = document.getElementById('achievementsGrid');
    grid.innerHTML = '';
    
    Object.keys(achievements).forEach(key => {
        const achievement = achievements[key];
        const div = document.createElement('div');
        div.className = achievement.unlocked ? 'achievement' : 'achievement locked';
        div.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
        `;
        div.title = achievement.desc + (achievement.progress !== undefined ? 
            ` (${achievement.progress}/${achievement.target})` : '');
        grid.appendChild(div);
    });
}

// Проверка достижений
function checkAchievements() {
    let newAchievements = 0;
    
    // Первый питомец
    if (gameState.stage > 0 && !achievements.firstPet.unlocked) {
        unlockAchievement('firstPet');
        newAchievements++;
    }
    
    // Уровень 5
    if (gameState.level >= 5 && !achievements.level5.unlocked) {
        achievements.level5.progress = gameState.level;
        if (gameState.level >= achievements.level5.target) {
            unlockAchievement('level5');
            newAchievements++;
        }
    }
    
    // Богач
    if (gameState.earnedTokens >= 5000 && !achievements.rich.unlocked) {
        achievements.rich.progress = gameState.earnedTokens;
        if (gameState.earnedTokens >= achievements.rich.target) {
            unlockAchievement('rich');
            newAchievements++;
        }
    }
    
    // Эволюция 3
    if (gameState.stage >= 3 && !achievements.evolution3.unlocked) {
        achievements.evolution3.progress = gameState.stage;
        if (gameState.stage >= achievements.evolution3.target) {
            unlockAchievement('evolution3');
            newAchievements++;
        }
    }
    
    // Легенда
    if (gameState.stage >= 4 && !achievements.legendary.unlocked) {
        unlockAchievement('legendary');
        newAchievements++;
    }
    
    // Комбо
    if (gameState.actionStreak >= 10 && !achievements.combo10.unlocked) {
        achievements.combo10.progress = gameState.actionStreak;
        if (gameState.actionStreak >= achievements.combo10.target) {
            unlockAchievement('combo10');
            newAchievements++;
        }
    }
    
    // Неделя
    if (gameState.age >= 7 && !achievements.week.unlocked) {
        achievements.week.progress = gameState.age;
        if (gameState.age >= achievements.week.target) {
            unlockAchievement('week');
            newAchievements++;
        }
    }
    
    if (newAchievements > 0) {
        initAchievements();
    }
}

// Разблокировка достижения
function unlockAchievement(key) {
    achievements[key].unlocked = true;
    showNotification(`🎉 Достижение разблокировано: ${achievements[key].name}!`);
    
    // Награда за достижение
    const reward = 100;
    gameState.tokens += reward;
    gameState.earnedTokens += reward;
    showNotification(`🎁 Награда: +${reward} токенов!`);
    
    playSound('achievement');
}

// Обновление настроения питомца
function updateMood() {
    const avgStats = (gameState.health + gameState.hunger + gameState.happiness + gameState.energy) / 4;
    let mood;
    
    if (avgStats > 80) mood = stages[gameState.stage].mood[0]; // Счастливый
    else if (avgStats > 60) mood = stages[gameState.stage].mood[1]; // Нормальный
    else if (avgStats > 40) mood = stages[gameState.stage].mood[2]; // Грустный
    else mood = stages[gameState.stage].mood[3] || stages[gameState.stage].mood[2]; // Очень грустный
    
    document.getElementById('moodIndicator').textContent = mood;
}

// Система комбо
function updateCombo() {
    const now = Date.now();
    const timeSinceLastAction = now - gameState.lastActionTime;
    
    // Комбо сбрасывается через 30 секунд
    if (timeSinceLastAction > 30000) {
        gameState.actionStreak = 0;
        gameState.comboMultiplier = 1;
        document.getElementById('comboCounter').classList.remove('show');
    } else {
        gameState.actionStreak++;
        gameState.comboMultiplier = 1 + (gameState.actionStreak * 0.1); // +10% за каждое действие
        
        const comboEl = document.getElementById('comboCounter');
        comboEl.textContent = `🔥 COMBO x${gameState.actionStreak}`;
        comboEl.classList.add('show');
        
        if (gameState.actionStreak >= 10) {
            achievements.combo10.progress = gameState.actionStreak;
        }
    }
    
    gameState.lastActionTime = now;
}

// Создание частиц
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() + 's';
            container.appendChild(particle);
            
            setTimeout(() => particle.remove(), 3000);
        }, i * 100);
    }
}

// Подключение кошелька
async function connectWallet() {
    try {
        if (!window.solana || !window.solana.isPhantom) {
            showNotification("❌ Установите Phantom кошелек!");
            window.open('https://phantom.app/', '_blank');
            return;
        }

        const response = await window.solana.connect();
        const publicKey = response.publicKey.toString();
        
        gameState.walletConnected = true;
        document.getElementById('connectWallet').style.display = 'none';
        document.getElementById('walletInfo').style.display = 'block';
        document.getElementById('walletInfo').innerHTML = `
            ✅ ${publicKey.slice(0, 4)}...${publicKey.slice(-4)}
        `;
        
        showNotification("✅ Кошелек подключен!");
        playSound('connect');
        saveGame();
    } catch (err) {
        showNotification("❌ Ошибка подключения кошелька");
        console.error(err);
    }
}

// Начало игры
function startGame() {
    if (gameState.tokens < 10) {
        showNotification("❌ Недостаточно токенов!");
        return;
    }
    
    gameState.tokens -= 10;
    gameState.stage = 1;
    gameState.totalActions++;
    
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    
    initAchievements();
    updateDisplay();
    startGameLoop();
    showNotification("🎉 Питомец родился! Заботься о нем!");
    checkAchievements();
    createParticles();
    playSound('birth');
    saveGame();
}

// Действия с питомцем
function feedPet() {
    if (gameState.tokens < 5) {
        showNotification("❌ Недостаточно токенов!");
        return;
    }
    
    gameState.tokens -= 5;
    gameState.hunger = Math.min(100, gameState.hunger + 30);
    gameState.health = Math.min(100, gameState.health + 5);
    gameState.experience += 5;
    gameState.totalActions++;
    
    // Достижение: Повар
    if (!achievements.feed10.unlocked) {
        achievements.feed10.progress = (achievements.feed10.progress || 0) + 1;
        if (achievements.feed10.progress >= achievements.feed10.target) {
            unlockAchievement('feed10');
        }
    }
    
    updateCombo();
    showEmotion("🍖");
    showNotification("😋 Питомец покормлен!");
    earnReward(2);
    updateDisplay();
    checkEvolution();
    checkAchievements();
    createParticles();
    playSound('feed');
    saveGame();
}

function playWithPet() {
    if (gameState.tokens < 3) {
        showNotification("❌ Недостаточно токенов!");
        return;
    }
    
    if (gameState.energy < 20) {
        showNotification("😴 Питомец устал! Дайте ему отдохнуть.");
        return;
    }
    
    gameState.tokens -= 3;
    gameState.happiness = Math.min(100, gameState.happiness + 25);
    gameState.energy = Math.max(0, gameState.energy - 15);
    gameState.experience += 8;
    gameState.totalActions++;
    
    // Достижение: Игрок
    if (!achievements.play50.unlocked) {
        achievements.play50.progress = (achievements.play50.progress || 0) + 1;
        if (achievements.play50.progress >= achievements.play50.target) {
            unlockAchievement('play50');
        }
    }
    
    updateCombo();
    showEmotion("🎮");
    showNotification("🎉 Питомец играет и радуется!");
    earnReward(3);
    updateDisplay();
    checkEvolution();
    checkAchievements();
    createParticles();
    playSound('play');
    saveGame();
}

function healPet() {
    if (gameState.tokens < 8) {
        showNotification("❌ Недостаточно токенов!");
        return;
    }
    
    if (gameState.health >= 90) {
        showNotification("💚 Питомец здоров!");
        return;
    }
    
    gameState.tokens -= 8;
    gameState.health = 100;
    gameState.experience += 3;
    gameState.totalActions++;
    
    updateCombo();
    showEmotion("💊");
    showNotification("💚 Питомец вылечен!");
    earnReward(1);
    updateDisplay();
    checkAchievements();
    playSound('heal');
    saveGame();
}

function restPet() {
    if (gameState.tokens < 2) {
        showNotification("❌ Недостаточно токенов!");
        return;
    }
    
    gameState.tokens -= 2;
    gameState.energy = Math.min(100, gameState.energy + 40);
    gameState.health = Math.min(100, gameState.health + 10);
    gameState.experience += 3;
    gameState.totalActions++;
    
    updateCombo();
    showEmotion("😴");
    showNotification("💤 Питомец отдыхает...");
    earnReward(2);
    updateDisplay();
    checkAchievements();
    playSound('rest');
    saveGame();
}

// Клик по питомцу
function petClick() {
    const sprite = document.getElementById('petSprite');
    sprite.style.animation = 'none';
    setTimeout(() => {
        sprite.style.animation = 'float 3s ease-in-out infinite';
    }, 10);
    
    showEmotion("❤️");
    gameState.happiness = Math.min(100, gameState.happiness + 2);
    gameState.experience += 1;
    createParticles();
    updateDisplay();
    playSound('click');
}

// Награда токенами
function earnReward(amount) {
    const bonus = Math.floor((Math.random() * amount + amount) * gameState.comboMultiplier);
    gameState.tokens += bonus;
    gameState.earnedTokens += bonus;
    
    if (gameState.comboMultiplier > 1) {
        showNotification(`🎁 +${bonus} токенов! (Комбо бонус x${gameState.comboMultiplier.toFixed(1)})`);
    } else {
        showNotification(`🎁 +${bonus} токенов!`);
    }
    
    // Проверка достижения богача
    if (gameState.earnedTokens >= 5000) {
        achievements.rich.progress = gameState.earnedTokens;
        checkAchievements();
    }
}

// Проверка эволюции
function checkEvolution() {
    const currentStage = gameState.stage;
    
    for (let i = stages.length - 1; i >= 0; i--) {
        if (gameState.experience >= stages[i].expRequired && i > currentStage) {
            gameState.stage = i;
            gameState.level++;
            
            showNotification(`🎉 ЭВОЛЮЦИЯ! Теперь: ${stages[i].name}!`);
            
            const notice = document.getElementById('evolutionNotice');
            notice.innerHTML = `<div class="evolution-notice">🌟 Эволюция! ${stages[i].name} 🌟</div>`;
            
            setTimeout(() => {
                notice.innerHTML = '';
            }, 5000);
            
            // Бонус за эволюцию
            const bonus = 50 * gameState.level;
            gameState.tokens += bonus;
            showNotification(`🎁 Бонус за эволюцию: ${bonus} токенов!`);
            
            createParticles();
            playSound('evolution');
            checkAchievements();
            
            break;
        }
    }
}

// Обновление статов со временем
function updateStatsOverTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    
    if (minutes > 0) {
        gameState.hunger = Math.max(0, gameState.hunger - minutes * 0.5);
        gameState.happiness = Math.max(0, gameState.happiness - minutes * 0.3);
        gameState.energy = Math.max(0, gameState.energy - minutes * 0.2);
        
        if (gameState.hunger < 30 || gameState.happiness < 30) {
            gameState.health = Math.max(0, gameState.health - minutes * 0.4);
        }
    }
}

// Игровой цикл
function startGameLoop() {
    setInterval(() => {
        gameState.hunger = Math.max(0, gameState.hunger - 0.1);
        gameState.happiness = Math.max(0, gameState.happiness - 0.05);
        gameState.energy = Math.max(0, gameState.energy - 0.03);
        
        if (gameState.hunger < 30 || gameState.happiness < 30) {
            gameState.health = Math.max(0, gameState.health - 0.08);
        }
        
        updateDisplay();
        
        // Предупреждения
        if (gameState.hunger < 20 && Math.random() < 0.1) {
            showNotification("🍖 Питомец голоден!");
        }
        if (gameState.happiness < 20 && Math.random() < 0.1) {
            showNotification("😢 Питомцу скучно!");
        }
        if (gameState.health < 30 && Math.random() < 0.1) {
            showNotification("💔 Питомец нездоров!");
        }
        
        saveGame();
    }, 3000);
    
    // Увеличение возраста
    setInterval(() => {
        gameState.age++;
        updateDisplay();
        
        if (gameState.age >= 7) {
            achievements.week.progress = gameState.age;
            checkAchievements();
        }
        
        saveGame();
    }, 60000); // Каждую минуту = 1 день
}

// Обновление отображения
function updateDisplay() {
    const stage = stages[gameState.stage];
    
    document.getElementById('petSprite').textContent = stage.sprite;
    document.getElementById('petName').textContent = gameState.petName;
    document.getElementById('petLevel').textContent = `Уровень ${gameState.level} • ${stage.name}`;
    
    updateStatBar('healthBar', gameState.health);
    updateStatBar('hungerBar', gameState.hunger);
    updateStatBar('happinessBar', gameState.happiness);
    updateStatBar('energyBar', gameState.energy);
    
    document.getElementById('tokenBalance').textContent = Math.floor(gameState.tokens);
    
    const nextStage = stages[gameState.stage + 1];
    const expRequired = nextStage ? nextStage.expRequired : "MAX";
    document.getElementById('experience').textContent = 
        expRequired === "MAX" ? `${gameState.experience} (MAX)` : `${gameState.experience} / ${expRequired}`;
    
    document.getElementById('age').textContent = `${gameState.age} дней`;
    document.getElementById('earnedTokens').textContent = gameState.earnedTokens;
    document.getElementById('actionStreak').textContent = gameState.actionStreak;
    
    updateMood();
}

function updateStatBar(id, value) {
    const bar = document.getElementById(id);
    bar.style.width = value + '%';
    bar.textContent = Math.floor(value) + '%';
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function showEmotion(emoji) {
    const emotion = document.createElement('div');
    emotion.className = 'emotion';
    emotion.textContent = emoji;
    
    const petDisplay = document.getElementById('petDisplay');
    const rect = petDisplay.getBoundingClientRect();
    
    emotion.style.left = (Math.random() * rect.width) + 'px';
    emotion.style.top = '50%';
    
    petDisplay.appendChild(emotion);
    
    setTimeout(() => {
        emotion.remove();
    }, 2000);
}

// Звуковые эффекты (заглушка)
function playSound(type) {
    // В будущем можно добавить реальные звуки
    console.log(`🔊 Sound: ${type}`);
}

// Сохранение игры
function saveGame() {
    gameState.lastUpdate = Date.now();
    
    // Сохраняем достижения
    const saveData = {
        ...gameState,
        achievements: achievements
    };
    
    localStorage.setItem('cryptoTamagotchiEnhanced', JSON.stringify(saveData));
}

// Загрузка игры
function loadGame() {
    const saved = localStorage.getItem('cryptoTamagotchiEnhanced');
    if (saved) {
        const loaded = JSON.parse(saved);
        
        // Восстанавливаем состояние
        Object.keys(gameState).forEach(key => {
            if (loaded[key] !== undefined) {
                gameState[key] = loaded[key];
            }
        });
        
        // Восстанавливаем достижения
        if (loaded.achievements) {
            Object.keys(loaded.achievements).forEach(key => {
                if (achievements[key]) {
                    Object.assign(achievements[key], loaded.achievements[key]);
                }
            });
        }
        
        // Обновить состояние за время отсутствия
        const timePassed = Math.floor((Date.now() - gameState.lastUpdate) / 1000);
        updateStatsOverTime(timePassed);
    }
}

// Инициализация
window.addEventListener('load', () => {
    loadGame();
    
    if (gameState.stage > 0) {
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
        initAchievements();
        updateDisplay();
        startGameLoop();
    }
    
    // Автоподключение Phantom если уже подключен
    if (window.solana && window.solana.isPhantom && window.solana.isConnected) {
        window.solana.connect({ onlyIfTrusted: true })
            .then(async (response) => {
                const publicKey = response.publicKey.toString();
                gameState.walletConnected = true;
                document.getElementById('connectWallet').style.display = 'none';
                document.getElementById('walletInfo').style.display = 'block';
                document.getElementById('walletInfo').innerHTML = `
                    ✅ ${publicKey.slice(0, 4)}...${publicKey.slice(-4)}
                `;
            })
            .catch(() => {});
    }
});

window.addEventListener('beforeunload', () => {
    saveGame();
});













