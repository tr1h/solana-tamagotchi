-- Проверка рефералов - наглядная таблица
-- Показывает всех пользователей и их рефералов

-- 1. Общая статистика
SELECT 
    'Общая статистика' as info,
    (SELECT COUNT(*) FROM leaderboard) as total_users,
    (SELECT COUNT(*) FROM referrals) as total_referrals,
    (SELECT COUNT(*) FROM pending_referrals) as pending_referrals,
    (SELECT COUNT(*) FROM referral_clicks) as total_clicks;

-- 2. Детальная таблица пользователей и их рефералов
SELECT 
    l.telegram_id,
    l.telegram_username,
    l.pet_name,
    l.tama,
    l.referral_code,
    COALESCE(r.active_referrals, 0) as active_referrals,
    COALESCE(p.pending_referrals, 0) as pending_referrals,
    COALESCE(r.active_referrals, 0) + COALESCE(p.pending_referrals, 0) as total_referrals
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
ORDER BY l.tama DESC;

-- 3. Детали рефералов для gotchi_ceo
SELECT 
    'gotchi_ceo referrals' as info,
    r.id,
    r.referrer_telegram_id,
    r.referred_telegram_id,
    r.referrer_address,
    r.referred_address,
    r.signup_reward,
    r.created_at
FROM referrals r
JOIN leaderboard l ON r.referrer_telegram_id = l.telegram_id
WHERE l.telegram_username = 'gotchi_ceo' OR l.pet_name = 'gotchi_ceo';

-- 4. Ожидающие рефералы для gotchi_ceo
SELECT 
    'gotchi_ceo pending' as info,
    p.id,
    p.referrer_telegram_id,
    p.referred_telegram_id,
    p.status,
    p.created_at
FROM pending_referrals p
JOIN leaderboard l ON p.referrer_telegram_id = l.telegram_id
WHERE l.telegram_username = 'gotchi_ceo' OR l.pet_name = 'gotchi_ceo';

-- 5. Проверка TAMA баланса gotchi_ceo
SELECT 
    'gotchi_ceo balance' as info,
    telegram_id,
    telegram_username,
    pet_name,
    tama,
    referral_code
FROM leaderboard 
WHERE telegram_username = 'gotchi_ceo' OR pet_name = 'gotchi_ceo';
