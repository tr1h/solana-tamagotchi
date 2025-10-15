-- Отладка TAMA баланса пользователя TAMA44E30F
-- Замените 'USER_TELEGRAM_ID' на реальный ID пользователя

-- 1. Проверить баланс в leaderboard
SELECT 
    telegram_id,
    telegram_username,
    tama,
    referral_code,
    created_at,
    updated_at
FROM leaderboard 
WHERE referral_code = 'TAMA44E30F';

-- 2. Проверить все рефералы этого пользователя
SELECT 
    'referrals' as table_name,
    referrer_telegram_id,
    referred_telegram_id,
    signup_reward,
    created_at
FROM referrals 
WHERE referrer_telegram_id = (SELECT telegram_id FROM leaderboard WHERE referral_code = 'TAMA44E30F')

UNION ALL

SELECT 
    'pending_referrals' as table_name,
    referrer_telegram_id,
    referred_telegram_id,
    0 as signup_reward,
    created_at
FROM pending_referrals 
WHERE referrer_telegram_id = (SELECT telegram_id FROM leaderboard WHERE referral_code = 'TAMA44E30F');

-- 3. Подсчитать общее количество рефералов
SELECT 
    (SELECT COUNT(*) FROM referrals WHERE referrer_telegram_id = (SELECT telegram_id FROM leaderboard WHERE referral_code = 'TAMA44E30F')) as active_referrals,
    (SELECT COUNT(*) FROM pending_referrals WHERE referrer_telegram_id = (SELECT telegram_id FROM leaderboard WHERE referral_code = 'TAMA44E30F') AND status = 'pending') as pending_referrals,
    (SELECT COUNT(*) FROM referrals WHERE referrer_telegram_id = (SELECT telegram_id FROM leaderboard WHERE referral_code = 'TAMA44E30F')) + 
    (SELECT COUNT(*) FROM pending_referrals WHERE referrer_telegram_id = (SELECT telegram_id FROM leaderboard WHERE referral_code = 'TAMA44E30F') AND status = 'pending') as total_referrals;

-- 4. Проверить историю изменений TAMA (если есть логи)
-- SELECT * FROM leaderboard_history WHERE telegram_id = (SELECT telegram_id FROM leaderboard WHERE referral_code = 'TAMA44E30F');
