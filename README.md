# ProsePortal

A Vercel-inspired Markdown editor with AI assistance and Cloud Sync.

## Local Development

Once you have downloaded and unzipped the project, follow these steps to run it locally:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env.local` file in the root directory and add your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   GEMINI_API_KEY=your_google_ai_api_key
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Firebase Setup (Cloud)

1. **Authentication**: 
   - Go to **Authentication** in the Firebase Console.
   - Click **Sign-in method** and enable **Google**.
   - Add your local and preview domains to the **Authorized Domains** list.

2. **Database**: 
   - Go to **Firestore Database** in the Firebase Console.
   - Click **Create database** and select **Production mode**.
   - The security rules included in `firestore.rules` will protect your data.

## Features

- **Cloud Sync**: Documents and folders are saved to Firestore under `/users/{userId}/documents`.
- **AI Tools**: Generate professional titles and summaries using Gemini 2.5 Flash.
- **GitHub Dark Theme**: Aesthetic navy-gray palette (`#0d1117`).
- **Monaco Editor**: High-performance code editing with side-by-side preview.
- **Vercel Design**: Zero-radius corners and minimalist high-contrast typography.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI
- **Database/Auth**: Firebase Firestore & Auth
- **AI**: Google Genkit (Gemini 2.5 Flash)
- **Editor**: @monaco-editor/react
