const supabase = require('../config/db');

const categoryModel = {
  /**
   * Retrieve all available expense categories
   * @returns {Promise<Array>}
   */
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, icon, color, created_at')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Database error retrieving categories: ${error.message}`);
    }
    return data || [];
  },

  /**
   * Find a category by its ID
   * @param {string} id - Category UUID
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, icon, color')
      .eq('id', id)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Database error finding category: ${error.message}`);
    }
    return data || null;
  },

  /**
   * Find a category by its name (case insensitive)
   * @param {string} name - Category name
   * @returns {Promise<Object|null>}
   */
  async findByName(name) {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, icon, color')
      .ilike('name', name.trim())
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Database error finding category by name: ${error.message}`);
    }
    return data || null;
  }
};

module.exports = categoryModel;
