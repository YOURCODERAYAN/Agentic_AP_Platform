# Agentic AP Platform (POC)

An enterprise-style AI-driven Accounts Payable automation platform — a proof-of-concept frontend simulating invoice intake, AI extraction, 3-way matching, exception handling, and approval workflows.

**Live Demo:** [https://agentic-ap-platform.vercel.app/](https://agentic-ap-platform.vercel.app/)

---
<img width="1905" height="913" alt="Screenshot 2026-07-26 140238" src="https://github.com/user-attachments/assets/5dbbdbff-a5a8-42a6-9cee-29d90fac8dfb" />


## 🚀 Setup & Run Instructions

### Prerequisites
- Node.js and npm installed on your machine

### Getting Started (Local Setup)

```bash
# 1. Clone the repository
git clone https://github.com/YOURCODERAYAN/agentic-ap-platform.git
cd agentic-ap-platform

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Then open **[http://localhost:5173](http://localhost:5173)** in your browser.

### Testing a Production Build (Optional)

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```
This serves the optimized `dist/` output at `http://localhost:4173`.

### Notes
- No environment variables, API keys, or backend setup are required — the entire app runs client-side with a simulated mock data layer.
- All data (invoices, exceptions, reviewers, escalations) resets on every page refresh, since it's held in memory rather than a persistent database.
- Enable the **"Simulate live status"** toggle in the sidebar to watch invoice stages auto-progress in real time.
- A **dark mode toggle** is available in the top navbar.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | React + TypeScript (Vite) |
| Styling | Tailwind CSS v4 |
| Server-state / Data Fetching | TanStack Query (React Query) |
| Client-state | Zustand |
| Routing | React Router |
| Charts | Recharts |
| Notifications | Sonner |
| Icons | Lucide React |

---

## 📐 Implementation Approach

### My Process
When I received the assessment document, the first step was to read through it carefully, end to end, spending roughly 30 minutes understanding the full scope before writing any code. From there, I did a mental mapping of the entire application — working out how the five screens related to each other, what data each one needed, and how actions on one screen should logically affect others.

To visualize this more concretely, I opened Figma and sketched out the layout and structure of the app before touching code — this helped me commit to a clear structure early rather than discovering layout problems mid-build.

Once the mental model felt solid, I moved into setup: installing dependencies and the required libraries (TanStack Query, Zustand, Recharts, React Router, Tailwind, etc.).

I then built the application in two distinct passes rather than trying to do everything at once:

1. **Structure first (UI only)** — I built out the full layout of every screen before wiring up any interactivity, specifically to catch layout issues (breakpoints, overflow, spacing) early while they were cheap to fix.
2. **Interaction and UX second** — Once the layouts were stable and nothing was visually breaking, I layered in the actual interactivity: state management, filters, modals, mutations, and the real-time simulation.

Throughout the build, I also deliberately paused to think through edge cases and potential failure points before they became bugs — for example, what a screen should show when data is empty, what happens if an invoice has no extracted fields yet, and how mismatched data (like invoice vs. PO vs. GRN line items) should be visually flagged.

For styling specifics and some implementation patterns, I used AI assistance as a supporting tool throughout the process — similar to referencing documentation or established patterns — while making the architectural and design decisions myself.

### Building the Mock API Layer
Since the assessment required simulating a real backend without an actual server, I spent time thinking through how to structure this properly rather than taking a shortcut. My first instinct was to declare one single API function that returned all the mock data at once — but I realized that wouldn't reflect how a real backend actually behaves, where different screens call different, purpose-specific endpoints.

So instead, I designed the mock API layer the way a real one would be structured: **five separate API files, one per screen** (`invoices`, `workbench`, `matching`, `exceptions`, `dashboard`), each exposing its own set of functions that mimic real REST endpoints. Each function reads from and mutates a single shared mock dataset, so that every screen's endpoint reflects the same underlying source of truth rather than isolated hardcoded copies.

To speed up generating realistic sample data (invoices, vendors, GST numbers, exceptions, escalations), I used AI assistance to help define a representative dataset quickly. Once in place, I connected everything to the UI using **TanStack Query**, wrapping each API function in `useQuery`/`useMutation` hooks — giving every screen proper caching, loading states, and automatic refetching on mutation, the same as it would work against a real backend.

### Understanding and Implementing Zustand for the Live-Status Simulation
When I first read the requirement for a "client store that auto-advances mock invoice statuses," my initial understanding was unclear — I assumed Zustand needed to be used as a global state manager across the *entire* application. This felt confusing, especially since I was also managing server-state through TanStack Query at the same time.

Rather than get stuck on this early, I set it aside temporarily and continued building the parts of the application I could approach more confidently — the screen layouts, filters, and static UI.

Once those were complete, I came back with a clearer head and, with the help of AI assistance, understood that Zustand wasn't meant to replace all application state — it was needed for **one narrow purpose**: powering the "Simulate live status" toggle and the timer behind it.

The final implementation uses a small, dedicated Zustand store (`liveStatusStore`) that:
- Holds a boolean (`isLive`) representing whether the simulation is running
- Starts a `setInterval` (every 2.5s) when toggled on
- Randomly advances one invoice to its next pipeline stage on each tick
- Clears the interval when toggled off

### Understanding the Application's Overall Flow
Beyond building each screen individually, I wanted to understand how the five screens connect as one coherent system. I used AI assistance to get a clearer picture of how an Accounts Payable automation platform actually functions end-to-end — how an invoice realistically moves through Received → Extraction → Matching → Human Review → Approval → Payment, touching each screen along the way.

This understanding directly shaped how I connected the screens — for example, clicking "View" on an invoice row in the Inbox navigates directly to that specific invoice's AI Workbench via a dynamic route (`/invoices/:invoiceId`), rather than the Workbench existing as an isolated screen.

### Technical Architecture

**How data actually moves through the app:**
```
mocks/  →  api/  →  queries/  →  pages/ (and components/)
```
- **`mocks/`** — the single source of truth; one file holding every invoice, exception, escalation, and reviewer
- **`api/`** — simulated backend functions (one file per screen), each mimicking a real endpoint with an artificial delay
- **`queries/`** — wraps each API function in TanStack Query's `useQuery`/`useMutation`, giving every screen caching, loading states, and automatic refetching
- **`pages/`** — only talks to `queries/`, never directly to `mocks/` or `api/`

**Two kinds of state, two different tools:**
- **TanStack Query** owns anything conceptually "server data" — invoices, exceptions, escalations, reviewers
- **Zustand** owns purely client-side, cross-app UI state — the live-status toggle and dark mode toggle

**Routing:** All five screens sit behind a shared `AppLayout` (navbar + sidebar rendered once, content swapped via `<Outlet />`). The AI Workbench and Matching Workbench read `:invoiceId` from the URL for deep-linking from the Inbox.

**Where AI assistance fit in:** I used an AI coding assistant throughout the build — not to write the application for me, but to debug errors and syntax issues, write repetitive boilerplate (the pattern of API functions and hooks repeated across five screens), and get a second opinion on whether an approach followed good practice before committing to it. The decisions on what to build and how to structure it were mine; the assistant helped me move faster and catch mistakes along the way.

---

## 📸 Screenshots

### 1. Dashboard
<!-- Add screenshot here -->
<img width="1902" height="915" alt="Screenshot 2026-07-26 135159" src="https://github.com/user-attachments/assets/8de77254-0ca2-49fc-a499-27d60a2401ea" />


### 2. Invoice Inbox
<!-- Add screenshot here -->
<img width="1905" height="911" alt="Screenshot 2026-07-26 135302" src="https://github.com/user-attachments/assets/6507e9bc-f8eb-48a0-9e01-e16e0088dcc1" />


### 3. AI Workbench
<!-- Add screenshot here -->
<img width="1904" height="910" alt="Screenshot 2026-07-26 135417" src="https://github.com/user-attachments/assets/b6745bd1-c8a9-4ba1-9910-6ede2d74b795" />


### 4. Matching Workbench
<!-- Add screenshot here -->
<img width="1907" height="912" alt="Screenshot 2026-07-26 124531" src="https://github.com/user-attachments/assets/fba21dc6-6cf0-43a1-b3d5-b85ea7f0c0b5" />


### 5. Exception Management
<!-- Add screenshot here -->
<img width="1903" height="908" alt="Screenshot 2026-07-26 124643" src="https://github.com/user-attachments/assets/077bf765-2348-4d7b-b738-644ace739900" />



### 6.Notification SidePanel
<img width="1904" height="911" alt="Screenshot 2026-07-26 135740" src="https://github.com/user-attachments/assets/0b6d6ef1-18a8-4f85-a681-39fb6b604c48" />


---

## 📝 Assumptions, Challenges & Improvements

### Assumptions
- The spec described invoice pipeline stages slightly differently in two separate places (Received → Extracted → Matched → Approved → Paid under the Dashboard funnel, vs. Uploaded → Processing → OCR Complete → Human Review → Approved under the live-simulation requirement). I treated these as describing the same underlying pipeline and standardized on one consistent set of stage names across the entire application.
- The "Global Search bar" and Inbox "Exception Type" filter were listed without detail on expected search/filter behavior. Given the ambiguity and time constraints, I prioritized the explicitly detailed multi-field filters (Invoice #, Vendor, Status, Amount Range, Date Range, Match Status) and left the global search bar and exception-type filter present in the UI but not functionally wired.
- The application was built desktop-first. Given this simulates an enterprise operational tool (similar to real-world AP/ERP platforms, typically desktop-only in practice) and the spec made no mention of mobile requirements, responsive design was intentionally out of scope.
- The Matching Workbench currently defaults to displaying one specific invoice's reconciliation data rather than being dynamically linked to a selected invoice from the Inbox, since only that invoice was seeded with full mock line-item data.
- The "Simulate live status" toggle updates invoice stages as reflected in the Inbox table, but this change is not consistently propagated to other screens that derive data from the same invoices (such as the Dashboard's KPI counts and charts), since the simulation writes directly to the query cache rather than the underlying mock dataset both layers ultimately read from.

### Challenges
- Understanding the intended scope of Zustand (a single, narrow use case — the live-status timer — rather than a full application-wide state manager) took some initial back-and-forth before it clicked.
- Configuring Tailwind CSS v4's dark mode support proved more difficult than expected. Using the documented `@custom-variant` syntax caused the entire stylesheet to fail silently, with no console error, reverting the whole application to unstyled HTML. I resolved this by switching to the simpler `@variant` directive instead, which correctly enabled class-based dark mode without breaking the build.
- The shadcn/ui CLI repeatedly failed to initialize in my local environment (workspace config errors that persisted across path changes and version fallbacks). Rather than continue troubleshooting a tooling issue, I used the `sonner` library directly, which the assessment explicitly allowed as an equivalent option.
- Designing the mock API layer required more thought than initially expected — my first instinct was to declare one function returning all the data, but I realized this wouldn't reflect how a real backend is structured. Working through this with AI assistance helped me settle on five separate API files, each correctly wrapped in TanStack Query's `useQuery`/`useMutation` hooks so caching, loading states, and cache invalidation all worked consistently.
- Given the five-screen scope within the assessment's timeframe, I made deliberate prioritization decisions — for example, building Reassign and Archive actions on the Exceptions screen as functional UI without full backend-style persistence, since the spec only explicitly required a modal for the Resolve action.

### Improvements (With More Time)
- Make sure every action on every screen properly updates all the other screens that depend on that data — this currently works well for exception resolution, but I'd extend the same pattern everywhere (e.g. Matching Workbench actions reflecting on the Dashboard and Inbox immediately).
- Connect the live-status simulation properly so that turning it on updates the Dashboard and every other screen, not just the Inbox — by having it update the actual shared data source instead of just one screen's cache.
- Link the Matching Workbench to whichever invoice is selected from the Inbox, using the same route-based approach used for the AI Workbench, instead of defaulting to one fixed invoice.
- Make the global search bar actually work — searching and jumping to results across invoices.
- Build out the User Profile section properly with its own dedicated route/page, instead of just a dropdown placeholder.
- Add real persistence for the Reassign and Archive actions on the Exceptions screen.
- Go through the components and pages one more time to polish spacing, consistency, and small visual details across all five screens.
- Add a proper responsive layout so the app works well on smaller screens too.

---

## 📂 Project Structure

```
src/
├── api/           # Simulated backend functions (one file per screen)
├── data/         # Single source of truth mock dataset
├── queries/       # TanStack Query hooks wrapping api/ functions
├── store/         # Zustand stores (live-status simulation, theme)
├── pages/         # Screen components
├── components/    # Reusable UI pieces (charts, cards, layout)
├── types/         # Shared TypeScript interfaces
└── App.tsx        # Route definitions
```

---

Built as a take-home assessment for a Frontend Engineer role.
