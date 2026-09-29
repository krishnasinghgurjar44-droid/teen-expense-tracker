const { createClient } = require('@supabase/supabase-js');
const env = require('./env');
const crypto = require('crypto');

let supabase;

// Default categories to seed in local memory store if Supabase credentials are not provided
const DEFAULT_CATEGORIES = [
  { id: '11111111-1111-4111-8111-111111111101', name: 'Food', icon: '🍔', color: '#f97316', created_at: new Date().toISOString() },
  { id: '11111111-1111-4111-8111-111111111102', name: 'Travel', icon: '🚌', color: '#06b6d4', created_at: new Date().toISOString() },
  { id: '11111111-1111-4111-8111-111111111103', name: 'Education', icon: '📚', color: '#3b82f6', created_at: new Date().toISOString() },
  { id: '11111111-1111-4111-8111-111111111104', name: 'Shopping', icon: '🛍️', color: '#ec4899', created_at: new Date().toISOString() },
  { id: '11111111-1111-4111-8111-111111111105', name: 'Entertainment', icon: '🎮', color: '#8b5cf6', created_at: new Date().toISOString() },
  { id: '11111111-1111-4111-8111-111111111106', name: 'Bills', icon: '⚡', color: '#eab308', created_at: new Date().toISOString() },
  { id: '11111111-1111-4111-8111-111111111107', name: 'Health', icon: '💊', color: '#10b981', created_at: new Date().toISOString() },
  { id: '11111111-1111-4111-8111-111111111108', name: 'Personal Care', icon: '✨', color: '#14b8a6', created_at: new Date().toISOString() },
  { id: '11111111-1111-4111-8111-111111111109', name: 'Other', icon: '📦', color: '#64748b', created_at: new Date().toISOString() }
];

/**
 * Creates an in-memory PostgREST-compatible client for zero-config local testing
 * when external Supabase credentials are not yet supplied.
 */
function createInMemoryClient() {
  const store = {
    users: [],
    categories: [...DEFAULT_CATEGORIES],
    expenses: [],
    budgets: []
  };

  class QueryBuilder {
    constructor(tableName) {
      this.table = tableName;
      this.filters = [];
      this.orders = [];
      this.limitCount = null;
      this.offsetCount = null;
      this.selectedFields = '*';
      this.action = 'select';
      this.payload = null;
      this.isSingle = false;
      this.isCountOnly = false;
    }

    select(fields = '*', options = {}) {
      this.selectedFields = fields;
      if (options.count === 'exact') {
        this.withCount = true;
      }
      if (options.head === true) {
        this.isCountOnly = true;
      }
      return this;
    }

    insert(records) {
      this.action = 'insert';
      this.payload = Array.isArray(records) ? records : [records];
      return this;
    }

    update(updates) {
      this.action = 'update';
      this.payload = updates;
      return this;
    }

    delete() {
      this.action = 'delete';
      return this;
    }

    upsert(record, options = {}) {
      this.action = 'upsert';
      this.payload = Array.isArray(record) ? record : [record];
      this.onConflict = options.onConflict;
      return this;
    }

    eq(column, value) {
      this.filters.push((item) => item[column] === value);
      return this;
    }

    neq(column, value) {
      this.filters.push((item) => item[column] !== value);
      return this;
    }

    gte(column, value) {
      this.filters.push((item) => item[column] >= value);
      return this;
    }

    lte(column, value) {
      this.filters.push((item) => item[column] <= value);
      return this;
    }

    gt(column, value) {
      this.filters.push((item) => item[column] > value);
      return this;
    }

    lt(column, value) {
      this.filters.push((item) => item[column] < value);
      return this;
    }

    in(column, values) {
      this.filters.push((item) => values.includes(item[column]));
      return this;
    }

    ilike(column, pattern) {
      const cleanPattern = pattern.replace(/%/g, '').toLowerCase();
      this.filters.push((item) => {
        const val = item[column];
        return typeof val === 'string' && val.toLowerCase().includes(cleanPattern);
      });
      return this;
    }

    order(column, { ascending = true } = {}) {
      this.orders.push({ column, ascending });
      return this;
    }

    range(from, to) {
      this.offsetCount = from;
      this.limitCount = to - from + 1;
      return this;
    }

    limit(count) {
      this.limitCount = count;
      return this;
    }

    single() {
      this.isSingle = true;
      return this;
    }

    maybeSingle() {
      this.isSingle = true;
      this.isMaybeSingle = true;
      return this;
    }

    async then(resolve, reject) {
      try {
        if (!store[this.table]) {
          store[this.table] = [];
        }

        const tableData = store[this.table];

        if (this.action === 'insert') {
          const inserted = this.payload.map((row) => {
            const newRow = {
              id: row.id || crypto.randomUUID(),
              ...row,
              created_at: row.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            tableData.push(newRow);
            return newRow;
          });
          const res = this.isSingle ? inserted[0] : inserted;
          return resolve({ data: res, error: null });
        }

        if (this.action === 'upsert') {
          const upserted = this.payload.map((row) => {
            let existingIdx = -1;
            if (this.onConflict) {
              const conflictKeys = this.onConflict.split(',').map((k) => k.trim());
              existingIdx = tableData.findIndex((item) =>
                conflictKeys.every((key) => item[key] === row[key])
              );
            } else if (row.id) {
              existingIdx = tableData.findIndex((item) => item.id === row.id);
            }

            if (existingIdx !== -1) {
              tableData[existingIdx] = {
                ...tableData[existingIdx],
                ...row,
                updated_at: new Date().toISOString()
              };
              return tableData[existingIdx];
            } else {
              const newRow = {
                id: row.id || crypto.randomUUID(),
                ...row,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              tableData.push(newRow);
              return newRow;
            }
          });
          return resolve({ data: this.isSingle ? upserted[0] : upserted, error: null });
        }

        if (this.action === 'update') {
          let updatedRows = [];
          for (let i = 0; i < tableData.length; i++) {
            const matches = this.filters.every((fn) => fn(tableData[i]));
            if (matches) {
              tableData[i] = {
                ...tableData[i],
                ...this.payload,
                updated_at: new Date().toISOString()
              };
              updatedRows.push(tableData[i]);
            }
          }
          return resolve({ data: this.isSingle ? updatedRows[0] || null : updatedRows, error: null });
        }

        if (this.action === 'delete') {
          const toDelete = [];
          for (let i = tableData.length - 1; i >= 0; i--) {
            const matches = this.filters.every((fn) => fn(tableData[i]));
            if (matches) {
              toDelete.push(tableData[i]);
              tableData.splice(i, 1);
            }
          }
          return resolve({ data: toDelete, error: null });
        }

        // Action === 'select'
        let filtered = tableData.filter((item) => this.filters.every((fn) => fn(item)));
        const totalCount = filtered.length;

        // Apply sorting
        if (this.orders.length > 0) {
          filtered.sort((a, b) => {
            for (const { column, ascending } of this.orders) {
              const valA = a[column];
              const valB = b[column];
              if (valA < valB) return ascending ? -1 : 1;
              if (valA > valB) return ascending ? 1 : -1;
            }
            return 0;
          });
        }

        // Apply pagination
        if (this.offsetCount !== null || this.limitCount !== null) {
          const start = this.offsetCount || 0;
          const end = this.limitCount !== null ? start + this.limitCount : undefined;
          filtered = filtered.slice(start, end);
        }

        // Handle category join resolution if requested: category:categories(id, name, icon, color)
        if (this.table === 'expenses' && this.selectedFields.includes('categories')) {
          filtered = filtered.map((exp) => {
            const cat = store.categories.find((c) => c.id === exp.category_id);
            return {
              ...exp,
              categories: cat ? { id: cat.id, name: cat.name, icon: cat.icon, color: cat.color } : null
            };
          });
        }

        if (this.isCountOnly) {
          return resolve({ data: null, count: totalCount, error: null });
        }

        if (this.isSingle) {
          const item = filtered[0] || null;
          if (!item && !this.isMaybeSingle) {
            return resolve({ data: null, error: { message: 'Row not found', code: 'PGRST116' } });
          }
          return resolve({ data: item, count: totalCount, error: null });
        }

        return resolve({
          data: filtered,
          count: this.withCount ? totalCount : undefined,
          error: null
        });
      } catch (err) {
        return resolve({ data: null, error: err });
      }
    }
  }

  return {
    from: (tableName) => new QueryBuilder(tableName),
    _isInMemory: true,
    _getStore: () => store
  };
}

// Check if valid Supabase URL & Service Role Key are provided
const isValidSupabaseConfig =
  env.SUPABASE_URL &&
  env.SUPABASE_URL.startsWith('http') &&
  env.SUPABASE_SERVICE_ROLE_KEY &&
  env.SUPABASE_SERVICE_ROLE_KEY.length > 20;

if (isValidSupabaseConfig) {
  supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
  console.log('✅ Connected to Supabase PostgreSQL Database at:', new URL(env.SUPABASE_URL).hostname);
} else {
  console.log(
    'ℹ️ No valid SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY found in .env.\n' +
    '   Initialising high-fidelity local PostgREST in-memory database adapter.\n' +
    '   To connect live Supabase: Add credentials to backend/.env and restart.'
  );
  supabase = createInMemoryClient();
}

module.exports = supabase;
