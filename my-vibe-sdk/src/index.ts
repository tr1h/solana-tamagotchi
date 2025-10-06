/**
 * 🐣 Crypto Tamagotchi API
 * Backend для NFT Tamagotchi игры на Solana
 * Powered by Cloudflare Workers AI + KV Database
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);

		// 🔧 CORS Headers для всех запросов
        const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            // 🔒 Basic CSP for beta (tighten for prod)
            'Content-Security-Policy': "default-src 'self' *; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline' https:; connect-src *;"
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
				headers: corsHeaders
			});
		}

		// 📊 Статистика игры (с KV)
		if (url.pathname === '/stats') {
			try {
				const stats = await env.STATS.get('global', 'json') || {
					totalPets: 0,
					totalPlayers: 0,
					totalActions: 0,
					totalTokensBurned: 0,
					mostPopularSpecies: 'Dragon',
					activeNow: 0
				};

				return Response.json(stats, {
					headers: corsHeaders
				});
			} catch (err) {
				// Fallback to fake data
				return Response.json({
					totalPets: Math.floor(Math.random() * 10000) + 1000,
					totalPlayers: Math.floor(Math.random() * 5000) + 500,
					avgLevel: Math.floor(Math.random() * 20) + 10,
					mostPopularSpecies: 'Dragon',
					totalTokensBurned: Math.floor(Math.random() * 1000000),
					activeNow: Math.floor(Math.random() * 100) + 50
				}, {
					headers: corsHeaders
				});
			}
		}

		// 🏆 Топ игроков (с KV)
		if (url.pathname === '/leaderboard') {
			try {
				const list = await env.LEADERBOARD.list({ limit: 100 });
				const players = await Promise.all(
					list.keys.map(async (key) => {
						const data = await env.LEADERBOARD.get(key.name, 'json');
						return data;
					})
				);

				// Сортируем по score
				const sorted = players
					.filter(p => p)
					.sort((a, b) => b.score - a.score)
					.slice(0, 100)
					.map((p, i) => ({
						...p,
						rank: i + 1
					}));

				return Response.json(sorted, {
					headers: corsHeaders
				});
			} catch (err) {
				// Fallback to fake data
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
					headers: corsHeaders
				});
			}
		}

		// 📝 Обновить leaderboard
		if (url.pathname === '/leaderboard/update' && request.method === 'POST') {
			try {
				const { wallet, level, experience, petName } = await request.json();
				
				const score = (level * 1000) + experience;
				
				await env.LEADERBOARD.put(wallet, JSON.stringify({
					wallet,
					level,
					experience,
					score,
					petName: petName || `Pet #${Math.floor(Math.random() * 10000)}`,
					lastUpdated: Date.now()
				}));

				// Обновляем глобальную статистику
				const stats = await env.STATS.get('global', 'json') || {
					totalPets: 0,
					totalPlayers: 0
				};
				
				// Считаем уникальных игроков
				const list = await env.LEADERBOARD.list();
				stats.totalPlayers = list.keys.length;
				stats.totalPets = list.keys.length; // Временно 1 питомец = 1 игрок
				
				await env.STATS.put('global', JSON.stringify(stats));

				return Response.json({ 
					success: true, 
					rank: 'TBD' // Можно вычислить реальный ранк
				}, {
					headers: corsHeaders
				});
			} catch (err) {
				return Response.json({ 
					error: 'Failed to update leaderboard',
					message: err.message 
				}, { 
					status: 500,
					headers: corsHeaders 
				});
			}
		}

		// 📜 История действий - добавить
		if (url.pathname === '/history/add' && request.method === 'POST') {
			try {
				const { wallet, action, details } = await request.json();
				const timestamp = Date.now();
				
				await env.HISTORY.put(
					`${wallet}:${timestamp}`,
					JSON.stringify({
						action,
						timestamp,
						...details
					})
				);

				// Обновляем статистику
				const stats = await env.STATS.get('global', 'json') || { totalActions: 0 };
				stats.totalActions = (stats.totalActions || 0) + 1;
				await env.STATS.put('global', JSON.stringify(stats));

				return Response.json({ success: true }, {
					headers: corsHeaders
				});
			} catch (err) {
				return Response.json({ 
					error: 'Failed to add history',
					message: err.message 
				}, { 
					status: 500,
					headers: corsHeaders 
				});
			}
		}

		// 📜 История действий - получить
		if (url.pathname.startsWith('/history/')) {
			try {
				const wallet = url.pathname.split('/')[2];
				const list = await env.HISTORY.list({ 
					prefix: `${wallet}:`,
					limit: 50
				});

				const history = await Promise.all(
					list.keys.map(async (key) => {
						const data = await env.HISTORY.get(key.name, 'json');
						return data;
					})
				);

				// Сортируем по времени (новые первые)
				const sorted = history
					.filter(h => h)
					.sort((a, b) => b.timestamp - a.timestamp);

				return Response.json(sorted, {
					headers: corsHeaders
				});
			} catch (err) {
				return Response.json({ 
					error: 'Failed to get history',
					message: err.message 
				}, { 
					status: 500,
					headers: corsHeaders 
				});
			}
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

        // Helpers: sanitize & rate-limit
        const ADMIN_WALLET = 'AtDKj5NxBsJk67FQgRuVAd3Yig17jzUC7x4hNuFADrvA';

        const sanitize = (str: string): string => {
            return String(str)
                .replaceAll('&', '&amp;')
                .replaceAll('<', '&lt;')
                .replaceAll('>', '&gt;');
        };

        const rateLimit = async (env: Env, key: string, limit: number, windowSec: number) => {
            const nowBucket = Math.floor(Date.now() / 1000 / windowSec);
            const rlKey = `rl:${key}:${nowBucket}`;
            const current = await env.CACHE.get(rlKey);
            const count = current ? parseInt(current) : 0;
            if (count >= limit) return false;
            await env.CACHE.put(rlKey, String(count + 1), { expirationTtl: windowSec });
            return true;
        };

        // Flags helpers
        const getFlag = async (env: Env, key: string, def: string) => {
            const v = await env.CACHE.get(`flags:${key}`);
            return v ?? def;
        };
        const setFlag = async (env: Env, key: string, value: string) => {
            await env.CACHE.put(`flags:${key}`, value);
        };
        const isAdmin = (wallet?: string) => wallet && wallet === ADMIN_WALLET;

        // 💬 AI: Советник по уходу за питомцем
        if (url.pathname === '/ai/advisor' && request.method === 'POST') {
			try {
                // Simple body size guard
                const raw = await request.clone().text();
                if (raw.length > 10_000) {
                    return Response.json({ error: 'Payload too large' }, { status: 413, headers: corsHeaders });
                }
                const { question, petStats } = JSON.parse(raw || '{}');

                // Check flag ai_enabled
                const aiEnabled = await getFlag(env, 'ai_enabled', '1');
                if (aiEnabled !== '1') {
                    return Response.json({ error: 'AI disabled by admin' }, { status: 503, headers: corsHeaders });
                }

                // Rate limit per IP (12 req/min)
                const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
                const allowed = await rateLimit(env, `ai:${ip}`, 12, 60);
                if (!allowed) {
                    return Response.json({ error: 'Rate limit exceeded' }, { status: 429, headers: corsHeaders });
                }

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

		// 💬 CHAT: Получить последние сообщения
        if (url.pathname === '/chat/messages') {
			try {
				const chatKey = 'chat_messages';
				let messages = await env.HISTORY.get(chatKey, { type: 'json' }) || [];
				
				// Возвращаем последние 50 сообщений
				messages = messages.slice(-50);
				
				return Response.json(messages, { headers: corsHeaders });
			} catch (err) {
				return Response.json({ error: 'Failed to load chat', message: err.message }, { status: 500, headers: corsHeaders });
			}
		}

		// 💬 CHAT: Отправить сообщение
        if (url.pathname === '/chat/send' && request.method === 'POST') {
			try {
                // Guard body size
                const raw = await request.clone().text();
                if (raw.length > 5000) {
                    return Response.json({ error: 'Payload too large' }, { status: 413, headers: corsHeaders });
                }
                const { wallet, message } = JSON.parse(raw || '{}');
				
				if (!wallet || !message) {
					return Response.json({ error: 'Wallet and message required' }, { status: 400, headers: corsHeaders });
				}
				
                // Check global chat flag and mute list
                const chatEnabled = await getFlag(env, 'chat_enabled', '1');
                if (chatEnabled !== '1') {
                    return Response.json({ error: 'Chat disabled by admin' }, { status: 503, headers: corsHeaders });
                }
                const muted = await env.CACHE.get(`muted:${wallet}`);
                if (muted) {
                    return Response.json({ error: 'You are muted' }, { status: 403, headers: corsHeaders });
                }

                if (message.length > 200) {
					return Response.json({ error: 'Message too long' }, { status: 400, headers: corsHeaders });
				}

                // Rate limit by IP+wallet (10 msgs/60s)
                const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
                const ok = await rateLimit(env, `chat:${ip}:${wallet}`, 10, 60);
                if (!ok) {
                    return Response.json({ error: 'Rate limit exceeded' }, { status: 429, headers: corsHeaders });
                }

                // Sanitize text
                const clean = sanitize(message);
				
				// Получить существующие сообщения
				const chatKey = 'chat_messages';
				let messages = await env.HISTORY.get(chatKey, { type: 'json' }) || [];
				
				// Добавить новое сообщение
				const newMessage = {
					wallet,
                    message: clean,
					timestamp: Date.now()
				};
				
				messages.push(newMessage);
				
				// Хранить только последние 100 сообщений
				if (messages.length > 100) {
					messages = messages.slice(-100);
				}
				
				// Сохранить в KV
				await env.HISTORY.put(chatKey, JSON.stringify(messages));
				
				return Response.json({ status: 'ok', message: newMessage }, { headers: corsHeaders });
			} catch (err) {
				return Response.json({ error: 'Failed to send message', message: err.message }, { status: 500, headers: corsHeaders });
			}
		}

        // ==== ADMIN ENDPOINTS ====
        if (url.pathname === '/admin/flags/set' && request.method === 'POST') {
            const raw = await request.clone().text();
            const { wallet, key, value } = JSON.parse(raw || '{}');
            if (!isAdmin(wallet)) return Response.json({ error: 'Not admin' }, { status: 403, headers: corsHeaders });
            if (!key) return Response.json({ error: 'Key required' }, { status: 400, headers: corsHeaders });
            await setFlag(env, key, String(value));
            return Response.json({ ok: true }, { headers: corsHeaders });
        }

        if (url.pathname === '/flags') {
            const chat_enabled = await getFlag(env, 'chat_enabled', '1');
            const ai_enabled = await getFlag(env, 'ai_enabled', '1');
            const decay_multiplier = await getFlag(env, 'decay_multiplier', '1');
            // Per-stat decay defaults
            const hunger_decay_per10m = await getFlag(env, 'hunger_decay_per10m', '2');
            const energy_decay_per10m = await getFlag(env, 'energy_decay_per10m', '1');
            const happiness_decay_per10m = await getFlag(env, 'happiness_decay_per10m', '1');
            const health_penalty_base_per10m = await getFlag(env, 'health_penalty_base_per10m', '1');
            const health_penalty_if_hunger0_per10m = await getFlag(env, 'health_penalty_if_hunger0_per10m', '1');
            const health_penalty_if_two_zero_per10m = await getFlag(env, 'health_penalty_if_two_zero_per10m', '1');
            return Response.json({ 
                chat_enabled, ai_enabled, decay_multiplier,
                hunger_decay_per10m, energy_decay_per10m, happiness_decay_per10m,
                health_penalty_base_per10m, health_penalty_if_hunger0_per10m, health_penalty_if_two_zero_per10m
            }, { headers: corsHeaders });
        }

        if (url.pathname === '/admin/chat/mute' && request.method === 'POST') {
            const raw = await request.clone().text();
            const { wallet, target, ttlSec } = JSON.parse(raw || '{}');
            if (!isAdmin(wallet)) return Response.json({ error: 'Not admin' }, { status: 403, headers: corsHeaders });
            if (!target) return Response.json({ error: 'Target required' }, { status: 400, headers: corsHeaders });
            await env.CACHE.put(`muted:${target}`, '1', { expirationTtl: Number(ttlSec || 3600) });
            return Response.json({ ok: true }, { headers: corsHeaders });
        }

        if (url.pathname === '/admin/chat/unmute' && request.method === 'POST') {
            const raw = await request.clone().text();
            const { wallet, target } = JSON.parse(raw || '{}');
            if (!isAdmin(wallet)) return Response.json({ error: 'Not admin' }, { status: 403, headers: corsHeaders });
            if (!target) return Response.json({ error: 'Target required' }, { status: 400, headers: corsHeaders });
            await env.CACHE.delete(`muted:${target}`);
            return Response.json({ ok: true }, { headers: corsHeaders });
        }

        if (url.pathname === '/admin/leaderboard/clear' && request.method === 'POST') {
            const raw = await request.clone().text();
            const { wallet } = JSON.parse(raw || '{}');
            if (!isAdmin(wallet)) return Response.json({ error: 'Not admin' }, { status: 403, headers: corsHeaders });
            const list = await env.LEADERBOARD.list();
            await Promise.all(list.keys.map(k => env.LEADERBOARD.delete(k.name)));
            return Response.json({ ok: true }, { headers: corsHeaders });
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
					.new-badge {
						background: #ff4444;
						color: white;
						padding: 4px 12px;
						border-radius: 12px;
						font-size: 12px;
						font-weight: 600;
						margin-left: 10px;
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
					<h1>🐣 Crypto Tamagotchi API <span class="new-badge">WITH KV!</span></h1>
					<p class="subtitle">Backend API + KV Database + Workers AI</p>

					<div class="endpoint">
						<h3>🎲 /generate-pet <span class="badge">GET</span></h3>
						<p>Генерирует случайного уникального питомца с traits, rarity и stats</p>
						<button onclick="testEndpoint('/generate-pet')">🎲 Сгенерировать питомца</button>
					</div>

					<div class="endpoint">
						<h3>📊 /stats <span class="badge">GET</span> <span class="new-badge">KV</span></h3>
						<p>Реальная статистика игры из KV базы</p>
						<button onclick="testEndpoint('/stats')">📊 Показать статистику</button>
					</div>

					<div class="endpoint">
						<h3>🏆 /leaderboard <span class="badge">GET</span> <span class="new-badge">KV</span></h3>
						<p>Реальный топ-100 игроков из KV базы</p>
						<button onclick="testEndpoint('/leaderboard')">🏆 Показать лидеров</button>
					</div>

					<div class="endpoint">
						<h3>📜 /history/:wallet <span class="badge">GET</span> <span class="new-badge">KV</span></h3>
						<p>История действий игрока (последние 50)</p>
						<button onclick="testHistory()">📜 Показать историю</button>
					</div>

					<div class="endpoint">
						<h3>🎁 /referral/create <span class="badge">POST</span></h3>
						<p>Создать реферальную ссылку для приглашения друзей</p>
						<button onclick="testReferral()">🎁 Создать ссылку</button>
					</div>

					<div class="endpoint">
						<h3>🤖 AI Endpoints <span class="badge">POST</span></h3>
						<p>/ai/advisor, /ai/generate-pet, /ai/describe-nft</p>
						<button onclick="testAI()">🤖 Test AI</button>
					</div>

					<div class="result-box">
						<h3>📋 Результат:</h3>
						<pre id="result">Нажми на кнопку выше чтобы протестировать API...</pre>
					</div>

					<div class="footer">
						<p>💜 Powered by <strong>Cloudflare Workers + KV Database</strong></p>
						<p style="margin-top: 10px; font-size: 14px;">✨ Real-time leaderboard, caching, and history!</p>
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

					async function testHistory() {
						const result = document.getElementById('result');
						result.textContent = '⏳ Загружаю историю...';
						
						// Используем тестовый wallet
						const wallet = '49kwEKNBnfqYt4GYpYkcCHyDiQDxS24jRuckLjptryvu';
						
						try {
							const response = await fetch(\`/history/\${wallet}\`);
							const data = await response.json();
							result.textContent = JSON.stringify(data, null, 2);
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

					async function testAI() {
						const result = document.getElementById('result');
						result.textContent = '⏳ AI работает...';
						
						try {
							const response = await fetch('/ai/advisor', {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ 
									question: 'What should I do?',
									petStats: { health: 50, hunger: 80, happiness: 30 }
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
						console.log('🚀 Tamagotchi API with KV готов!');
						console.log('📝 Endpoints:');
						console.log('  GET  /generate-pet');
						console.log('  GET  /stats (KV)');
						console.log('  GET  /leaderboard (KV)');
						console.log('  POST /leaderboard/update (KV)');
						console.log('  GET  /history/:wallet (KV)');
						console.log('  POST /history/add (KV)');
						console.log('  POST /referral/create');
						console.log('  POST /ai/advisor');
						console.log('  POST /ai/generate-pet');
						console.log('  POST /ai/describe-nft');
					});
				</script>
			</body>
			</html>
		`, {
			headers: { 'Content-Type': 'text/html; charset=utf-8' }
		});
	},
} satisfies ExportedHandler<Env>;
