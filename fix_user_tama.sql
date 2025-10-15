-- Исправить TAMA баланс пользователя TAMA44E30F
-- У него 2 реферала, должно быть 2000 TAMA, а не 5000

-- 1. Найти пользователя
SELECT 
    telegram_id,
    telegram_username,
    tama,
    referral_code
FROM leaderboard 
WHERE referral_code = 'TAMA44E30F';

-- 2. Исправить баланс (2 реферала = 2000 TAMA)
UPDATE leaderboard 
SET tama = 2000
WHERE referral_code = 'TAMA44E30F';

-- 3. Проверить результат
SELECT 
    telegram_id,
    telegram_username,
    tama,
    referral_code
FROM leaderboard 
WHERE referral_code = 'TAMA44E30F';
