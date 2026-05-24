// Supabase client initialization
// For browser (uses anon key)

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || window.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || window.SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials not found. Using mock data. To enable database: set SUPABASE_URL and SUPABASE_ANON_KEY');
}

// Simple Supabase API client for browser
window.SupabaseAPI = {
  // Get all stocks
  async getStocks(wardId = null) {
    if (!SUPABASE_URL) return window.STOCK || [];

    let url = `${SUPABASE_URL}/rest/v1/stocks?select=*`;
    if (wardId && wardId !== 'all') {
      url += `&ward_id=eq.${wardId}`;
    }

    try {
      const res = await fetch(url, {
        headers: { 'apikey': SUPABASE_ANON_KEY }
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to fetch stocks:', e);
    }
    return window.STOCK || [];
  },

  // Add stock
  async addStock(data) {
    if (!SUPABASE_URL) {
      console.log('Mock: Would add stock', data);
      return { id: Date.now(), ...data };
    }

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/stocks`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const [result] = await res.json();
        return result;
      }
    } catch (e) {
      console.error('Failed to add stock:', e);
    }
    return null;
  },

  // Update stock
  async updateStock(id, data) {
    if (!SUPABASE_URL) {
      console.log('Mock: Would update stock', id, data);
      return { id, ...data };
    }

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/stocks?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const [result] = await res.json();
        return result;
      }
    } catch (e) {
      console.error('Failed to update stock:', e);
    }
    return null;
  },

  // Delete stock
  async deleteStock(id) {
    if (!SUPABASE_URL) {
      console.log('Mock: Would delete stock', id);
      return true;
    }

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/stocks?id=eq.${id}`, {
        method: 'DELETE',
        headers: { 'apikey': SUPABASE_ANON_KEY }
      });
      return res.ok;
    } catch (e) {
      console.error('Failed to delete stock:', e);
    }
    return false;
  },

  // Record movement (add/remove)
  async addMovement(stockId, type, quantity, notes = '') {
    if (!SUPABASE_URL) {
      console.log('Mock: Would record movement', { stockId, type, quantity, notes });
      return { id: Date.now(), stock_id: stockId, type, quantity, notes };
    }

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/movements`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ stock_id: stockId, type, quantity, notes })
      });
      if (res.ok) {
        const [result] = await res.json();
        return result;
      }
    } catch (e) {
      console.error('Failed to record movement:', e);
    }
    return null;
  }
};

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.SupabaseAPI;
}
