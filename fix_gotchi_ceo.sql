-- Исправить TAMA баланс gotchi_ceo
-- У него 4 реферала, должно быть 4,000 TAMA, а не 10,000

-- 1. Найти gotchi_ceo
SELECT 
    telegram_id,
    telegram_username,
    pet_name,
    tama,
    referral_code
FROM leaderboard 
WHERE telegram_username = 'gotchi_ceo' OR pet_name = 'gotchi_ceo';

-- 2. Посчитать реальные рефералы
SELECT 
    'Real referrals count' as info,
    COUNT(*) as active_referrals
FROM referrals r
JOIN leaderboard l ON r.referrer_telegram_id = l.telegram_id
WHERE l.telegram_username = 'gotchi_ceo' OR l.pet_name = 'gotchi_ceo';

-- 3. Исправить TAMA баланс (4 реферала = 4,000 TAMA)
UPDATE leaderboard 
SET tama = 4000
WHERE telegram_username = 'gotchi_ceo' OR pet_name = 'gotchi_ceo';

-- 4. Проверить результат
SELECT 
    telegram_id,
    telegram_username,
    pet_name,
    tama,
    referral_code
FROM leaderboard 
WHERE telegram_username = 'gotchi_ceo' OR pet_name = 'gotchi_ceo';
