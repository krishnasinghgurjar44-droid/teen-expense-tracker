const supabase = require('../config/db');

const userModel = {
  /**
   * Find a user by their unique UUID
   * @param {string} id - User UUID
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, created_at, updated_at')
      .eq('id', id)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Database error finding user by ID: ${error.message}`);
    }
    return data || null;
  },

  /**
   * Find a user by email, including password_hash for authentication
   * @param {string} email - User email address
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, password_hash, created_at, updated_at')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Database error finding user by email: ${error.message}`);
    }
    return data || null;
  },

  /**
   * Create a new user record
   * @param {Object} userData - { name, email, password_hash }
   * @returns {Promise<Object>} Created user without password_hash
   */
  async create({ name, email, password_hash }) {
    const { data, error } = await supabase
      .from('users')
      .insert({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password_hash
      })
      .select('id, name, email, created_at, updated_at')
      .single();

    if (error) {
      throw new Error(`Database error creating user: ${error.message}`);
    }
    return data;
  },

  /**
   * Update user details (e.g. name or password)
   * @param {string} id - User UUID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>}
   */
  async update(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select('id, name, email, created_at, updated_at')
      .single();

    if (error) {
      throw new Error(`Database error updating user: ${error.message}`);
    }
    return data;
  },

  /**
   * Update user password hash
   * @param {string} id - User UUID
   * @param {string} password_hash - New hashed password
   */
  async updatePassword(id, password_hash) {
    const { error } = await supabase
      .from('users')
      .update({ password_hash, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw new Error(`Database error updating password: ${error.message}`);
    }
    return true;
  },

  /**
   * Delete a user account (cascades to expenses and budgets)
   * @param {string} id - User UUID
   * @returns {Promise<boolean>}
   */
  async deleteById(id) {
    // Delete dependent budgets and expenses first to maintain clean cascades in all environments
    await supabase.from('expenses').delete().eq('user_id', id);
    await supabase.from('budgets').delete().eq('user_id', id);

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Database error deleting user: ${error.message}`);
    }
    return true;
  }
};

module.exports = userModel;
