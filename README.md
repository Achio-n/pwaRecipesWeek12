# Savorly — Recipe Saver PWA

Savorly is a Progressive Web App that lets users **create, read, update, and delete** (CRUD) recipe-like “tasks” both **online** and **offline**.  
Online data is stored in **Firebase Firestore**, while offline data persists in **IndexedDB** and is **automatically synchronized** when the app reconnects.

---

## Key Features

- **Installable PWA** (standalone, offline-capable via Service Worker)
- **Online storage** with Firebase Firestore
- **Offline storage** with IndexedDB (using the `idb` helper)
- **Automatic synchronization** of offline changes when back online
- **Materialize CSS** UI with responsive navigation and toasts for status/feedback

> Code references: UI/IndexedDB logic in `ui.js` (imports `idb`, bootstraps Materialize, CRUD & sync), Firebase CRUD in `firebaseDB.js` (Firestore).

---

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript, Materialize CSS
- **PWA:** Web App Manifest, Service Worker, Cache Storage API
- **Online DB:** Firebase **Firestore**
- **Offline DB:** IndexedDB (via `idb` module)
- **Tooling:** VS Code Live Server for local dev

---

##  Architecture & Data Model

### IndexedDB (Offline)
- Database: **`taskManager_v2`**
- Object store: **`tasks`**
- Key path: **`id`** (auto-increment for local-only rows)
- Indexes: `status`
- Each record includes a boolean **`synced`** flag used to decide if it needs uploading to Firebase when online.

### Firebase (Online)
- Collection: **`tasks`**
- CRUD implemented with Firestore SDK: `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`.

### ID Strategy & Sync
- When **offline**, new items are stored with an **id shaped like `temp-<timestamp>`** and `synced: false`.
- When the device comes **online**, items with `synced: false` are uploaded to Firebase:
  - New offline items get a **real Firebase ID** and the local temp row is replaced with the real ID and `synced: true`.
  - Edited items with a real ID are **updated** in Firebase and marked `synced: true` locally.
- The UI shows an **“unsynced” chip** next to items that haven’t been synced yet and removes it once synced.

---

## Online/Offline Detection & Events

- The app listens to `online`/`offline` events to:
  - Update a **sync indicator** banner,
  - Show Materialize toasts (“Back online…” / “You’re offline…”),
  - Kick off a **best-effort sync** when transitioning back online.

---


## Setup & Installation

1. Clone the repository:
   ```bash (Linux) or terminal (Windows)
   git clone https://github.com/Achio-n/pwaRecipesWeek12
   cd savorly

---

##  How to Run & Test

1. **First Clone then open** the repo in VS Code.
2. Start **Live Server** (e.g., `http://127.0.0.1:5501`).
3. Open in **Chrome** on your PC (localhost is secure for PWA/testing).
4. **Install** the app (Chrome → Install) and test **offline**:
   - DevTools → Network → **Offline** → Reload.
   - Confirm your app shell and cached assets load.
5. **CRUD testing**
   - **Online**: Add, edit, delete recipes → verify they appear in Firebase.
   - **Offline**: Add or edit; items show an “unsynced” badge → reconnect → items sync and badge disappears.
6. (Optional) **Lighthouse → PWA** audit to validate manifest, SW, and offline readiness.

> For iPhone install, you’ll need to serve over **HTTPS** (e.g., temporary deploy). For local development, Chrome/Edge on Windows is sufficient to validate PWA behavior.

---

##  Firebase Setup

1. In `firebaseDB.js`, **replace** the `firebaseConfig` with your project’s credentials (or keep the provided assignment project).
2. Ensure Firestore is **enabled** in the Firebase Console.
3. (Optional) Add security rules as appropriate for your demo/testing.

---

##  Code Guide

### UI & IndexedDB (`ui.js`)
- Imports:
  - `idb` helper via unpkg module
  - Firebase CRUD wrappers from `firebaseDB.js`
- Boot sequence:
  - Initialize Materialize components (sidenavs), load tasks, attempt sync, register SW.
  - Wire the “Add/Save” form button for create/update.
- IndexedDB:
  - `createDB()` sets up `taskManager_v2` with a `tasks` store.
  - `addTask()` writes to Firebase when online or to IndexedDB with a `temp-` id when offline.
  - `editTask()` updates Firebase when online (and marks local row `synced: true`) or updates IndexedDB offline (`synced: false`).
  - `deleteTask()` removes in Firebase if online and always removes from IndexedDB.
  - `loadTasks()` hydrates UI from Firebase (online) or from IndexedDB (offline).
  - `syncTasks()` finds unsynced rows and **adds/updates** them in Firebase, then updates local records with real IDs and removes the “unsynced” badge.
- UI helpers:
  - `displayTask()` renders cards and attaches edit/delete handlers.
  - `updateSyncUI()` shows “Online: saving to Firebase” vs “Offline: saving to device”.
  - `checkStorageUsage()` logs and displays quota usage.

### Firebase CRUD (`firebaseDB.js`)
- Initializes Firebase app and Firestore.
- **Create:** `addTaskToFirebase(task)` → returns `{ id, ...task }` (uses Firestore’s generated id).
- **Read:** `getTasksFromFirebase()` → returns array of `{ id, ...data }`.
- **Update:** `updateTaskInFirebase(id, updatedData)`.
- **Delete:** `deleteTaskFromFirebase(id)`.

---

##  Service Worker Notes

- The service worker should:
  - **Precache** core assets (HTML, CSS/JS, images, manifest, icons).
  - Use **cache-first** for static assets and a **navigation fallback** to `/index.html` when offline.
  - Bump the **cache version** after significant changes so clients pick up updates.

> If you update file paths or add new assets, also update the precache list in your service worker.

---

## Error Handling & UX

- Toasts report validation errors and success (“Task added/updated”, “Operation failed…”).
- Unsynced items display a visible **chip** until they sync successfully.
- Basic field validation for required inputs (e.g., title).

---

## Submission Checklist (Assignment Rubric)

- [x] **Firebase Integration:** CRUD to Firestore when online (unique IDs preserved).
- [x] **IndexedDB Integration:** CRUD offline, persisting across sessions.
- [x] **Sync Logic:** Auto-sync on reconnect; `temp-` IDs replaced by Firebase IDs; `synced` flag updated.
- [x] **Service Worker:** Caches essential assets and supports offline behavior.
- [x] **UI & Error Handling:** Forms/buttons for CRUD; toasts and badges for status.
- [x] **Testing:** Verified online/offline CRUD; data syncs on reconnect.
- [x] **Docs:** This README explains architecture, usage, and sync behavior.

---

##  Author
**Jesse Newberry** — INF 694G_VA_Mobile Web Development
## Final Side Note
**Reflection** I am astouned at how much this class has taught me so far. I have lived in a LAMP and .Net world but this experience has definitely broadened my expertise and experiences. Thank You Professor Muvva.

