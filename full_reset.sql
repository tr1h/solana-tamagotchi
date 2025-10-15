-- ПОЛНЫЙ СБРОС БАЗЫ ДАННЫХ
-- Удаляет ВСЕ данные и пользователей

-- 1. Удалить все данные
DELETE FROM referral_clicks;
DELETE FROM pending_referrals;
DELETE FROM referrals;
DELETE FROM leaderboard;
DELETE FROM players;

-- 2. Сбросить последовательности
ALTER SEQUENCE leaderboard_id_seq RESTART WITH 1;
ALTER SEQUENCE referrals_id_seq RESTART WITH 1;
ALTER SEQUENCE pending_referrals_id_seq RESTART WITH 1;
ALTER SEQUENCE referral_clicks_id_seq RESTART WITH 1;
ALTER SEQUENCE players_id_seq RESTART WITH 1;

-- 3. Проверить результат
SELECT 'Database fully reset!' as status;
SELECT COUNT(*) as remaining_users FROM leaderboard;
SELECT COUNT(*) as remaining_referrals FROM referrals;
