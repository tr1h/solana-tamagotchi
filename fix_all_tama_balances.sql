-- Исправить TAMA балансы всех пользователей
-- TAMA должен равняться количеству активных рефералов × 1000

-- 1. Посмотреть текущие балансы
SELECT 
    telegram_id,
    telegram_username,
    pet_name,
    tama,
    referral_code
FROM leaderboard 
ORDER BY tama DESC;

-- 2. Обновить TAMA балансы на основе активных рефералов
UPDATE leaderboard 
SET tama = (
    SELECT COALESCE(COUNT(*), 0) * 1000
    FROM referrals 
    WHERE referrals.referrer_telegram_id = leaderboard.telegram_id
)
WHERE telegram_id IS NOT NULL;

-- 3. Проверить результат
SELECT 
    l.telegram_id,
    l.telegram_username,
    l.pet_name,
    l.tama,
    l.referral_code,
    COALESCE(r.active_count, 0) as active_referrals
FROM leaderboard l
LEFT JOIN (
    SELECT 
        referrer_telegram_id,
        COUNT(*) as active_count
    FROM referrals 
    GROUP BY referrer_telegram_id
) r ON l.telegram_id = r.referrer_telegram_id
ORDER BY l.tama DESC;
