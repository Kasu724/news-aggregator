# myNews – Personalized News Aggregator

**MyNews** is a Next.js + Supabase web application that fetches top headlines from [NewsAPI.org](https://newsapi.org), categorizes them via a custom NLP classifier, stores them in Supabase, and displays them in a responsive, YouTube‑style grid.  Users can search, browse by category, and click through to read full articles.  There is also a standard email/password + Google OAuth login flow powered by Supabase Auth.

---

## Tech Stack

- **Frontend & API**
  - [Next.js 15](https://nextjs.org) (app router, server components, client components)
  - [Tailwind CSS](https://tailwindcss.com) for utility‑first styling
  - NProgress for custom loading bar
  - React hooks & client components for search, user menu, etc.

- **Backend & Data**
  - [Supabase](https://supabase.com) (PostgreSQL) for articles storage, user management, and row‑level security
  - News fetch & upsert via Next.js API route `app/api/articles`
  - Custom ingest script `app/scripts/ingest.js` for NewsAPI ingestion

- **NLP Category Classification**
  - Python FastAPI service
  - Uses Hugging Face’s `classla/multilingual-IPTC-news-topic-classifier`
  - Exposes a `/classify` endpoint that labels “sports”, “politics”, “economy”, etc.

- **Authentication**
  - Supabase Auth (email/password + Google OAuth)
  - Client‑side login/signup pages in `app/auth/page.tsx`

---

## Features

- **Article Grid**
  - Responsive, dynamic grid
  - Thumbnail aspect‑ratio lock, skeleton loaders, smooth hover animations
  - Title trimmed to 3 lines + “…” + hover‑tooltip with full title
  - Publisher domain, category badge under each card

- **Search**
  - Header search bar (like YouTube) that shows articles similar to searched topic

- **Single‑Article View**
  - “Detail” page under `app/article/[id]/page.tsx`
  - Shows headline, publisher, full‑width image, description, and a “Read full article” button
  - Client‑side back button to grid instantly (route‑only change)

- **Authentication**
  - Global header shows “Login/Sign Up” or user avatar + dropdown when signed in
  - Protected client and API routes possible via Supabase RLS

- **Background Ingestion**
  - Python classifier service to run HuggingFace model
  - Can be run manually (`cd classifier-service; . .\venv\Scripts\Activate.ps1; python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload`)
  - `ingest.js` script pulls NewsAPI headlines, classifies them, and upserts into Supabase
  - Can be run manually (`node scripts/ingest.js`)
---

##  Quickstart (Local)

### 1. Clone & install

```bash
git clone https://github.com/your‑username/mynews.git
cd mynews
npm install
```

### 2. Supabase Setup
  1. Create a Supabase project
  2. In the SQL editor, create an `articles` table
  ```SQL
  create table public.articles (
    id serial primary key,
    title text not null,
    description text,
    url text unique not null,
    image_url text,
    published_at timestamptz,
    category text
  );
  ```
  3. Enable Row‑Level Security (RLS) on articles and add a permissive “INSERT” policy:
  ```SQL
  alter table public.articles enable row level security;
  create policy "public insert" on public.articles
    for insert using (true) with check (true);
  ```
### 3. Environment Setup
Create a .env.local in your project root:
```env
# NewsAPI
NEWSAPI_KEY=your_newsapi_org_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon-xxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=service-role-xxxxxxxxxxxxxx

# Hugging Face (if using HF API)
HUGGINGFACE_API_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxx

# Base URL for fetch calls
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```
### 4. Start Classification Service
```bash
# in app/classifier-service/
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install fastapi uvicorn transformers
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Run Ingestion
```bash
node scripts/ingest.js
```
This will:
1. Fetch top‑50 headlines

2. Call your local classifier service for each

3. Upsert into Supabase with category

### 6. Run development server
```bash
npm run dev
```
Open http://localhost:3000