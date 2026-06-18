# ProsePortal

A cloud-synced Markdown editor with AI-powered content enhancement, workspace sharing, and multi-theme support. Built with Next.js 16, Firebase, and Google Genkit (Gemini 2.5 Flash).

## Features

- **Markdown Editing** — Monaco Editor with live HTML preview (marked + DOMPurify)
- **Cloud Sync** — Real-time document persistence via Firestore with auto-save
- **AI Enhancement** — Improve writing, fix grammar, shorten/expand, change tone, translate (Arabic/English), generate title & summary via Gemini 2.5 Flash
- **Workspace Organization** — Folders, search/filter, .md file import (drag-and-drop)
- **Workspace Sharing** — Invite collaborators via email (Editor/Viewer roles) with EmailJS notifications
- **Guest Mode** — No signup required; 6 demo documents for preview
- **Multi-Theme** — 11 theme presets + custom branding (name, logo emoji, accent color)
- **RTL/Arabic Support** — Full right-to-left with IBM Plex Sans Arabic font
- **Dark/Light Mode** — System-level toggle

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui (Radix primitives)
- **Database/Auth**: Firebase Firestore & Auth (Google OAuth + Email/Password)
- **AI**: Google Genkit (Gemini 2.5 Flash)
- **Editor**: @monaco-editor/react
- **Icons**: lucide-react
- **Markdown**: marked + DOMPurify
- **Package Manager**: Bun

## Local Development

Requirements: [Bun](https://bun.sh) v1.3.14+

```bash
# Install dependencies
bun install

# Set up environment variables (see below)
cp .env.example .env.local

# Run development server
bun run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google AI (Genkit/Gemini)
GEMINI_API_KEY=your_google_ai_api_key
GOOGLE_GENAI_API_KEY=your_google_ai_api_key

# EmailJS (for workspace sharing invitations)
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key
```

## Firebase Setup

1. **Authentication** — Enable **Google** and **Email/Password** sign-in methods in the Firebase Console. Add your domains to the Authorized Domains list.
2. **Firestore Database** — Create a database in **Production mode**. See `firestore.rules` for security rules.
3. **Emulator** — Run `firebase emulators:start` for local Firestore emulator on port 8080.

## Scripts

| Script | Command |
|---|---|
| `bun run dev` | Next.js dev server on port 9002 (Turbopack) |
| `bun run build` | Production build |
| `bun run start` | Start production server |
| `bun run lint` | Next.js lint |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run test` | Jest test suite |
| `bun run genkit:dev` | Genkit flow development UI |

## Architecture

```
src/
├── app/              # Next.js App Router pages
│   ├── editor/[id]/  # Markdown editor
│   ├── login/        # Authentication
│   ├── settings/     # Theme & branding
│   └── api/invite/   # EmailJS invite endpoint
├── components/       # UI components (shadcn + custom)
├── lib/              # Types, store, utils, sharing logic
├── firebase/         # Firebase init, auth, Firestore helpers
├── ai/               # Genkit AI flows (server actions)
└── hooks/            # Custom React hooks
```

## Data Model

```
users/{userId}                    — Profile (email, displayName, photoURL)
users/{userId}/documents/{docId}  — Markdown documents
users/{userId}/folders/{folderId} — Organization folders
users/{userId}/workspace-members/ — Accepted workspace members
users/{userId}/shared-workspaces/ — Workspaces shared with this user
invites/{inviteId}                — Pending/accepted/declined invitations
```
