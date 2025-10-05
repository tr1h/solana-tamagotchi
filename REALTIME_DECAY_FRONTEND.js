// ============================================================================
// 🎨 РЕАЛЬНОЕ ВРЕМЯ DECAY (ТОЛЬКО НА ФРОНТЕНДЕ!)
// ============================================================================

// Данные питомца из blockchain
let petData = {
    hunger: 100,
    happiness: 100,
    energy: 100,
    health: 100,
    last_decay_time: Date.now() / 1000, // unix timestamp
    is_alive: true
};

// ============================================================================
// ВИРТУАЛЬНЫЙ DECAY - РАССЧИТЫВАЕТСЯ НА ФРОНТЕНДЕ
// ============================================================================

function calculateVirtualStats(pet) {
    const now = Date.now() / 1000; // текущее время в секундах
    const timePassed = now - pet.last_decay_time;
    
    // Если прошло меньше минуты - ничего не меняем
    if (timePassed < 60) {
        return {
            hunger: pet.hunger,
            happiness: pet.happiness,
            energy: pet.energy,
            health: pet.health,
            is_alive: pet.is_alive
        };
    }
    
    // Считаем decay
    const decay_cycles = Math.floor(timePassed / 60);
    
    let virtualHunger = Math.max(0, pet.hunger - decay_cycles);
    let virtualHappiness = Math.max(0, pet.happiness - Math.floor(decay_cycles / 2));
    let virtualEnergy = Math.max(0, pet.energy - Math.floor(decay_cycles / 3));
    let virtualHealth = pet.health;
    
    // Если голод или счастье критично - здоровье падает
    if (virtualHunger < 30 || virtualHappiness < 30) {
        virtualHealth = Math.max(0, virtualHealth - Math.floor(decay_cycles / 2));
    }
    
    // Проверка на смерть
    const virtualAlive = virtualHealth > 0;
    
    return {
        hunger: virtualHunger,
        happiness: virtualHappiness,
        energy: virtualEnergy,
        health: virtualHealth,
        is_alive: virtualAlive
    };
}

// ============================================================================
// ОБНОВЛЕНИЕ UI В РЕАЛЬНОМ ВРЕМЕНИ
// ============================================================================

function updateRealtimeUI() {
    // Получаем виртуальные статы (без blockchain!)
    const virtualStats = calculateVirtualStats(petData);
    
    // Обновляем UI
    updateStatBar('hungerBar', virtualStats.hunger);
    updateStatBar('happinessBar', virtualStats.happiness);
    updateStatBar('energyBar', virtualStats.energy);
    updateStatBar('healthBar', virtualStats.health);
    
    // Показываем предупреждения
    if (virtualStats.hunger < 30) {
        showWarning('⚠️ Питомец голоден!');
    }
    if (virtualStats.happiness < 30) {
        showWarning('⚠️ Питомец грустный!');
    }
    if (virtualStats.health < 50) {
        showWarning('💔 Здоровье низкое!');
    }
    if (!virtualStats.is_alive) {
        showWarning('💀 ПИТОМЕЦ МЁРТВ!');
    }
    
    // Показываем таймер до следующего decay
    const timeSinceLastDecay = (Date.now() / 1000) - petData.last_decay_time;
    const secondsToNextDecay = 60 - (timeSinceLastDecay % 60);
    document.getElementById('nextDecayTimer').textContent = 
        `Следующий decay через ${Math.floor(secondsToNextDecay)}с`;
}

// Обновляем каждую секунду!
setInterval(updateRealtimeUI, 1000);

// ============================================================================
// КОГДА ДЕЛАЕМ ДЕЙСТВИЕ - ОБНОВЛЯЕМ ДАННЫЕ ИЗ BLOCKCHAIN
// ============================================================================

async function feedPet() {
    // 1. Отправляем транзакцию
    const signature = await sendFeedTransaction();
    
    // 2. Получаем обновлённые данные из blockchain
    const accountInfo = await connection.getAccountInfo(petPubkey);
    petData = deserializePet(accountInfo.data);
    
    // 3. UI обновится автоматически через setInterval!
}

// ============================================================================
// ПРОГНОЗ СМЕРТИ
// ============================================================================

function predictDeath(pet) {
    let virtualPet = { ...pet };
    let minutes = 0;
    
    // Симулируем decay до смерти
    while (virtualPet.health > 0 && minutes < 10000) {
        minutes++;
        
        virtualPet.hunger = Math.max(0, virtualPet.hunger - 1);
        virtualPet.happiness = Math.max(0, virtualPet.happiness - 0.5);
        virtualPet.energy = Math.max(0, virtualPet.energy - 0.33);
        
        if (virtualPet.hunger < 30 || virtualPet.happiness < 30) {
            virtualPet.health = Math.max(0, virtualPet.health - 0.5);
        }
    }
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    return `💀 Питомец умрёт через ~${hours}ч ${mins}м если не ухаживать`;
}

// ============================================================================
// РЕКОМЕНДАЦИИ В РЕАЛЬНОМ ВРЕМЕНИ
// ============================================================================

function getRecommendations(virtualStats) {
    const recommendations = [];
    
    if (virtualStats.hunger < 70) {
        recommendations.push({
            action: '🍖 Кормить',
            urgency: virtualStats.hunger < 30 ? 'critical' : 'medium',
            cost: '5 TAMA'
        });
    }
    
    if (virtualStats.happiness < 70) {
        recommendations.push({
            action: '🎮 Играть',
            urgency: virtualStats.happiness < 30 ? 'critical' : 'medium',
            cost: '3 TAMA'
        });
    }
    
    if (virtualStats.energy < 60) {
        recommendations.push({
            action: '😴 Отдохнуть',
            urgency: virtualStats.energy < 30 ? 'high' : 'low',
            cost: '2 TAMA'
        });
    }
    
    if (virtualStats.health < 50) {
        recommendations.push({
            action: '💊 Лечить',
            urgency: 'critical',
            cost: '8 TAMA'
        });
    }
    
    return recommendations;
}

// ============================================================================
// УВЕДОМЛЕНИЯ БРАУЗЕРА
// ============================================================================

async function setupBrowserNotifications() {
    // Запросить разрешение
    if (Notification.permission === 'default') {
        await Notification.requestPermission();
    }
    
    // Проверять каждую минуту
    setInterval(() => {
        const virtualStats = calculateVirtualStats(petData);
        
        if (virtualStats.hunger < 30 && Notification.permission === 'granted') {
            new Notification('🍖 Tamagotchi голоден!', {
                body: `Hunger: ${virtualStats.hunger}. Покорми своего питомца!`,
                icon: '🐣'
            });
        }
        
        if (virtualStats.health < 30 && Notification.permission === 'granted') {
            new Notification('💔 Tamagotchi при смерти!', {
                body: `Health: ${virtualStats.health}. СРОЧНО позаботься о нём!`,
                icon: '💀'
            });
        }
    }, 60000); // каждую минуту
}

// ============================================================================
// ГРАФИК СТАТОВ
// ============================================================================

function drawStatsChart(pet) {
    const canvas = document.getElementById('statsChart');
    const ctx = canvas.getContext('2d');
    
    // Рисуем прогноз на следующий час
    const predictions = [];
    let virtualPet = { ...pet };
    
    for (let minute = 0; minute <= 60; minute++) {
        predictions.push({
            minute,
            hunger: virtualPet.hunger,
            happiness: virtualPet.happiness,
            energy: virtualPet.energy,
            health: virtualPet.health
        });
        
        // Применяем decay
        virtualPet.hunger = Math.max(0, virtualPet.hunger - 1);
        virtualPet.happiness = Math.max(0, virtualPet.happiness - 0.5);
        virtualPet.energy = Math.max(0, virtualPet.energy - 0.33);
        
        if (virtualPet.hunger < 30 || virtualPet.happiness < 30) {
            virtualPet.health = Math.max(0, virtualPet.health - 0.5);
        }
    }
    
    // Рисуем графики
    // ... (код для рисования)
}

// ============================================================================
// ЭКСПОРТ
// ============================================================================

export {
    calculateVirtualStats,
    updateRealtimeUI,
    predictDeath,
    getRecommendations,
    setupBrowserNotifications,
    drawStatsChart
};


