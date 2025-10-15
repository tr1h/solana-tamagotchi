-- Полная проверка всех рефералов
-- Наглядная таблица для анализа

-- 1. Сводная таблица всех пользователей
SELECT 
    l.telegram_id,
    COALESCE(l.telegram_username, 'No username') as username,
    COALESCE(l.pet_name, 'No pet name') as pet_name,
    l.tama as current_tama,
    COALESCE(r.active_referrals, 0) as active_referrals,
    COALESCE(p.pending_referrals, 0) as pending_referrals,
    COALESCE(r.active_referrals, 0) + COALESCE(p.pending_referrals, 0) as total_referrals,
    (COALESCE(r.active_referrals, 0) * 1000) as should_be_tama,
    (l.tama - (COALESCE(r.active_referrals, 0) * 1000)) as tama_difference
FROM leaderboard l
LEFT JOIN (
    SELECT 
        referrer_telegram_id,
        COUNT(*) as active_referrals
    FROM referrals 
    GROUP BY referrer_telegram_id
) r ON l.telegram_id = r.referrer_telegram_id
LEFT JOIN (
    SELECT 
        referrer_telegram_id,
        COUNT(*) as pending_referrals
    FROM pending_referrals 
    WHERE status = 'pending'
    GROUP BY referrer_telegram_id
) p ON l.telegram_id = p.referrer_telegram_id
WHERE l.telegram_id IS NOT NULL
ORDER BY l.tama DESC;

-- 2. Пользователи с неправильными TAMA балансами
SELECT 
    'Users with wrong TAMA' as info,
    l.telegram_username,
    l.pet_name,
    l.tama as current_tama,
    COALESCE(r.active_referrals, 0) as active_referrals,
    (COALESCE(r.active_referrals, 0) * 1000) as should_be_tama,
    (l.tama - (COALESCE(r.active_referrals, 0) * 1000)) as difference
FROM leaderboard l
LEFT JOIN (
    SELECT 
        referrer_telegram_id,
        COUNT(*) as active_referrals
    FROM referrals 
    GROUP BY referrer_telegram_id
) r ON l.telegram_id = r.referrer_telegram_id
WHERE l.telegram_id IS NOT NULL
AND l.tama != (COALESCE(r.active_referrals, 0) * 1000)
ORDER BY ABS(l.tama - (COALESCE(r.active_referrals, 0) * 1000)) DESC;
