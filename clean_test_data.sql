-- ============================================
-- CLEAN TEST DATA BEFORE LAUNCH
-- ============================================

-- ⚠️ ВНИМАНИЕ: Этот скрипт удалит ВСЕ тестовые данные!
-- Запускать только перед релизом!

-- 1. Удаляем тестовые записи из leaderboard
DELETE FROM leaderboard 
WHERE telegram_id IN ('123456789', '202140267', 'test_user_1', 'test_user_2')
   OR telegram_username IN ('admin', 'test', 'trimo_tradiumschool', 'Trimooo')
   OR wallet_address LIKE 'telegram_%'
   OR wallet_address LIKE 'sample_%'
   OR wallet_address LIKE 'test_%';

-- 2. Удаляем тестовые рефералы
DELETE FROM referrals 
WHERE referrer_telegram_id IN ('123456789', '202140267', 'test_user_1', 'test_user_2')
   OR referred_telegram_id IN ('123456789', '202140267', 'test_user_1', 'test_user_2')
   OR referrer_address LIKE 'telegram_%'
   OR referrer_address LIKE 'sample_%'
   OR referrer_address LIKE 'test_%';

-- 3. Удаляем тестовые pending рефералы
DELETE FROM pending_referrals 
WHERE referrer_telegram_id IN ('123456789', '202140267', 'test_user_1', 'test_user_2')
   OR referred_telegram_id IN ('123456789', '202140267', 'test_user_1', 'test_user_2');

-- 4. Удаляем тестовые клики
DELETE FROM referral_clicks 
WHERE referral_code LIKE 'TAMA000%'
   OR referral_code LIKE 'TEST%'
   OR created_at < '2025-01-01';

-- 5. Удаляем тестовых игроков
DELETE FROM players 
WHERE wallet_address LIKE 'telegram_%'
   OR wallet_address LIKE 'sample_%'
   OR wallet_address LIKE 'test_%';

-- 6. Сбрасываем счетчики ID (опционально)
-- ALTER SEQUENCE leaderboard_id_seq RESTART WITH 1;
-- ALTER SEQUENCE referrals_id_seq RESTART WITH 1;
-- ALTER SEQUENCE pending_referrals_id_seq RESTART WITH 1;
-- ALTER SEQUENCE referral_clicks_id_seq RESTART WITH 1;
-- ALTER SEQUENCE players_id_seq RESTART WITH 1;

-- 7. Проверяем результат
SELECT 'leaderboard' as table_name, COUNT(*) as records FROM leaderboard
UNION ALL
SELECT 'referrals', COUNT(*) FROM referrals
UNION ALL
SELECT 'pending_referrals', COUNT(*) FROM pending_referrals
UNION ALL
SELECT 'referral_clicks', COUNT(*) FROM referral_clicks
UNION ALL
SELECT 'players', COUNT(*) FROM players;

-- ✅ База данных очищена и готова к релизу!

