// Supabase integration for Stock IV
// Fetches and saves real data from Supabase

(function () {
    const SUPABASE_URL = window.SUPABASE_URL || '';
    const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';

   const isOnline = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

   window.DBIntegration = {
         // Fetch all stocks from database
         async getStocks(wardId = null, searchQuery = '') {
                 if (!isOnline) return window.STOCK || [];

           try {
                     let url = `${SUPABASE_URL}/rest/v1/stocks?select=*&order=id.desc`;

                   if (wardId && wardId !== 'all') {
                               url += `&ward_id=eq.${wardId}`;
                   }

                   const res = await fetch(url, {
                               headers: { 'apikey': SUPABASE_ANON_KEY }
                   });

                   if (res.ok) {
                               let stocks = await res.json();

                       // Filter by search query
                       if (searchQuery) {
                                     const q = searchQuery.toLowerCase();
                                     stocks = stocks.filter(s =>
                                                     s.name?.toLowerCase().includes(q) ||
                                                     s.code?.toLowerCase().includes(q) ||
                                                     s.lot_number?.toLowerCase().includes(q)
                                                                        );
                       }

                       // Map to mock data format
                       return stocks.map(s => ({
                                     id: s.id,
                                     code: s.code,
                                     name: s.name,
                                     type: s.type_code,
                                     ward: s.ward_id,
                                     lot: s.lot_number,
                                     qty: s.quantity || 0,
                                     exp: s.expiry_date,
                                     status: getStockStatus(s.expiry_date),
                                     notes: `Stock ID: ${s.id}`
                       }));
                   }
           } catch (e) {
                     console.error('Failed to fetch stocks:', e);
           }

           return window.STOCK || [];
         },

         // Add new stock
         async addStock(data) {
                 if (!isOnline) {
                           console.log('Mock: Would add stock', data);
                           return null;
                 }

           try {
                     const payload = {
                                 code: data.code,
                                 name: data.name,
                                 type_code: data.type,
                                 ward_id: data.ward,
                                 lot_number: data.lot,
                                 quantity: parseInt(data.qty) || 0,
                                 unit: 'ขวด',
                                 expiry_date: data.exp
                     };

                   const res = await fetch(`${SUPABASE_URL}/rest/v1/stocks`, {
                               method: 'POST',
                               headers: {
                                             'apikey': SUPABASE_ANON_KEY,
                                             'Content-Type': 'application/json',
                                             'Prefer': 'return=representation'
                               },
                               body: JSON.stringify(payload)
                   });

                   if (res.ok) {
                               const [result] = await res.json();
                               console.log('✅ Added to database:', result);
                               return result;
                   } else {
                               const err = await res.json();
                               console.error('DB error:', err);
                   }
           } catch (e) {
                     console.error('Failed to add stock:', e);
           }

           return null;
         },

         // Update stock
         async updateStock(id, data) {
                 if (!isOnline) {
                           console.log('Mock: Would update stock', id, data);
                           return null;
                 }

           try {
                     const payload = {
                                 code: data.code,
                                 name: data.name,
                                 type_code: data.type,
                                 ward_id: data.ward,
                                 lot_number: data.lot,
                                 quantity: parseInt(data.qty) || 0,
                                 expiry_date: data.exp
                     };

                   const res = await fetch(`${SUPABASE_URL}/rest/v1/stocks?id=eq.${id}`, {
                               method: 'PATCH',
                               headers: {
                                             'apikey': SUPABASE_ANON_KEY,
                                             'Content-Type': 'application/json',
                                             'Prefer': 'return=representation'
                               },
                               body: JSON.stringify(payload)
                   });

                   if (res.ok) {
                               console.log('✅ Updated in database');
                               return true;
                   }
           } catch (e) {
                     console.error('Failed to update stock:', e);
           }

           return false;
         },

         // Delete stock
         async deleteStock(id) {
                 if (!isOnline) {
                           console.log('Mock: Would delete stock', id);
                           return true;
                 }

           try {
                     const res = await fetch(`${SUPABASE_URL}/rest/v1/stocks?id=eq.${id}`, {
                                 method: 'DELETE',
                                 headers: { 'apikey': SUPABASE_ANON_KEY }
                     });

                   if (res.ok) {
                               console.log('✅ Deleted from database');
                               return true;
                   }
           } catch (e) {
                     console.error('Failed to delete stock:', e);
           }

           return false;
         },

         // Record movement (add/remove)
         async recordMovement(stockId, type, quantity, notes = '') {
                 if (!isOnline) {
                           console.log('Mock: Would record movement', { stockId, type, quantity, notes });
                           return true;
                 }

           try {
                     const res = await fetch(`${SUPABASE_URL}/rest/v1/movements`, {
                                 method: 'POST',
                                 headers: {
                                               'apikey': SUPABASE_ANON_KEY,
                                               'Content-Type': 'application/json'
                                 },
                                 body: JSON.stringify({
                                               stock_id: stockId,
                                               type,
                                               quantity,
                                               notes,
                                               created_by: 'User'
                                 })
                     });

                   if (res.ok) {
                               console.log('✅ Movement recorded');
                               return true;
                   }
           } catch (e) {
                     console.error('Failed to record movement:', e);
           }

           return false;
         },

         isOnline
   };

   // Helper: determine stock status based on expiry date
   function getStockStatus(expiryDate) {
         if (!expiryDate) return 'safe';

      const today = new Date();
         const expiry = new Date(expiryDate);
         const daysLeft = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));

      if (daysLeft < 0) return 'expired';
         if (daysLeft <= 30) return 'warning';
         if (daysLeft <= 180) return 'caution';
         return 'safe';
   }
})();
