const supabase = require('../config/db');

const expenseModel = {
  /**
   * Create a new expense record belonging to a user
   * @param {string} userId - User UUID
   * @param {Object} expenseData - { category_id, title, description, amount, expense_date, payment_method }
   * @returns {Promise<Object>}
   */
  async create(userId, expenseData) {
    const { category_id, title, description, amount, expense_date, payment_method } = expenseData;

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        user_id: userId,
        category_id,
        title: title.trim(),
        description: description ? description.trim() : null,
        amount: parseFloat(amount),
        expense_date: expense_date || new Date().toISOString().split('T')[0],
        payment_method
      })
      .select('id, user_id, category_id, title, description, amount, expense_date, payment_method, created_at, updated_at')
      .single();

    if (error) {
      throw new Error(`Database error creating expense: ${error.message}`);
    }
    return data;
  },

  /**
   * Find a single expense by ID ensuring ownership
   * @param {string} id - Expense UUID
   * @param {string} userId - Authenticated user UUID
   * @returns {Promise<Object|null>}
   */
  async findById(id, userId) {
    const { data, error } = await supabase
      .from('expenses')
      .select('id, user_id, category_id, title, description, amount, expense_date, payment_method, created_at, updated_at, categories(id, name, icon, color)')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Database error finding expense: ${error.message}`);
    }
    return data || null;
  },

  /**
   * Query expenses with rich search, filters, sorting, and pagination
   * @param {string} userId - User UUID
   * @param {Object} options - Filtering & pagination parameters
   * @returns {Promise<Object>} { data, total, page, limit, totalPages }
   */
  async findByUserAndFilters(userId, options = {}) {
    const page = Math.max(1, parseInt(options.page || 1, 10));
    const limit = Math.max(1, Math.min(100, parseInt(options.limit || 15, 10)));
    const offset = (page - 1) * limit;

    let query = supabase
      .from('expenses')
      .select('id, user_id, category_id, title, description, amount, expense_date, payment_method, created_at, updated_at, categories(id, name, icon, color)', { count: 'exact' })
      .eq('user_id', userId);

    // Filter by Category
    if (options.category) {
      query = query.eq('category_id', options.category);
    }

    // Filter by Payment Method
    if (options.paymentMethod) {
      query = query.eq('payment_method', options.paymentMethod);
    }

    // Filter by Date Range
    if (options.from) {
      query = query.gte('expense_date', options.from);
    }
    if (options.to) {
      query = query.lte('expense_date', options.to);
    }

    // Filter by Amount Range
    if (options.minAmount !== undefined && options.minAmount !== '') {
      query = query.gte('amount', parseFloat(options.minAmount));
    }
    if (options.maxAmount !== undefined && options.maxAmount !== '') {
      query = query.lte('amount', parseFloat(options.maxAmount));
    }

    // Search by Title or Description
    if (options.search && options.search.trim()) {
      query = query.ilike('title', `%${options.search.trim()}%`);
    }

    // Sorting
    switch (options.sort) {
      case 'oldest':
        query = query.order('expense_date', { ascending: true });
        break;
      case 'highest':
        query = query.order('amount', { ascending: false });
        break;
      case 'lowest':
        query = query.order('amount', { ascending: true });
        break;
      case 'newest':
      default:
        query = query.order('expense_date', { ascending: false }).order('created_at', { ascending: false });
        break;
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) {
      throw new Error(`Database error querying expenses: ${error.message}`);
    }

    const total = count !== undefined ? count : (data ? data.length : 0);
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data: data || [],
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  },

  /**
   * Get all expenses in a date range for a user (used for summaries, charts, suggestions)
   * @param {string} userId - User UUID
   * @param {string} startDate - YYYY-MM-DD
   * @param {string} endDate - YYYY-MM-DD
   * @returns {Promise<Array>}
   */
  async getByDateRange(userId, startDate, endDate) {
    const { data, error } = await supabase
      .from('expenses')
      .select('id, user_id, category_id, title, description, amount, expense_date, payment_method, created_at, categories(id, name, icon, color)')
      .eq('user_id', userId)
      .gte('expense_date', startDate)
      .lte('expense_date', endDate)
      .order('expense_date', { ascending: true });

    if (error) {
      throw new Error(`Database error fetching date range expenses: ${error.message}`);
    }
    return data || [];
  },

  /**
   * Get latest recent expenses for a user
   * @param {string} userId - User UUID
   * @param {number} limit - Number of records
   * @returns {Promise<Array>}
   */
  async getRecentByUser(userId, limit = 5) {
    const { data, error } = await supabase
      .from('expenses')
      .select('id, user_id, category_id, title, description, amount, expense_date, payment_method, created_at, categories(id, name, icon, color)')
      .eq('user_id', userId)
      .order('expense_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Database error fetching recent expenses: ${error.message}`);
    }
    return data || [];
  },

  /**
   * Update an expense ensuring user ownership
   * @param {string} id - Expense UUID
   * @param {string} userId - Authenticated user UUID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>}
   */
  async update(id, userId, updates) {
    // First verify ownership
    const existing = await this.findById(id, userId);
    if (!existing) {
      return null;
    }

    const { category_id, title, description, amount, expense_date, payment_method } = updates;
    const updatePayload = {};

    if (category_id !== undefined) updatePayload.category_id = category_id;
    if (title !== undefined) updatePayload.title = title.trim();
    if (description !== undefined) updatePayload.description = description ? description.trim() : null;
    if (amount !== undefined) updatePayload.amount = parseFloat(amount);
    if (expense_date !== undefined) updatePayload.expense_date = expense_date;
    if (payment_method !== undefined) updatePayload.payment_method = payment_method;
    updatePayload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('expenses')
      .update(updatePayload)
      .eq('id', id)
      .eq('user_id', userId)
      .select('id, user_id, category_id, title, description, amount, expense_date, payment_method, created_at, updated_at, categories(id, name, icon, color)')
      .single();

    if (error) {
      throw new Error(`Database error updating expense: ${error.message}`);
    }
    return data;
  },

  /**
   * Delete an expense ensuring user ownership
   * @param {string} id - Expense UUID
   * @param {string} userId - Authenticated user UUID
   * @returns {Promise<boolean>}
   */
  async deleteById(id, userId) {
    const existing = await this.findById(id, userId);
    if (!existing) {
      return false;
    }

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Database error deleting expense: ${error.message}`);
    }
    return true;
  }
};

module.exports = expenseModel;
