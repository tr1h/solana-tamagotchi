// ============================================
// TRANSACTION LOGGER - Запись всех транзакций
// ============================================

/**
 * Transaction Logger для записи всех TAMA операций
 * Записывает каждую транзакцию в Supabase для аналитики
 */

const TransactionLogger = {
    // Supabase конфигурация
    SUPABASE_URL: 'https://zfrazyupameidxpjihrh.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcmF6eXVwYW1laWR4cGppaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mzc1NTAsImV4cCI6MjA3NTUxMzU1MH0.1EkMDqCNJoAjcJDh3Dd3yPfus-JpdcwE--z2dhjh7wU',

    /**
     * Записать транзакцию
     * @param {Object} transaction - Данные транзакции
     * @param {string} transaction.telegram_id - ID пользователя Telegram
     * @param {string} transaction.telegram_username - Username пользователя
     * @param {string} transaction.type - Тип транзакции (earn, spend, referral, etc.)
     * @param {string} transaction.action - Действие (click, feed, play, etc.)
     * @param {number} transaction.amount - Сумма TAMA (+ или -)
     * @param {number} transaction.balance_before - Баланс до
     * @param {number} transaction.balance_after - Баланс после
     * @param {string} transaction.description - Описание
     * @param {Object} transaction.metadata - Дополнительные данные
     * @param {string} transaction.related_user_id - ID связанного пользователя
     */
    async logTransaction(transaction) {
        try {
            // Валидация обязательных полей
            if (!transaction.telegram_id || !transaction.type || !transaction.action || transaction.amount === undefined) {
                console.error('❌ Transaction Logger: Missing required fields', transaction);
                return false;
            }

            // Подготовка данных
            const transactionData = {
                telegram_id: transaction.telegram_id,
                telegram_username: transaction.telegram_username || null,
                type: transaction.type,
                action: transaction.action,
                amount: transaction.amount,
                balance_before: transaction.balance_before || null,
                balance_after: transaction.balance_after || null,
                description: transaction.description || null,
                metadata: transaction.metadata || null,
                related_user_id: transaction.related_user_id || null,
                created_at: new Date().toISOString()
            };

            // Запись в Supabase
            const response = await fetch(`${this.SUPABASE_URL}/rest/v1/transactions`, {
                method: 'POST',
                headers: {
                    'apikey': this.SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${this.SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(transactionData)
            });

            if (response.ok) {
                console.log('✅ Transaction logged:', transactionData);
                return true;
            } else {
                console.error('❌ Transaction log failed:', response.status, await response.text());
                return false;
            }
        } catch (error) {
            console.error('❌ Transaction Logger Error:', error);
            return false;
        }
    },

    /**
     * Быстрые методы для разных типов транзакций
     */

    // Заработок TAMA (клик, комбо, уровень)
    async logEarn(userId, username, action, amount, balanceBefore, balanceAfter, metadata = {}) {
        return await this.logTransaction({
            telegram_id: userId,
            telegram_username: username,
            type: 'earn',
            action: action, // 'click', 'combo', 'level_up'
            amount: amount,
            balance_before: balanceBefore,
            balance_after: balanceAfter,
            description: `Earned ${amount} TAMA from ${action}`,
            metadata: metadata
        });
    },

    // Трата TAMA (кормление, игра, лечение)
    async logSpend(userId, username, action, amount, balanceBefore, balanceAfter, metadata = {}) {
        return await this.logTransaction({
            telegram_id: userId,
            telegram_username: username,
            type: 'spend',
            action: action, // 'feed', 'play', 'heal', 'shop'
            amount: -Math.abs(amount), // Всегда отрицательное
            balance_before: balanceBefore,
            balance_after: balanceAfter,
            description: `Spent ${amount} TAMA on ${action}`,
            metadata: metadata
        });
    },

    // Реферальный бонус
    async logReferral(userId, username, referralId, amount, balanceBefore, balanceAfter) {
        return await this.logTransaction({
            telegram_id: userId,
            telegram_username: username,
            type: 'referral',
            action: 'referral_bonus',
            amount: amount,
            balance_before: balanceBefore,
            balance_after: balanceAfter,
            description: `Referral bonus: ${amount} TAMA`,
            related_user_id: referralId
        });
    },

    // Ежедневная награда
    async logDailyReward(userId, username, amount, balanceBefore, balanceAfter, streak) {
        return await this.logTransaction({
            telegram_id: userId,
            telegram_username: username,
            type: 'daily_reward',
            action: 'daily_claim',
            amount: amount,
            balance_before: balanceBefore,
            balance_after: balanceAfter,
            description: `Daily reward: ${amount} TAMA (Streak: ${streak} days)`,
            metadata: { streak: streak }
        });
    },

    // Мини-игра
    async logMiniGame(userId, username, gameType, amount, balanceBefore, balanceAfter, result) {
        return await this.logTransaction({
            telegram_id: userId,
            telegram_username: username,
            type: 'mini_game',
            action: gameType, // 'slots', 'dice', 'race', etc.
            amount: amount,
            balance_before: balanceBefore,
            balance_after: balanceAfter,
            description: `Mini game ${gameType}: ${amount > 0 ? 'won' : 'lost'} ${Math.abs(amount)} TAMA`,
            metadata: { game_type: gameType, result: result }
        });
    },

    // Повышение уровня
    async logLevelUp(userId, username, level, bonus, balanceBefore, balanceAfter) {
        return await this.logTransaction({
            telegram_id: userId,
            telegram_username: username,
            type: 'level_up',
            action: 'level_bonus',
            amount: bonus,
            balance_before: balanceBefore,
            balance_after: balanceAfter,
            description: `Level ${level} reached! Bonus: ${bonus} TAMA`,
            metadata: { level: level }
        });
    },

    // Админские действия
    async logAdminAction(userId, username, action, amount, balanceBefore, balanceAfter, adminId) {
        return await this.logTransaction({
            telegram_id: userId,
            telegram_username: username,
            type: 'admin_action',
            action: action, // 'add_tama', 'remove_tama', 'bonus'
            amount: amount,
            balance_before: balanceBefore,
            balance_after: balanceAfter,
            description: `Admin action: ${action}`,
            related_user_id: adminId,
            metadata: { admin_id: adminId }
        });
    },

    /**
     * Получить историю транзакций пользователя
     */
    async getUserTransactions(userId, limit = 50) {
        try {
            const response = await fetch(
                `${this.SUPABASE_URL}/rest/v1/transactions?telegram_id=eq.${userId}&order=created_at.desc&limit=${limit}`,
                {
                    headers: {
                        'apikey': this.SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${this.SUPABASE_ANON_KEY}`
                    }
                }
            );

            if (response.ok) {
                const transactions = await response.json();
                console.log(`✅ Loaded ${transactions.length} transactions for user ${userId}`);
                return transactions;
            } else {
                console.error('❌ Failed to load transactions:', response.status);
                return [];
            }
        } catch (error) {
            console.error('❌ Error loading transactions:', error);
            return [];
        }
    },

    /**
     * Получить последние N транзакций (глобальный лог)
     */
    async getRecentTransactions(limit = 100) {
        try {
            const response = await fetch(
                `${this.SUPABASE_URL}/rest/v1/transactions?order=created_at.desc&limit=${limit}`,
                {
                    headers: {
                        'apikey': this.SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${this.SUPABASE_ANON_KEY}`
                    }
                }
            );

            if (response.ok) {
                const transactions = await response.json();
                console.log(`✅ Loaded ${transactions.length} recent transactions`);
                return transactions;
            } else {
                console.error('❌ Failed to load recent transactions:', response.status);
                return [];
            }
        } catch (error) {
            console.error('❌ Error loading recent transactions:', error);
            return [];
        }
    },

    /**
     * Получить статистику пользователя
     */
    async getUserStats(userId) {
        try {
            const transactions = await this.getUserTransactions(userId, 1000);
            
            const stats = {
                total_earned: 0,
                total_spent: 0,
                total_transactions: transactions.length,
                earn_count: 0,
                spend_count: 0,
                by_action: {},
                by_type: {}
            };

            transactions.forEach(tx => {
                if (tx.amount > 0) {
                    stats.total_earned += tx.amount;
                    stats.earn_count++;
                } else {
                    stats.total_spent += Math.abs(tx.amount);
                    stats.spend_count++;
                }

                // Группировка по действиям
                if (!stats.by_action[tx.action]) {
                    stats.by_action[tx.action] = { count: 0, total: 0 };
                }
                stats.by_action[tx.action].count++;
                stats.by_action[tx.action].total += tx.amount;

                // Группировка по типам
                if (!stats.by_type[tx.type]) {
                    stats.by_type[tx.type] = { count: 0, total: 0 };
                }
                stats.by_type[tx.type].count++;
                stats.by_type[tx.type].total += tx.amount;
            });

            return stats;
        } catch (error) {
            console.error('❌ Error calculating user stats:', error);
            return null;
        }
    }
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TransactionLogger;
}

