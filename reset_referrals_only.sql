-- Сброс только рефералов (оставляем пользователей)
-- Это очистит все реферальные данные для тестирования

-- 1. Удалить все рефералы
DELETE FROM referrals;

-- 2. Удалить все ожидающие рефералы
DELETE FROM pending_referrals;

-- 3. Удалить все клики по реферальным ссылкам
DELETE FROM referral_clicks;

-- 4. Сбросить TAMA балансы всех пользователей на 0
UPDATE leaderboard 
SET tama = 0
WHERE telegram_id IS NOT NULL;

-- 5. Сбросить последовательности ID
ALTER SEQUENCE referrals_id_seq RESTART WITH 1;
ALTER SEQUENCE pending_referrals_id_seq RESTART WITH 1;
ALTER SEQUENCE referral_clicks_id_seq RESTART WITH 1;

-- 6. Проверить результат
SELECT 'Database reset successfully!' as status;

-- 7. Показать текущее состояние
SELECT 
    telegram_id,
    telegram_username,
    pet_name,
    tama,
    referral_code
FROM leaderboard 
ORDER BY telegram_id;
