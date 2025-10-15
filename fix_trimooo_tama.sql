-- Исправить TAMA баланс пользователя Trimooo
-- У него 2 реферала, должно быть 2000 TAMA, а не 5000

-- 1. Найти пользователя Trimooo
SELECT 
    telegram_id,
    telegram_username,
    tama,
    referral_code
FROM leaderboard 
WHERE telegram_username = 'Trimooo' OR pet_name = 'Trimooo';

-- 2. Исправить баланс (2 реферала = 2000 TAMA)
UPDATE leaderboard 
SET tama = 2000
WHERE telegram_username = 'Trimooo' OR pet_name = 'Trimooo';

-- 3. Проверить результат
SELECT 
    telegram_id,
    telegram_username,
    pet_name,
    tama,
    referral_code
FROM leaderboard 
WHERE telegram_username = 'Trimooo' OR pet_name = 'Trimooo';
