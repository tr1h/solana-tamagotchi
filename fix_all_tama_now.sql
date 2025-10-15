-- СРОЧНО! Исправить все TAMA балансы
-- Установить правильные значения на основе активных рефералов

-- 1. Исправить TAMA балансы
UPDATE leaderboard 
SET tama = (
    SELECT COALESCE(COUNT(*), 0) * 1000
    FROM referrals 
    WHERE referrals.referrer_telegram_id = leaderboard.telegram_id
)
WHERE telegram_id IS NOT NULL;

-- 2. Проверить результат
SELECT 
    l.telegram_id,
    l.telegram_username,
    l.pet_name,
    l.tama as current_tama,
    COALESCE(r.active_referrals, 0) as active_referrals,
    (COALESCE(r.active_referrals, 0) * 1000) as should_be_tama
FROM leaderboard l
LEFT JOIN (
    SELECT 
        referrer_telegram_id,
        COUNT(*) as active_referrals
    FROM referrals 
    GROUP BY referrer_telegram_id
) r ON l.telegram_id = r.referrer_telegram_id
ORDER BY l.tama DESC;
