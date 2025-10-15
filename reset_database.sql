-- ============================================
-- ПОЛНЫЙ СБРОС БАЗЫ ДАННЫХ
-- ============================================

-- ⚠️ ВНИМАНИЕ: Этот скрипт удалит ВСЕ данные!
-- Запускать только для полного сброса!

-- 1. Удаляем ВСЕ данные из всех таблиц
DELETE FROM referrals;
DELETE FROM pending_referrals;
DELETE FROM referral_clicks;
DELETE FROM players;
DELETE FROM leaderboard;

-- 2. Сбрасываем счетчики ID
ALTER SEQUENCE leaderboard_id_seq RESTART WITH 1;
ALTER SEQUENCE referrals_id_seq RESTART WITH 1;
ALTER SEQUENCE pending_referrals_id_seq RESTART WITH 1;
ALTER SEQUENCE referral_clicks_id_seq RESTART WITH 1;
ALTER SEQUENCE players_id_seq RESTART WITH 1;

-- 3. Проверяем результат (должно быть 0 записей)
SELECT 'leaderboard' as table_name, COUNT(*) as records FROM leaderboard
UNION ALL
SELECT 'referrals', COUNT(*) FROM referrals
UNION ALL
SELECT 'pending_referrals', COUNT(*) FROM pending_referrals
UNION ALL
SELECT 'referral_clicks', COUNT(*) FROM referral_clicks
UNION ALL
SELECT 'players', COUNT(*) FROM players;

-- ✅ База данных полностью очищена и готова к чистому старту!
