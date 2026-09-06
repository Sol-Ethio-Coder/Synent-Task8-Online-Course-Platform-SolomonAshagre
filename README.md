# 🎓 Sol Tutoring And Coding Academy (STCA)

**Task 8 — Full-Stack Online Course Platform**

A full-stack platform where students can browse and enroll in coding courses (and tutoring
programs), pay securely via **Chapa** — including Telebirr, CBE Birr, HelloCash, and card — work
through modules and lessons with video playback and progress tracking, and where admins can manage
course content, users, and enrollments.

🔗 **Live Demo:** _add your deployed frontend URL here_
🔗 **API:** _add your deployed backend URL here_

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React (Vite), Tailwind CSS, Framer Motion, React Router, Axios |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT, bcrypt password hashing |
| Payments | Chapa (Test Mode) — Telebirr, CBE Birr, HelloCash, card |
| Email | Nodemailer |

## 📁 Project Structure

```
stca-platform/
├── client/                 # React frontend (Vite)
│   ├── public/favicon.svg
│   └── src/
│       ├── api/            # Axios instance with JWT interceptor
│       ├── components/     # Navbar, Footer, CourseCard, ProgressBar, RouteGuards
│       ├── context/        # AuthContext
│       └── pages/          # All routed pages, incl. PaymentCallback
└── server/                 # Express + MongoDB backend
    └── src/
        ├── config/db.js
        ├── models/         # User, Course, Enrollment
        ├── middleware/auth.js
        ├── controllers/    # auth, course, enrollment (Chapa), progress, admin
        ├── routes/
        └── utils/          # email, JWT, admin seed script
```

## ✨ Features implemented

**Authentication**
- Register / login with JWT
- Email verification (link sent on registration)
- Forgot password / reset password via emailed token

**User dashboard**
- View all available courses
- Search + filter by category and level
- Course detail page (modules, lessons, price)

**Enrollment flow (Chapa)**
- Select course → Enroll Now → redirected to Chapa's hosted checkout page → user pays via Telebirr, CBE Birr, HelloCash, or card → redirected back → on success, course appears on dashboard
- Free courses skip payment and unlock instantly

**Learning system**
- Modules → lessons structure
- Video playback (embed URL per lesson — YouTube/Vimeo/hosted)
- Mark lessons complete
- Progress % automatically calculated and displayed
- **AI explanations & practice quizzes** (free, via Groq) — if a video won't play, or a student just wants a written explanation, they can generate an AI explanation plus 3 multiple-choice practice questions for any lesson with one click. Generated once per lesson, then cached in MongoDB — every future student sees the same cached content instantly, at zero extra API cost

**Admin panel**
- Add / edit / delete courses, with dynamic module and lesson editors
- View all registered users
- View all enrollments and payment status

**Data & notifications**
- Enrollment and payment records stored in MongoDB
- Email sent on registration and on successful enrollment

**Extras requested**
- Favicon
- Framer Motion animations throughout (hero, cards, page transitions, progress bars)
- Privacy Policy and Terms of Service pages (Chapa/ETB-aware)
- Developer credit in the footer, linking to [mistir.netlify.app](https://mistir.netlify.app/)
- **Homepage AI chatbot** — a floating chat widget (bottom-right, 💬) lets visitors ask about courses, pricing, and enrollment before signing up, powered by the same free Groq API. Public endpoint, stateless, rate-limited to 30 requests/15min per IP since it has no login in front of it

## 💳 How the Chapa payment flow works

Chapa is redirect-based, not a JS popup like some gateways:

1. Frontend calls `POST /api/enrollments/order` with the course ID.
2. Backend calls Chapa's `transaction/initialize` endpoint and gets back a `checkout_url`.
3. Frontend redirects the browser (`window.location.href`) to that URL — Chapa's own hosted page,
   where the user picks Telebirr, CBE Birr, HelloCash, or card.
4. After payment, Chapa redirects the user back to `CLIENT_URL/payment/callback?tx_ref=...`
   (the `return_url`), **and** separately calls your backend's `callback_url` webhook
   server-to-server to confirm the result.
5. Both paths call the same `finalizeIfPaid()` logic — it calls Chapa's `transaction/verify`
   endpoint, and only marks the enrollment paid (and adds the course to the user's dashboard) once.
   It's safe for both to fire; only the first one does anything.

### Testing the webhook locally

Chapa can't reach `localhost`, so for local dev either:
- Use a tunnel like [ngrok](https://ngrok.com) (`ngrok http 5000`) and set `SERVER_URL` in `.env`
  to the ngrok URL, or
- Skip the webhook during local testing — the `/payment/callback` page already calls
  `GET /api/enrollments/verify/:txRef` itself as a fallback, so enrollment still finalizes
  correctly even if the webhook never arrives.

## 🚀 Local Setup

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
# edit .env with your MongoDB URI, JWT secret, email SMTP creds, and Chapa test key
npm run dev
```

Optionally seed an admin account:

```bash
npm run seed:admin
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

The Vite dev server proxies `/api` requests to `http://localhost:5000` (see `vite.config.js`), so
no CORS setup is needed locally.

## 🔑 Environment Variables (server/.env)

See `server/.env.example` for the full list — you'll need:
- `MONGO_URI` — a MongoDB connection string ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier works well)
- `JWT_SECRET` — any long random string
- `EMAIL_HOST` / `EMAIL_USER` / `EMAIL_PASS` — SMTP credentials (Gmail App Passwords work for testing)
- `CHAPA_SECRET_KEY` — from your [Chapa dashboard](https://dashboard.chapa.co/) → Settings → API Keys (starts with `CHASECK_TEST-` in test mode)
- `SERVER_URL` — your backend's public URL, used to build the Chapa webhook callback
- `GROQ_API_KEY` — free key from [console.groq.com/keys](https://console.groq.com/keys), powers the AI lesson explanations/quizzes feature

The server boots fine without a Chapa key set — it's only required once a paid checkout is attempted.

## 🌐 Deployment

- **Frontend:** deploy `client/` to Vercel (framework preset: Vite). Set `VITE_API_URL` in Vercel's environment variables to your deployed backend URL + `/api` (e.g. `https://stca-platform.onrender.com/api`) — the client falls back to a relative `/api` path otherwise, which only works if frontend and backend share the same origin.
- **Backend:** deploy `server/` to a Node host that supports long-running processes — Render, Railway, or Fly.io all work well (Vercel's serverless functions are not ideal for an Express app with persistent MongoDB connections and a webhook endpoint)
- **Database:** MongoDB Atlas free tier — whitelist your host's outbound IP (or `0.0.0.0/0` if it doesn't have a static IP, common on free tiers)
- Update `CLIENT_URL` and `SERVER_URL` in the backend's env vars to your deployed URLs once live, so Chapa's redirect and webhook land in the right place

## 📝 Notes on scope

This is a complete, working full-stack scaffold covering every feature in the brief. A few things
worth knowing before going to production:
- Video lessons use an `<iframe>` embed URL (YouTube/Vimeo) rather than custom video hosting — swap in a service like Mux or Cloudinary if you need uploaded video files with DRM.
- Chapa's webhook payload isn't signature-verified in this scaffold (Chapa's webhook signing varies by account setup) — instead, both the webhook and the return page independently re-confirm status by calling Chapa's own `verify` endpoint, which is the safer source of truth either way.
- Admin creation is via a seed script, not a UI — this is intentional, so random users can't self-promote to admin.

## 👤 Credits

Built for **Sol Tutoring And Coding Academy (STCA)**.
Site by [Solomon Ashagre](https://sol-ethio-coder.netlify.app/).
