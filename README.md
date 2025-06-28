# Daily Productivity Tracker 🌓

A **clean,  single-page productivity tracker** built with **React**, tracking your daily **productive vs non-productive time** using a **Check-In/Check-Out system and task-based session tracking**, with **HTML report generation** for your daily reflection and discipline.

---

## 🚀 Features

✅ **Check-In / Check-Out Toggle**  
Track your day with a single tap each morning and night, automatically calculating total awake time.

✅ **Productive vs Non-Productive Time**  
- Time spent on tasks = Productive Time.  
- Idle time while awake = Non-Productive Time.

✅ **Task Management**  
- Create, edit, delete tasks with title and description.  
- Only one running task at a time (auto-pause/resume for urgent tasks).  
- Pause and resume tasks seamlessly.

✅ **Reliable Local Storage**  
- **Primary storage**: localStorage (always works, no setup required)
- **Optional cloud sync**: Supabase PostgreSQL (for cross-device sync)
- **Offline-first**: Works perfectly without internet connection
- **No accounts required**: Anonymous usage with device-based identification

✅ **Daily HTML Report**  
Generate a clean HTML report with:
- Date and session details
- Total awake time
- Total productive time
- Total non-productive time
- Task history with durations
- Productivity percentage and insights

✅ **Dark Themed Dashboard**  
- Built with React + Tailwind + shadcn/ui.  
- Mobile-friendly, distraction-free interface.

✅ **Cross-Device Support (Optional)**  
- Data syncs automatically between devices when Supabase is configured
- Falls back gracefully to local storage if cloud sync is unavailable

---

## 🛠️ Tech Stack

- **React + Next.js** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** for clean, accessible components
- **localStorage** for primary data storage (always works)
- **Supabase** for optional cloud sync
- **PostgreSQL** for reliable cloud data storage
- **PWA manifest** for installable app experience

---

## 📲 Usage Flow

1️⃣ **Check-In when you wake up** (starts tracking).  
2️⃣ **Create tasks** you plan to do today.  
3️⃣ **Start a task** when working on it; pause if needed.  
4️⃣ **Check-Out before sleeping** (ends tracking).  
5️⃣ **Generate and download your HTML report** for your day.

---

## 🖤 Design Principles

- **Dark mode only** for day & night usability.
- **Offline-first** - works without internet connection
- **No setup required** - start using immediately
- Large, readable timers for glanceability.
- Clear color coding:
  - Productive (green)
  - Non-productive (yellow)
  - Cloud synced (green database icon)
  - Local storage (blue hard drive icon)
- Calming, minimalist dashboard layout.
- Touch-friendly and keyboard-accessible.

---

## ✨ Quick Start

### Option 1: Use Immediately (Recommended)
\`\`\`bash
git clone https://github.com/yourusername/daily-productivity-tracker.git
cd daily-productivity-tracker
npm install
npm run dev
\`\`\`

**That's it!** The app works immediately with local storage. No database setup required.

### Option 2: Add Cloud Sync (Optional)
If you want to sync data across multiple devices:

1. **Create a Supabase account** (free)
2. **Create a new project** in Supabase
3. **Run the SQL script**:
   - Go to Supabase Dashboard → SQL Editor
   - Copy and run the contents of `scripts/create-tables-manual.sql`
4. **Add environment variables**:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`
5. **Restart the app** - you'll see "Cloud Synced" status in the navbar

---

## 🔧 Storage System

### **Primary Storage: localStorage**
- ✅ Always works, no setup required
- ✅ Instant saves, no network delays
- ✅ Complete privacy, data stays on your device
- ✅ Works offline permanently

### **Optional Enhancement: Supabase Cloud Sync**
- 🌐 Sync data across multiple devices
- 🔄 Real-time synchronization
- 🛡️ Secure cloud storage
- 📱 Access from phone, tablet, desktop

### **Status Indicators**
- 🟢 **Database icon**: Cloud synced via Supabase
- 🔵 **Hard drive icon**: Local storage only
- 🟡 **WiFi off icon**: Offline mode

---

## 🔒 Privacy & Security

- **No personal information required**
- **Anonymous device identification**
- **Data stays local by default**
- **Optional cloud sync with encryption**
- **No tracking or analytics**
- **GDPR compliant**

---

## 🪐 Roadmap

- [x] Core timer and task management
- [x] HTML report generation
- [x] Dark theme design
- [x] Mobile-friendly layout
- [x] Local storage (primary)
- [x] Optional cloud sync with Supabase
- [x] Offline-first architecture
- [x] Real-time sync status indicators
- [ ] PWA service worker for true offline support
- [ ] Data export/import functionality
- [ ] Task categories and tags
- [ ] Weekly/monthly productivity charts

---

## 🎯 Perfect For

- **Digital minimalists** who want simple, effective tracking
- **Remote workers** tracking productivity from home
- **Students** managing study sessions and breaks
- **Freelancers** tracking billable vs non-billable time
- **Anyone** wanting to understand their daily time usage

---

**Start tracking your productivity in 30 seconds - no setup required!** 🚀
