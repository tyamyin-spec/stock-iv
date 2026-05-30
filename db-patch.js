// Monkey-patch app to use real database instead of mock data
// This runs after app-bundle.jsx loads

(function() {
  // Clear all mock data immediately
  window.STOCK = [];
  window.MOVEMENTS = [];
  window.USAGE_30D = [];
  window.USAGE_14D = [];
  window.STOCK_BY_WARD = [];
  window.STOCK_BY_TYPE = [];
  window.TYPE_USAGE_30D = [];
  window.TYPE_LEAST_30D = [];
  window.NOTIFICATIONS = [];
  window.REPORTS = [];

  console.log('🧹 Cleared all mock data');

  // Wait for app to load
  setTimeout(() => {
    // Hook React components to load from DB
    if (window.DBIntegration && window.DBIntegration.isOnline) {
      console.log('🔗 Database integration active — loading real data from Supabase');

      // Fetch initial stocks from database
      window.DBIntegration.getStocks().then(stocks => {
        window.STOCK = stocks;
                        // Compute STOCK_BY_WARD from loaded stocks (needed for dashboard KPIs)
                        const wardMap = {};
                        stocks.forEach(s => {
                                            const wId = s.ward || 'unknown';
                                            if (!wardMap[wId]) wardMap[wId] = 0;
                                            wardMap[wId] += (s.qty || 0);
                        });
                        window.STOCK_BY_WARD = Object.entries(wardMap).map(([id, qty]) => ({ id, qty }));
                        // Compute STOCK_BY_TYPE from loaded stocks
                        const typeMap = {};
                        stocks.forEach(s => {
                                            const tId = s.type || s.code || 'unknown';
                                            if (!typeMap[tId]) typeMap[tId] = { id: tId, name: s.name || tId, qty: 0 };
                                            typeMap[tId].qty += (s.qty || 0);
                        });
                        window.STOCK_BY_TYPE = Object.values(typeMap).sort((a, b) => b.qty - a.qty).slice(0, 10);
        console.log(`✅ Loaded ${stocks.length} stocks from Supabase`);

        // Force page reload/update
        window.dispatchEvent(new CustomEvent('dbupdate'));
        window.dispatchEvent(new Event('stocksUpdated'));

        // Trigger React re-render if possible
        if (window.location.href.includes('localhost') || window.location.href.includes('vercel.app')) {
          console.log('📊 Data updated - refresh page to see changes');
        }
      }).catch(err => {
        console.error('Failed to load from database:', err);
        window.STOCK = [];
      });
    } else {
      console.log('⚠️ Database not configured - running with empty data');
      window.STOCK = [];
    }
  }, 200);
})();

// Export for use in components
window.loadStocksFromDB = async (wardId = null, search = '') => {
  const stocks = await window.DBIntegration.getStocks(wardId, search);
  return stocks;
};

window.addStockToDB = async (data) => {
  return await window.DBIntegration.addStock(data);
};

window.updateStockInDB = async (id, data) => {
  return await window.DBIntegration.updateStock(id, data);
};

window.deleteStockFromDB = async (id) => {
  return await window.DBIntegration.deleteStock(id);
};
