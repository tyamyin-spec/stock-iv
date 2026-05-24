# Stock IV – ระบบจัดการสารน้ำ

Medical IV fluid stock management system with **Dashboard, Inventory, Add/Log, Expiry Alerts, Reports**, and barcode scanning.

**Features:**
- 🏠 Dashboard — KPI cards, usage charts, expiry alerts
- 📦 Inventory — search, filter, sort, edit, delete
- ➕ Add/Log — 3-step wizard (type → details → confirm)
- ⚠️ Expiry Alerts — color-coded risk levels
- 📊 Reports — export (Excel/PDF/CSV), email scheduling
- 📷 Barcode Scanner — scan and auto-fill
- 📱 Responsive — desktop/tablet/mobile with tweaks panel

---

## Quick Start (Local)

```bash
cd ~/สารน้ำ
python3 -m http.server 8724
# Open http://localhost:8724
```

For now, uses mock data. To enable Supabase:

1. Create Supabase project (see `DEPLOYMENT.md`)
2. Set environment variables (local `.env.local` or Vercel dashboard)
3. Run the app

---

## Deployment to Vercel (Free)

See **`DEPLOYMENT.md`** for step-by-step guide.

### Quick summary:
1. Push to GitHub
2. Import project in Vercel
3. Add Supabase keys as environment variables
4. Deploy — get live URL

---

## Tech Stack

- **Frontend**: React 18 (CDN + in-browser Babel)
- **Styling**: CSS (medical clean, responsive)
- **Database**: Supabase PostgreSQL (free tier: 500 MB)
- **Hosting**: Vercel (free tier: unlimited projects)
- **Barcode**: Canvas-based mock scanner

---

## File Structure

```
.
├── index.html               # Main entry point
├── Stock IV.html            # Alternative entry (same content)
├── app-bundle.jsx           # All React components + UI in one file
├── data.js                  # Mock data + utilities
├── tweaks-panel.jsx         # Settings/demo panel
├── supabase-client.js       # Database API client
├── styles.css               # Main styles
├── styles-extra.css         # Additional styles
├── DEPLOYMENT.md            # Detailed deployment guide
└── package.json             # Project metadata (for Vercel)
```

---

## Environment Variables

For Vercel deployment, set:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon public key

Get these from Supabase → Settings → API

---

## Database Schema

**Tables:**
- `stocks` — IV fluid inventory (code, name, quantity, ward, expiry, etc.)
- `movements` — Add/remove history (stock_id, type, quantity, notes, timestamp)

See `DEPLOYMENT.md` for SQL to create tables.

---

## Support

- **Issues**: Check browser DevTools (F12) → Console
- **Database**: Debug in Supabase dashboard → SQL Editor → Browse tables
- **Deployment**: Check Vercel dashboard → Deployments → Logs

---

Made with ❤️ for medical stock management.
