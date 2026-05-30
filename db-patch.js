
// test// Monkey-patch app to use real database instead of mock data
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


// ReceivePage - รับสารน้ำเข้าคลังกลางจากคลังยา
window.ReceivePage = function({ onNavigate }) {
  const { useState: uS } = React;
  const empty = { code: '', lot: '', exp: '', qty: 1 };
  const [form, setForm] = uS({ ...empty });
  const [saving, setSaving] = uS(false);
  const [history, setHistory] = uS([]);
  const [msg, setMsg] = uS(null);
  function flash(text, tone) { setMsg({ text, tone }); setTimeout(() => setMsg(null), 3000); }
  async function save(e) {
    e.preventDefault();
    if (!form.code||!form.lot||!form.exp||form.qty<1) { flash('กรุณากรอกข้อมูลให้ครบ','danger'); return; }
    setSaving(true);
    const fl = (window.FLUID_TYPES||[]).find(f=>f.code===form.code);
    const data = { code:form.code, name:fl?fl.name:form.code, type:form.code, ward:'central', lot:form.lot, exp:form.exp, qty:parseInt(form.qty)||1 };
    const r = await window.DBIntegration?.addStock?.(data);
    setSaving(false);
    if (r) { setHistory(h=>[{...data,at:new Date().toLocaleTimeString('th-TH')},...h.slice(0,9)]); setForm({...empty}); flash('เพิ่มเข้าคลังกลาง '+data.qty+' ขวดเรียบร้อย','success'); window.loadStocksFromDB?.(); }
    else flash('เกิดข้อผิดพลาด ลองใหม่','danger');
  }
  const S = {
    wrap:{padding:'0 16px 80px',maxWidth:560,margin:'0 auto'},
    card:{background:'var(--surface)',borderRadius:16,padding:24,marginBottom:16,boxShadow:'0 1px 4px rgba(0,0,0,.08)'},
    lbl:{fontSize:13,fontWeight:600,color:'var(--text-2)',marginBottom:4,display:'block'},
    inp:{width:'100%',padding:'10px 12px',borderRadius:10,border:'1.5px solid var(--border)',background:'var(--surface-2)',fontSize:15,boxSizing:'border-box'},
    btn:{padding:'12px 28px',borderRadius:10,border:'none',background:'var(--accent)',color:'#fff',fontWeight:700,fontSize:15,cursor:'pointer'}
  };
  return (
    <div style={S.wrap}>
      <div style={{padding:'20px 0 8px'}}><h2 style={{margin:0,fontSize:22,fontWeight:700}}>รับสารน้ำเข้าคลังกลาง</h2><p style={{margin:'4px 0 0',color:'var(--text-2)',fontSize:13}}>บันทึกสารน้ำที่รับมาจากคลังยา เข้าสต็อก SEMI SX / คลังกลาง</p></div>
      {msg&&<div style={{padding:'12px 16px',borderRadius:10,marginBottom:12,background:msg.tone==='success'?'#d1fae5':'#fee2e2',color:msg.tone==='success'?'#065f46':'#991b1b',fontWeight:600}}>{msg.text}</div>}
      <form onSubmit={save} style={S.card}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
          <div style={{gridColumn:'span 2'}}><label style={S.lbl}>ชนิดสารน้ำ *</label><select style={S.inp} value={form.code} onChange={e=>setForm(p=>({...p,code:e.target.value}))}><option value="">-- เลือกชนิดสารน้ำ --</option>{(window.FLUID_TYPES||[]).map(f=><option key={f.code} value={f.code}>{f.name}{f.size?' ('+f.size+')':''}</option>)}</select></div>
          <div><label style={S.lbl}>Lot Number *</label><input style={S.inp} value={form.lot} placeholder="เช่น LOT2025001" onChange={e=>setForm(p=>({...p,lot:e.target.value}))}/></div>
          <div><label style={S.lbl}>วันหมดอายุ *</label><input style={S.inp} type="date" value={form.exp} onChange={e=>setForm(p=>({...p,exp:e.target.value}))}/></div>
          <div style={{gridColumn:'span 2'}}><label style={S.lbl}>จำนวน (ขวด) *</label><input style={{...S.inp,width:120}} type="number" min="1" max="9999" value={form.qty} onChange={e=>setForm(p=>({...p,qty:e.target.value}))}/></div>
        </div>
        <button type="submit" style={S.btn} disabled={saving}>{saving?'กำลังบันทึก...':'✅ บันทึกรับเข้า'}</button>
      </form>
      {history.length>0&&<div style={S.card}><div style={{fontWeight:700,marginBottom:12}}>รายการที่บันทึกในเซสชันนี้</div><table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}><thead><tr style={{color:'var(--text-2)'}}><th style={{textAlign:'left',paddingBottom:6}}>ชนิด</th><th>Lot</th><th>หมดอายุ</th><th style={{textAlign:'right'}}>จำนวน</th></tr></thead><tbody>{history.map((h,i)=><tr key={i} style={{borderTop:'1px solid var(--border)'}}><td style={{padding:'6px 0'}}>{h.name}</td><td style={{textAlign:'center'}}>{h.lot}</td><td style={{textAlign:'center'}}>{(h.exp||'').split('-').reverse().join('/')}</td><td style={{textAlign:'right',fontWeight:700}}>{h.qty}</td></tr>)}</tbody></table></div>}
    </div>
  );
};
console.log('✅ ReceivePage ready');
