// Monkey-patch app to use real database instead of mock data
// This runs after app-bundle.jsx loads

(function() {
  // Wait for app to load
  setTimeout(() => {
    // Override window.STOCK to fetch from database on demand
    let cachedStocks = null;
    let lastFetch = 0;

    Object.defineProperty(window, 'STOCK', {
      get: function() {
        return cachedStocks || [];
      },
      set: function(v) {
        cachedStocks = v;
      },
      configurable: true
    });

    // Hook React components to load from DB
    if (window.DBIntegration && window.DBIntegration.isOnline) {
      console.log('🔗 Database integration active — loading real data from Supabase');

      // Fetch initial stocks
      window.DBIntegration.getStocks().then(stocks => {
        window.STOCK = stocks;
        console.log(`✅ Loaded ${stocks.length} stocks from database`);
        // Trigger re-render by updating window.STOCK
        window.dispatchEvent(new CustomEvent('dbupdate'));
      });
    } else {
      console.log('📦 Using mock data (database not configured)');
    }
  }, 100);
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
