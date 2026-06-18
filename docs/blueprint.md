# ProsePortal — Architecture & Feature Blueprint

## Core Features

- **Document Dashboard** — Grid/list view of all documents with titles, folders, and last modified dates.
- **Markdown Editing** — Monaco Editor (desktop) or textarea (mobile) with side-by-side live HTML preview via marked + DOMPurify.
- **Cloud Sync** — Real-time Firestore persistence with 2s debounce auto-save + manual "Deploy" save button.
- **File Import** — Drag-and-drop .md files; content extracted via FileReader API and saved to Firestore.
- **AI Enhancement** — 7 operations via Gemini 2.5 Flash: improve writing, fix grammar, make shorter/longer, change tone, translate Arabic/English. Also generates title & summary.
- **Workspace Sharing** — Invite collaborators via email (Editor/Viewer roles). Uses EmailJS for notification delivery. Read-only view for shared docs.
- **Guest Mode** — No authentication required. 6 demo documents pre-loaded for preview. Read-only editor.
- **Multi-Theme Library** — 11 presets (Vercel, Supabase, Claude, Neobrutalism, Zen, Mono, Notebook, Light Green, Astro Vista, WhatsApp, Default). Custom brand name, logo emoji, and accent color.
- **Dark/Light Mode** — System-aware toggle via CSS class on `<html>` element.
- **RTL & Arabic** — Auto-detect or manual RTL toggle. IBM Plex Sans Arabic font for Arabic text rendering.
- **Folder Organization** — Create/rename/delete folders. Filter documents by folder.

## Routing

| Route | Purpose |
|---|---|
| `/` | Dashboard — list, search, create, upload, delete documents |
| `/login` | Sign in / Sign up (Google OAuth + Email/Password) |
| `/editor/[id]` | Live Markdown editor with AI tools. `?owner=` param for shared docs |
| `/settings` | Theme library and branding customization with live preview |
| `/api/invite/send` | POST — sends workspace invitation email via EmailJS |

## State Management

- **React Context** — Firebase provider (`FirebaseProvider`), branding settings (`BrandingProvider`)
- **Firestore `onSnapshot`** — Real-time document listeners via `useDoc` and `useCollection` hooks
- **localStorage** — Fallback for branding settings when offline or in guest mode
- **EventEmitter** — Global Firebase permission error handling, surfaced as toast notifications via `FirebaseErrorListener`

## AI Architecture (Genkit)

- Integration: `@genkit-ai/googleai` plugin with `gemini-2.5-flash` model
- All AI flows implemented as Next.js **server actions** (`'use server'`)
- **`aiContentSuggestions`** — Analyzes markdown content, generates title + summary
- **`aiEnhanceContent`** — Applies one of 7 enhance types to content; translations create new docs (suffix appended), others replace in-place
- Dev tooling: `genkit start -- tsx src/ai/dev.ts` for local flow debugging

## Authentication Flow

1. **Guest users** — See dashboard with 6 demo documents; editor opens in read-only mode. Banner promotes sign-in.
2. **Authentication** — Firebase Auth with Google OAuth (`signInWithPopup`) and Email/Password (`signInWithEmailAndPassword` / `createUserWithEmailAndPassword`).
3. **Profile creation** — On first login, a profile document is created at `users/{uid}`.
4. **Sharing** — Invite email sent via EmailJS includes accept link. `InviteNotifications` component polls Firestore for pending invites matching user's email on login.
5. **Logout** — `signOut(auth)` called from Header dropdown menu.

## Data Model

```
users/{userId}
  └── documents/{docId}       — { title, content, summary, folderId, updatedAt, userId }
  └── folders/{folderId}      — { name, userId, createdAt }
  └── workspace-members/{uid} — { role, email, displayName, addedAt }
  └── shared-workspaces/{uid} — { role, ownerEmail, ownerName, addedAt }

invites/{inviteId}             — { ownerUid, ownerEmail, ownerName, invitedEmail, role, status, invitedAt }
```

## Sharing Flow

1. Owner opens ShareDialog from dashboard sidebar → enters email + selects role (editor/viewer)
2. Firestore document created at `invites/{inviteId}` with status `"pending"`
3. POST request to `/api/invite/send` sends email via EmailJS
4. Invitee receives email with link: `/login?accept_invite={inviteId}`
5. On login, `InviteNotifications` shows Accept/Decline popup
6. Accept → creates workspace-members + shared-workspaces records; invite status → `"accepted"`
7. Shared docs appear under "Shared With Me" in dashboard; loaded in read-only mode with `?owner={ownerUid}`

## Security (Firestore Rules)

- Documents: owner CRUD; workspace members can read; editors can create/update; only owner can delete
- Folders: owner read/write; members can read
- Workspace-members: owner write; owner + member can read
- Shared-workspaces: owner read/write
- Invites: authenticated users create; owner read/delete; invitee (matched by email) read/update

## Theme System

- 11 presets with varying background, foreground, accent, and border colors
- Custom branding: name, logo emoji, accent color override
- Settings stored at `users/{userId}/documents/settings` in Firestore
- Guest mode: settings persisted to localStorage
- Light/dark mode managed via `document.documentElement.classList` toggle (not next-themes)
