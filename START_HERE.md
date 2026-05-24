# 🚀 Stock IV – วิธีเริ่มต้น

## ✅ ทำเสร็จแล้ว (Local)
- ✓ React app พร้อม ทั้ง 5 หน้า
- ✓ Mock data (ทำงานเลยได้)
- ✓ Responsive (mobile/tablet/desktop)
- ✓ Barcode scanner

## 📋 3 ขั้นตอน Deploy ฟรี

### 1️⃣ Supabase Database (5 นาที)
- ไป https://supabase.com → Sign up
- Create project → copy URL + API key
- SQL Editor → paste schema (ดู DEPLOYMENT.md)

### 2️⃣ GitHub (2 นาที)
```bash
cd ~/สารน้ำ
git init
git add .
git commit -m "Stock IV"
# Push to GitHub (new repo, copy commands from GitHub)
```

### 3️⃣ Vercel (3 นาที)
- ไป https://vercel.com
- Import GitHub repo
- Add 2 env vars (SUPABASE_URL + SUPABASE_ANON_KEY)
- Deploy ✓

**ได้ live URL ตรงนั้นเลย** 🎉

---

## 📖 เอกสาร

- **DEPLOYMENT.md** — ขั้นตอนละเอียด (ทำตามเลย)
- **README.md** — Tech stack + file structure
- **supabase-client.js** — Database functions (พร้อมใช้)

---

## ⚡ Run Locally

```bash
python3 -m http.server 8724
# http://localhost:8724
```

ยังใช้ mock data ตอนนี้ — database จะเชื่อมต่อหลังจาก deploy

---

## 🔗 ฟรี Tier ใช้ได้ที่
- **Supabase**: 500 MB + 2 core CPU (อุตส่าห์โรงพยาบาล ทำได้)
- **Vercel**: Unlimited projects + bandwidth (โฮสต์ฟรี)

---

**ถัดไป:** เปิด DEPLOYMENT.md และทำตามขั้นตอน 🙌
