const supabase = require('../config/db');

const budgetModel = {
  /**
   * Find budget for a given user, month, and year
   * @param {string} userId - User UUID
   * @param {number} month - 1 to 12
   * @param {number} year - YYYY
   * @returns {Promise<Object|null>}
   */
  async findByUserAndPeriod(userId, month, year) {
    const { data, error } = await supabase
      .from('budgets')
      .select('id, user_id, month, year, amount, created_at, updated_at')
      .eq('user_id', userId)
      .eq('month', parseInt(month, 10))
      .eq('year', parseInt(year, 10))
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Database error finding budget: ${error.message}`);
    }
    return data || null;
  },

  /**
   * Upsert (insert or update) monthly budget for a user
   * @param {string} userId - User UUID
   * @param {Object} budgetData - { month, year, amount }
   * @returns {Promise<Object>}
   */
  async upsert(userId, { month, year, amount }) {
    const cleanMonth = parseInt(month, 10);
    const cleanYear = parseInt(year, 10);
    const cleanAmount = parseFloat(amount);

    // First check if a budget already exists for this period
    const existing = await this.findByUserAndPeriod(userId, cleanMonth, cleanYear);

    if (existing) {
      const { data, error } = await supabase
        .from('budgets')
        .update({
          amount: cleanAmount,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(`Database error updating budget: ${error.message}`);
      }
      return data;
    } else {
      const { data, error } = await supabase
        .from('budgets')
        .insert({
          user_id: userId,
          month: cleanMonth,
          year: cleanYear,
          amount: cleanAmount
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Database error creating budget: ${error.message}`);
      }
      return data;
    }
  },

  /**
   * Get historical budgets for user
   * @param {string} userId - User UUID
   * @param {number} limit - Number of periods to retrieve
   * @returns {Promise<Array>}
   */
  async getHistory(userId, limit = 12) {
    const { data, error } = await supabase
      .from('budgets')
      .select('id, user_id, month, year, amount, created_at, updated_at')
      .eq('user_id', userId)
      .order('year', { ascending: false })
      .order('month', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Database error retrieving budget history: ${error.message}`);
    }
    return data || [];
  }
};

module.exports = budgetModel;
