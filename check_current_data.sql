-- Проверить текущие данные в базе
-- Что показывает бот vs что в базе

-- 1. Все пользователи с их TAMA
SELECT 
    telegram_id,
    telegram_username,
    pet_name,
    tama,
    referral_code
FROM leaderboard 
ORDER BY tama DESC;

-- 2. Рефералы для каждого пользователя
SELECT 
    l.telegram_username,
    l.tama as current_tama,
    COUNT(r.id) as active_referrals,
    (COUNT(r.id) * 1000) as should_be_tama
FROM leaderboard l
LEFT JOIN referrals r ON l.telegram_id = r.referrer_telegram_id
GROUP BY l.telegram_id, l.telegram_username, l.tama
ORDER BY l.tama DESC;
