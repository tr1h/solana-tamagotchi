# 🎮 Как использовать Workers для Tamagotchi

## 1️⃣ API для генерации уникальных питомцев

### Что делает:
Создаёт случайные traits для NFT питомцев

### Код (добавь в `src/index.ts`):
```typescript
export default {
  async fetch(request: Request) {
    const url = new URL(request.url);
    
    // Endpoint для генерации питомца
    if (url.pathname === '/generate-pet') {
      const species = ['cat', 'dog', 'dragon', 'phoenix', 'unicorn'];
      const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
      const colors = ['red', 'blue', 'golden', 'silver', 'cosmic'];
      
      const pet = {
        species: species[Math.floor(Math.random() * species.length)],
        rarity: rarities[Math.floor(Math.random() * rarities.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        dna: crypto.randomUUID(),
        power: Math.floor(Math.random() * 100) + 1
      };
      
      return Response.json(pet);
    }
    
    return new Response('Hello!');
  }
}
```

### Использование:
```javascript
// В основной игре
const response = await fetch('http://localhost:8787/generate-pet');
const pet = await response.json();
console.log(pet);
// { species: 'dragon', rarity: 'legendary', color: 'golden', ... }
```

---

## 2️⃣ Leaderboard API

### Что делает:
Хранит топ игроков (используя KV storage)

### Код:
```typescript
export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    
    // Получить топ игроков
    if (url.pathname === '/leaderboard') {
      // Здесь будет логика с KV storage
      const topPlayers = [
        { wallet: '0x123...', score: 9999, petLevel: 50 },
        { wallet: '0x456...', score: 8888, petLevel: 45 },
        { wallet: '0x789...', score: 7777, petLevel: 40 }
      ];
      
      return Response.json(topPlayers);
    }
    
    // Добавить нового игрока
    if (url.pathname === '/leaderboard/add' && request.method === 'POST') {
      const data = await request.json();
      // Сохранить в KV
      // await env.LEADERBOARD.put(data.wallet, JSON.stringify(data));
      
      return Response.json({ success: true });
    }
    
    return new Response('Leaderboard API');
  }
}
```

---

## 3️⃣ Referral System

### Что делает:
Трекает рефералов и награды

### Код:
```typescript
export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    
    // Создать реферальную ссылку
    if (url.pathname === '/referral/create') {
      const { wallet } = await request.json();
      const referralCode = btoa(wallet).slice(0, 8);
      
      return Response.json({
        code: referralCode,
        link: `https://crypto-tamagotchi.pages.dev?ref=${referralCode}`
      });
    }
    
    // Проверить реферала
    if (url.pathname.startsWith('/referral/check/')) {
      const code = url.pathname.split('/')[3];
      // Проверить в базе
      const referrer = 'декодировать код обратно в wallet';
      
      return Response.json({
        referrer: referrer,
        bonus: 100 // TAMA токенов
      });
    }
    
    return new Response('Referral API');
  }
}
```

---

## 🎯 Простой старт - Добавь это СЕЙЧАС:

### Файл: `my-vibe-sdk/src/index.ts`

```typescript
export default {
	async fetch(request): Promise<Response> {
		const url = new URL(request.url);

		// 🎲 Генерация случайного питомца
		if (url.pathname === '/generate-pet') {
			const species = ['Cat', 'Dog', 'Dragon', 'Phoenix', 'Unicorn'];
			const colors = ['Red', 'Blue', 'Golden', 'Silver', 'Cosmic'];
			const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

			const pet = {
				name: `Pet #${Math.floor(Math.random() * 10000)}`,
				species: species[Math.floor(Math.random() * species.length)],
				color: colors[Math.floor(Math.random() * colors.length)],
				rarity: rarities[Math.floor(Math.random() * rarities.length)],
				power: Math.floor(Math.random() * 100) + 1,
				dna: crypto.randomUUID(),
				timestamp: new Date().toISOString()
			};

			return Response.json(pet, {
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Content-Type': 'application/json'
				}
			});
		}

		// 📊 Статистика (mock data)
		if (url.pathname === '/stats') {
			return Response.json({
				totalPets: 1234,
				totalPlayers: 567,
				avgLevel: 15,
				mostPopularSpecies: 'Dragon'
			}, {
				headers: { 'Access-Control-Allow-Origin': '*' }
			});
		}

		// 🏆 Топ игроков (mock data)
		if (url.pathname === '/leaderboard') {
			return Response.json([
				{ rank: 1, wallet: '0x123...abc', level: 50, score: 9999 },
				{ rank: 2, wallet: '0x456...def', level: 45, score: 8888 },
				{ rank: 3, wallet: '0x789...ghi', level: 40, score: 7777 }
			], {
				headers: { 'Access-Control-Allow-Origin': '*' }
			});
		}

		// 🏠 Главная страница
		return new Response(`
			<!DOCTYPE html>
			<html>
			<head>
				<title>Tamagotchi API</title>
				<style>
					body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; }
					h1 { color: #f38020; }
					.endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 8px; }
					button { background: #f38020; color: white; border: none; padding: 10px 20px; 
					         border-radius: 5px; cursor: pointer; margin: 5px; }
					button:hover { background: #e06010; }
					pre { background: #2d2d2d; color: #f8f8f8; padding: 15px; border-radius: 5px; overflow-x: auto; }
				</style>
			</head>
			<body>
				<h1>🐣 Crypto Tamagotchi API</h1>
				<p>Backend API для игры на Cloudflare Workers</p>

				<div class="endpoint">
					<h3>🎲 /generate-pet</h3>
					<p>Генерирует случайного уникального питомца с traits</p>
					<button onclick="testEndpoint('/generate-pet')">Попробовать</button>
				</div>

				<div class="endpoint">
					<h3>📊 /stats</h3>
					<p>Общая статистика игры</p>
					<button onclick="testEndpoint('/stats')">Попробовать</button>
				</div>

				<div class="endpoint">
					<h3>🏆 /leaderboard</h3>
					<p>Топ игроков по уровню</p>
					<button onclick="testEndpoint('/leaderboard')">Попробовать</button>
				</div>

				<h3>Результат:</h3>
				<pre id="result">Нажми на кнопку выше...</pre>

				<script>
					async function testEndpoint(path) {
						const result = document.getElementById('result');
						result.textContent = 'Загрузка...';
						
						try {
							const response = await fetch(path);
							const data = await response.json();
							result.textContent = JSON.stringify(data, null, 2);
						} catch (err) {
							result.textContent = 'Ошибка: ' + err.message;
						}
					}
				</script>
			</body>
			</html>
		`, {
			headers: { 'Content-Type': 'text/html' }
		});
	},
} satisfies ExportedHandler;
```

---

## 🚀 Как протестировать:

1. **Сохрани** код выше в `my-vibe-sdk/src/index.ts`
2. **Обнови** страницу: http://localhost:8787
3. **Нажми** кнопки "Попробовать"
4. **Увидишь** JSON с данными!

---

## 🔗 Интеграция с основной игрой:

В твоём `tamagotchi_devnet_v2_improved.html`:

```javascript
// Получить случайного питомца
async function getRandomPetTraits() {
  const response = await fetch('http://localhost:8787/generate-pet');
  const pet = await response.json();
  
  console.log('Сгенерирован питомец:', pet);
  // { species: 'Dragon', rarity: 'Epic', color: 'Golden', ... }
  
  return pet;
}

// Показать leaderboard
async function showLeaderboard() {
  const response = await fetch('http://localhost:8787/leaderboard');
  const leaders = await response.json();
  
  leaders.forEach(player => {
    console.log(`${player.rank}. ${player.wallet} - Level ${player.level}`);
  });
}
```

---

## 💡 Что дальше:

### Уровень 1: Базовый API ✅
- Генерация питомцев
- Статистика
- Leaderboard

### Уровень 2: С базой данных
- **KV Storage** для хранения данных
- **Durable Objects** для real-time игр
- **R2** для хранения изображений NFT

### Уровень 3: С AI
- **Workers AI** для генерации traits
- Описание питомца → AI создаёт характеристики
- Чат-бот для помощи игрокам

---

## 🎯 Быстрый deploy:

```bash
cd my-vibe-sdk
npm run deploy
```

Получишь:
```
https://my-vibe-sdk.ТВОЙ-SUBDOMAIN.workers.dev
```

И можно использовать в production!

---

**Попробуй код выше прямо сейчас!** 🚀


