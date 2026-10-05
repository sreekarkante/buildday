# BuildDay 🚀

A modern, high-conversion registration engine and gamified launchpad for campus AI workshops. Built to handle everything from lead capture and referral tracking to real-time analytics and dynamic project matching.

## 🌟 Key Features

* **Gamified Referrals (Campus Battle):** Integrated referral system with threshold-based rewards and a live public leaderboard ranking individuals and colleges.
* **Multi-Step Funnel Registration:** Frictionless onboarding with tracking for views, starts, and completions.
* **Admin Analytics Dashboard:** Role-based protected routes featuring real-time daily pacing, channel source breakdown, and top-down funnel metrics.
* **Project Matcher:** Interactive questionnaire that recommends personalized AI projects based on student branch, experience, and interests.
* **Secure Architecture:** Built on Next.js 14 App Router with Supabase PostgreSQL (utilizing strict Row Level Security).

## 🛠 Tech Stack

* **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL)
* **Charts:** [Recharts](https://recharts.org/)
* **Language:** TypeScript

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/sreekarkante/buildday.git
cd buildday
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file and fill in your credentials:
```bash
cp .env.local.example .env.local
```
*Note: You will need a Supabase project URL and Service Role Key.*

### 4. Database Setup
Run the SQL script located in `supabase/migration.sql` in your Supabase SQL Editor to instantly provision the schema, tables, seed data, and Row Level Security policies.

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---
*Built with ❤️ for student builders.*
