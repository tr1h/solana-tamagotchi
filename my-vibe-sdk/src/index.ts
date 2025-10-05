/**
 * 🐣 Crypto Tamagotchi API
 * Backend для NFT Tamagotchi игры на Solana
 * Powered by Cloudflare Workers AI
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);

		// 🔧 CORS Headers для всех запросов
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		};

		// ✅ Handle OPTIONS preflight request
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: corsHeaders
			});
		}

		// 🎲 Генерация случайного питомца
		if (url.pathname === '/generate-pet') {
			const species = ['Cat', 'Dog', 'Dragon', 'Phoenix', 'Unicorn', 'Wolf', 'Fox', 'Bear'];
			const colors = ['Red', 'Blue', 'Golden', 'Silver', 'Cosmic', 'Shadow', 'Crystal', 'Flame'];
			const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
			const accessories = ['None', 'Crown', 'Wings', 'Sword', 'Shield', 'Cape', 'Hat', 'Aura'];

			const pet = {
				name: `Pet #${Math.floor(Math.random() * 10000)}`,
				species: species[Math.floor(Math.random() * species.length)],
				color: colors[Math.floor(Math.random() * colors.length)],
				rarity: rarities[Math.floor(Math.random() * rarities.length)],
				accessory: accessories[Math.floor(Math.random() * accessories.length)],
				power: Math.floor(Math.random() * 100) + 1,
				speed: Math.floor(Math.random() * 100) + 1,
				intelligence: Math.floor(Math.random() * 100) + 1,
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

		// 📊 Статистика игры
		if (url.pathname === '/stats') {
			return Response.json({
				totalPets: Math.floor(Math.random() * 10000) + 1000,
				totalPlayers: Math.floor(Math.random() * 5000) + 500,
				avgLevel: Math.floor(Math.random() * 20) + 10,
				mostPopularSpecies: 'Dragon',
				totalTokensBurned: Math.floor(Math.random() * 1000000),
				activeNow: Math.floor(Math.random() * 100) + 50
			}, {
				headers: { 'Access-Control-Allow-Origin': '*' }
			});
		}

		// 🏆 Топ игроков
		if (url.pathname === '/leaderboard') {
			const leaders = [];
			for (let i = 1; i <= 10; i++) {
				leaders.push({
					rank: i,
					wallet: `${crypto.randomUUID().slice(0, 8)}...${crypto.randomUUID().slice(0, 4)}`,
					level: 51 - i,
					score: 10000 - (i * 500),
					petName: `Dragon #${Math.floor(Math.random() * 1000)}`
				});
			}
			return Response.json(leaders, {
				headers: { 'Access-Control-Allow-Origin': '*' }
			});
		}

		// 🎁 Генерация реферальной ссылки
		if (url.pathname === '/referral/create' && request.method === 'POST') {
			try {
				const { wallet } = await request.json();
				const referralCode = btoa(wallet).slice(0, 8);
				
				return Response.json({
					code: referralCode,
					link: `https://crypto-tamagotchi.pages.dev?ref=${referralCode}`,
					bonus: 100
				}, {
					headers: corsHeaders
				});
			} catch (err) {
				return Response.json({ error: 'Invalid request' }, { 
					status: 400,
					headers: corsHeaders 
				});
			}
		}

		// 🤖 AI: Генерация питомца по описанию
		if (url.pathname === '/ai/generate-pet' && request.method === 'POST') {
			try {
				const { description } = await request.json();

				const response = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
					messages: [
						{
							role: 'system',
							content: 'You are a creative fantasy pet designer. Generate unique pet traits in JSON format with: species, color, rarity (Common/Rare/Epic/Legendary), special_ability, personality. Be creative and unique!'
						},
						{
							role: 'user',
							content: `Create a unique fantasy pet based on: ${description || 'random creative idea'}`
						}
					]
				});

				return Response.json({
					ai_response: response,
					description: description,
					timestamp: new Date().toISOString()
				}, {
					headers: corsHeaders
				});
			} catch (err) {
				return Response.json({ 
					error: 'AI generation failed',
					message: err.message 
				}, { 
					status: 500,
					headers: corsHeaders 
				});
			}
		}

		// 💬 AI: Советник по уходу за питомцем
		if (url.pathname === '/ai/advisor' && request.method === 'POST') {
			try {
				const { question, petStats } = await request.json();

				const statsContext = petStats 
					? `Pet stats - Health: ${petStats.health}, Hunger: ${petStats.hunger}, Happiness: ${petStats.happiness}`
					: 'General question';

				const response = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
					messages: [
						{
							role: 'system',
							content: 'You are a helpful Tamagotchi game advisor. Give short, practical advice in 2-3 sentences. Be friendly and encouraging!'
						},
						{
							role: 'user',
							content: `${statsContext}\n\nQuestion: ${question}`
						}
					]
				});

				return Response.json({
					advice: response,
					question: question,
					timestamp: new Date().toISOString()
				}, {
					headers: corsHeaders
				});
			} catch (err) {
				return Response.json({ 
					error: 'AI advisor failed',
					message: err.message 
				}, { 
					status: 500,
					headers: corsHeaders 
				});
			}
		}

		// 🎨 AI: Генерация описания для NFT
		if (url.pathname === '/ai/describe-nft' && request.method === 'POST') {
			try {
				const { species, rarity, level } = await request.json();

				const response = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
					messages: [
						{
							role: 'system',
							content: 'You are a creative NFT description writer. Write engaging 2-3 sentence descriptions for digital pets. Be creative and vivid!'
						},
						{
							role: 'user',
							content: `Write NFT description for: ${rarity} ${species}, Level ${level}`
						}
					]
				});

				return Response.json({
					description: response,
					metadata: { species, rarity, level },
					timestamp: new Date().toISOString()
				}, {
					headers: corsHeaders
				});
			} catch (err) {
				return Response.json({ 
					error: 'NFT description failed',
					message: err.message 
				}, { 
					status: 500,
					headers: corsHeaders 
				});
			}
		}

		// 🏠 Главная страница с UI
		return new Response(`
			<!DOCTYPE html>
			<html>
			<head>
				<title>🐣 Crypto Tamagotchi API</title>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<style>
					* { margin: 0; padding: 0; box-sizing: border-box; }
					body { 
						font-family: 'Segoe UI', system-ui, sans-serif;
						background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
						min-height: 100vh;
						padding: 20px;
					}
					.container { 
						max-width: 900px; 
						margin: 0 auto; 
						background: white;
						border-radius: 20px;
						padding: 40px;
						box-shadow: 0 20px 60px rgba(0,0,0,0.3);
					}
					h1 { 
						color: #667eea; 
						margin-bottom: 10px;
						font-size: 2.5em;
					}
					.subtitle {
						color: #666;
						margin-bottom: 30px;
						font-size: 1.1em;
					}
					.endpoint { 
						background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
						padding: 20px; 
						margin: 15px 0; 
						border-radius: 12px;
						border-left: 4px solid #667eea;
						transition: transform 0.2s;
					}
					.endpoint:hover {
						transform: translateX(5px);
					}
					.endpoint h3 { 
						color: #333; 
						margin-bottom: 8px;
					}
					.endpoint p {
						color: #666;
						margin-bottom: 12px;
					}
					button { 
						background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
						color: white; 
						border: none; 
						padding: 12px 24px; 
						border-radius: 8px;
						cursor: pointer; 
						font-size: 16px;
						font-weight: 600;
						transition: all 0.3s;
					}
					button:hover { 
						transform: translateY(-2px);
						box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
					}
					button:active {
						transform: translateY(0);
					}
					.result-box {
						margin-top: 30px;
					}
					.result-box h3 {
						color: #333;
						margin-bottom: 15px;
					}
					pre { 
						background: #2d3748;
						color: #68d391;
						padding: 20px;
						border-radius: 8px;
						overflow-x: auto;
						font-size: 14px;
						line-height: 1.6;
						box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);
					}
					.loading {
						color: #667eea;
						font-weight: 600;
					}
					.badge {
						display: inline-block;
						background: #667eea;
						color: white;
						padding: 4px 12px;
						border-radius: 12px;
						font-size: 12px;
						font-weight: 600;
						margin-left: 10px;
					}
					.footer {
						text-align: center;
						margin-top: 40px;
						padding-top: 20px;
						border-top: 2px solid #e2e8f0;
						color: #666;
					}
				</style>
			</head>
			<body>
				<div class="container">
					<h1>🐣 Crypto Tamagotchi API</h1>
					<p class="subtitle">Backend API для NFT игры на Cloudflare Workers</p>

					<div class="endpoint">
						<h3>🎲 /generate-pet <span class="badge">GET</span></h3>
						<p>Генерирует случайного уникального питомца с traits, rarity и stats</p>
						<button onclick="testEndpoint('/generate-pet')">🎲 Сгенерировать питомца</button>
					</div>

					<div class="endpoint">
						<h3>📊 /stats <span class="badge">GET</span></h3>
						<p>Общая статистика игры: игроки, питомцы, активность</p>
						<button onclick="testEndpoint('/stats')">📊 Показать статистику</button>
					</div>

					<div class="endpoint">
						<h3>🏆 /leaderboard <span class="badge">GET</span></h3>
						<p>Топ-10 игроков по уровню и score</p>
						<button onclick="testEndpoint('/leaderboard')">🏆 Показать лидеров</button>
					</div>

					<div class="endpoint">
						<h3>🎁 /referral/create <span class="badge">POST</span></h3>
						<p>Создать реферальную ссылку для приглашения друзей</p>
						<button onclick="testReferral()">🎁 Создать ссылку</button>
					</div>

					<div class="result-box">
						<h3>📋 Результат:</h3>
						<pre id="result">Нажми на кнопку выше чтобы протестировать API...</pre>
					</div>

					<div class="footer">
						<p>💜 Powered by <strong>Cloudflare Workers</strong></p>
						<p style="margin-top: 10px; font-size: 14px;">Deploy: <code>npm run deploy</code></p>
					</div>
				</div>

				<script>
					async function testEndpoint(path) {
						const result = document.getElementById('result');
						result.textContent = '⏳ Загрузка...';
						result.className = 'loading';
						
						try {
							const response = await fetch(path);
							const data = await response.json();
							result.textContent = JSON.stringify(data, null, 2);
							result.className = '';
						} catch (err) {
							result.textContent = '❌ Ошибка: ' + err.message;
						}
					}

					async function testReferral() {
						const result = document.getElementById('result');
						result.textContent = '⏳ Создаю реферальную ссылку...';
						
						try {
							const response = await fetch('/referral/create', {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ 
									wallet: '49kwEKNBnfqYt4GYpYkcCHyDiQDxS24jRuckLjptryvu' 
								})
							});
							const data = await response.json();
							result.textContent = JSON.stringify(data, null, 2);
						} catch (err) {
							result.textContent = '❌ Ошибка: ' + err.message;
						}
					}

					// Auto-test при загрузке
					window.addEventListener('load', () => {
						console.log('🚀 Tamagotchi API готов!');
						console.log('📝 Endpoints:');
						console.log('  GET  /generate-pet');
						console.log('  GET  /stats');
						console.log('  GET  /leaderboard');
						console.log('  POST /referral/create');
					});
				</script>
			</body>
			</html>
		`, {
			headers: { 'Content-Type': 'text/html; charset=utf-8' }
		});
	},
} satisfies ExportedHandler<Env>;
