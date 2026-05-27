// Supabase client initialization
// For browser (uses anon key)

(function () {
    const SUPABASE_URL = window.SUPABASE_URL || '';
    const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';

   if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
         console.warn('Supabase credentials not found. Using mock data. To enable database: set window.SUPABASE_URL and window.SUPABASE_ANON_KEY');
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

         // Add new stock
         async addStock(data) {
                 if (!SUPABASE_URL) return null;

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
                     if (res.ok) return await res.json();
           } catch (e) {
                     console.error('Failed to add stock:', e);
           }
                 return null;
         },

         // Update stock
         async updateStock(id, data) {
                 if (!SUPABASE_URL) return null;

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
                     if (res.ok) return await res.json();
           } catch (e) {
                     console.error('Failed to update stock:', e);
           }
                 return null;
         },

         // Delete stock
         async deleteStock(id) {
                 if (!SUPABASE_URL) return false;

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

         isOnline: !!(SUPABASE_URL && SUPABASE_ANON_KEY)
   };
})();
