-- Проверить TAMA баланс пользователя
-- Замените 'USER_TELEGRAM_ID' на реальный ID

-- 1. Проверить баланс в leaderboard
SELECT 
    telegram_id,
    telegram_username,
    tama,
    referral_code,
    created_at
FROM leaderboard 
WHERE telegram_id = 'USER_TELEGRAM_ID';

-- 2. Проверить рефералы
SELECT 
    referrer_telegram_id,
    referred_telegram_id,
    signup_reward,
    created_at
FROM referrals 
WHERE referrer_telegram_id = 'USER_TELEGRAM_ID';

-- 3. Проверить pending рефералы
SELECT 
    referrer_telegram_id,
    referred_telegram_id,
    status,
    created_at
FROM pending_referrals 
WHERE referrer_telegram_id = 'USER_TELEGRAM_ID';

-- 4. Подсчитать общее количество рефералов
SELECT 
    (SELECT COUNT(*) FROM referrals WHERE referrer_telegram_id = 'USER_TELEGRAM_ID') +
    (SELECT COUNT(*) FROM pending_referrals WHERE referrer_telegram_id = 'USER_TELEGRAM_ID' AND status = 'pending') 
    AS total_referrals;
