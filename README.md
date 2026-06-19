# Offnotes-frontend

Repo for the frontend of the OffNotes project.

## System Requirements

- Node.js v24+

## Installation

- ```bash
  npm install
  ```

## Development

Run dev server

- ```bash
  npm run dev
  ```

---

## How OffNotes Sync Works

### The Core Idea: Write Locally First, Sync Later

When you create, edit, or delete a note or folder, the app **immediately saves the change to a local database in your browser** (called IndexedDB, via a library called Dexie). You never have to wait for a server response — your action is instant.

At the same time, the app adds a "work order" to a **sync queue** — a list of things that still need to be sent to the server.

---

### The Sync Queue

Think of the sync queue like a **to-do list for the server**. Each item says things like:
- *"Create this folder on the server"*
- *"Update note #42 with this new content"*
- *"Delete folder #7"*

These queue items are also stored locally, so they survive a page refresh or browser close.

---

### When Does Syncing Happen?

- **When you come back online** — the app listens for the browser's `online`/`offline` events and automatically starts draining the queue the moment connectivity returns.
- **You can also force it** via `forceSync()`.

The app processes queue items **in order** (oldest first), one at a time. If one fails, it retries up to **3 times** before giving up and logging an error.

---

### The ID Problem (Local vs. Server IDs)

When you create something offline, it doesn't have a real server ID yet — so the app generates a temporary **local ID** (a timestamp + random string). Once the server successfully creates the record and returns a real ID, the local record gets updated with the server's ID. From that point on, updates and deletes use the server ID.

---

### Conflict Handling

If you edited a note offline, but someone else (or another device) also edited it on the server in the meantime, the app detects the conflict by comparing **commit versions**. It then shows you a **conflict modal** asking: *"Keep your local version, or use the server version?"* — and applies whichever you choose.

---

**TL;DR:** Every action saves locally and queues a server sync. When online, the queue drains automatically. Conflicts prompt you to choose a winner.
