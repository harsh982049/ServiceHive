🧭 SlotSwapper — ServiceHive Full-Stack Internship Assignment

## 📘 Overview

**SlotSwapper** is a peer-to-peer calendar scheduling application that enables users to **exchange their time slots** with others.
Each user maintains a personal calendar of events and can mark any busy slot as *swappable*. Other users can then browse these available slots and request a swap — which the slot owner can accept or reject.

### 🧩 Core Idea

> “If I can’t attend my Tuesday 10 AM meeting, but you can’t do Wednesday 2 PM — let’s swap!”

This project was built as part of the **ServiceHive Software Development Internship** technical challenge.

---

## 🧱 Design Choices

| Layer          | Technology                                       | Reason                                         |
| -------------- | ------------------------------------------------ | ---------------------------------------------- |
| **Frontend**   | React + TypeScript                               | Reliable component model and type safety       |
| UI / Styling   | TailwindCSS + shadcn/ui + Sonner + Framer Motion | Rapid, accessible, modern design               |
| **Backend**    | Node.js + Express                                | Lightweight, async-friendly API server         |
| **Database**   | MongoDB Atlas (Mongoose)                         | Flexible document schema for events / requests |
| **Auth**       | JWT                                              | Stateless authentication                       |
| **State Mgmt** | React Query                                      | Automatic caching + real-time UI updates       |

### Additional Design Notes

* Used **Radix-based shadcn components** for consistent accessibility.
* Added a custom **Date + Time picker** (Calendar + Select) to improve UX.
* Implemented **atomic swap logic** using Mongoose transactions.
* UI features **dialog forms, hover animations, and gradient backgrounds** for clarity and appeal.

---

## ⚙️ Local Setup & Running Instructions

### 1️⃣ Prerequisites

* Node ≥ 18 .x
* npm (or yarn / pnpm)
* MongoDB Atlas account (free tier works fine)

---

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/ServiceHive.git
cd ServiceHive
```

---

### 3️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a file named **`.env`** inside the `backend/` folder:

```env
PORT=4000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/slotswapper?retryWrites=true&w=majority
JWT_SECRET=harsh123
CORS_ORIGIN=http://localhost:5173
```

> 🔐 Make sure `.env` is listed in `.gitignore` (do not commit it).

Then start the backend:

```bash
npm run dev
```

Expected output:

```
MongoDB connected
API running on http://localhost:4000
```

---

### 4️⃣ Frontend Setup

```bash
cd ../frontend
npm install
```

No `.env` needed for local runs (the API URL defaults to `http://localhost:4000`).
If you ever deploy, you can add:

```env
VITE_API_URL=https://your-backend-url.com
```

Start the dev server:

```bash
npm run dev
```

Now visit **[http://localhost:5173](http://localhost:5173)** — the app should load.

---

### 5️⃣ Test Flow

1. Sign up as two users (A and B).
2. Each creates a few events (defaults to **BUSY**).
3. Mark some as **SWAPPABLE**.
4. Check the **Marketplace** — A can see B’s slots and vice versa.
5. A requests to swap → B Accepts / Rejects → calendars update live.

---

## 🔌 API Endpoints

| Method         | Endpoint                 | Description                                         |         |
| :------------- | :----------------------- | :-------------------------------------------------- | ------- |
| **Auth**       |                          |                                                     |         |
| `POST`         | `/api/auth/register`     | Register a new user `{name, email, password}`       |         |
| `POST`         | `/api/auth/login`        | Login → returns `{token, user}`                     |         |
| **Events**     |                          |                                                     |         |
| `GET`          | `/api/events`            | List logged-in user’s events                        |         |
| `POST`         | `/api/events`            | Create new event `{title, startTime, endTime}`      |         |
| `PATCH`        | `/api/events/:id`        | Update status (`BUSY`, `SWAPPABLE`, `SWAP_PENDING`) |         |
| `DELETE`       | `/api/events/:id`        | Delete an event                                     |         |
| **Swap Logic** |                          |                                                     |         |
| `GET`          | `/api/swappable-slots`   | View other users’ swappable events                  |         |
| `POST`         | `/api/swap-request`      | Send swap request `{mySlotId, theirSlotId}`         |         |
| `POST`         | `/api/swap-response/:id` | Accept / Reject swap `{accept: true                 | false}` |

> ✅ Auth required for all except `/auth/register` and `/auth/login`.

---

## 🧪 Example Workflow (API)

1. `POST /auth/register` — create 2 users
2. `POST /events` — each user creates a BUSY event
3. `PATCH /events/:id` — mark them SWAPPABLE
4. `GET /swappable-slots` — list others’ swappable events
5. `POST /swap-request` — user A requests a swap
6. `POST /swap-response/:id` — user B accepts → slots swap owners

---

## 💡 Assumptions

* Each user can only swap **one slot for one slot** at a time.
* A slot marked `SWAP_PENDING` is temporarily unavailable for other swaps.
* JWTs are passed via `Authorization: Bearer <token>`.
* Backend and frontend run on **localhost** ports 4000 & 5173 respectively.

---

## 🧩 Challenges & Learnings

| Challenge                                   | Solution                                                   |
| ------------------------------------------- | ---------------------------------------------------------- |
| Synchronizing swap states across both users | Used Mongoose transactions to ensure atomic updates        |
| Handling preflight & CORS issues            | Defined explicit CORS options before Helmet in Express     |
| Fixing deprecated toasts                    | Migrated to **Sonner** (modern, simple API)                |
| Date-only picker limitations                | Implemented a custom **Date + Time picker**                |
| UI clipping & scroll bugs                   | Moved popovers to `position="popper"` and added ScrollArea |
| Making UI engaging                          | Added gradients, Framer Motion, dialogs & modern theming   |

---

## 🧰 Folder Structure

```
ServiceHive/
│
├── frontend/        # React + Vite + shadcn + Tailwind
│   ├── src/
│   │   ├── pages/   # Calendar, Marketplace, Requests, Auth
│   │   ├── components/
│   │   └── lib/
│   └── package.json
│
├── backend/         # Node + Express + Mongoose
│   ├── src/
│   │   ├── models/          # User, Event, SwapRequest
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── config/db.js
│   └── package.json
│
└── README.md
```

---

## 🧾 How to Verify (for Reviewers)

1. Clone repo → install → run both servers.
2. Register 2 users.
3. Create events → mark swappable.
4. One user requests a swap → other accepts.
5. Verify calendars update automatically (status → BUSY).
6. Check that rejected requests revert to `SWAPPABLE`.

---

## 📎 Postman Collection

You can import the Postman collection provided in
`/backend/postman/slotswapper_collection.json` (if included)
for quick endpoint testing.

---

## 🧑‍💻 Author

**Harsh Nilesh Shah**
Frontend + Backend Developer • Sardar Patel Institute of Technology
📧 [harshnshah264@gmail.com](mailto:harshnshah264@gmail.com)