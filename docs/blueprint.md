# **App Name**: ProsePortal

## Core Features:

- Document Dashboard: A centralized view displaying a list or grid of all saved Markdown documents, including their titles and last modified dates.
- New Document Creation: Ability to create new Markdown documents starting from a blank canvas or by pasting existing text, which is then saved to the platform.
- Markdown File Upload: Functionality to upload local .md files from the user's machine, using FileReader API to extract content and save it to the platform.
- Live Markdown Editor: An integrated side-by-side editor and live preview component utilizing Monaco Editor for input, Marked for parsing, DOMPurify for security, and GitHub Markdown CSS for styling.
- Dynamic Document Management: Load any selected document from the dashboard into the live editor and enable auto-saving or explicit saving of changes back to the platform.
- Document RESTful API: Backend endpoints (GET, POST, PUT, DELETE) to manage document data including id, title, content, and updated_at timestamps in the database.
- AI Content Suggestions Tool: An AI-powered tool to suggest document titles or summaries based on the current Markdown content being edited.
- Theme & Mode Toggling: A theme management system allowing users to switch between light mode, dark mode, and multiple color presets.
- RTL & Multi-lingual Rendering: Full support for Right-to-Left (RTL) languages like Arabic within the editor and previewer, including specialized font rendering.

## Style Guidelines:

- Dark Mode: Deep purplish-gray (#2A262E) background with soft violet-blue (#C0A8DD) interactive elements.
- Light Mode: Crisp off-white (#F5F5F7) background with deep indigo (#3F3D56) text for high legibility.
- Accent: Vibrant blue (#4C4CFF) for critical calls to action and active states.
- UI Font: 'Inter' (sans-serif) for clean readability across dashboard and menus.
- Editor Font: 'Source Code Pro' (monospace) for consistent character spacing in markdown and code blocks.
- Responsive multi-column layouts with adaptive Right-to-Left (RTL) support for Arabic language users.
- Minimalist, clean line icons to maintain a professional and functional aesthetic without visual clutter.
- Subtle transitions for theme switching and smooth loading states between the dashboard and editor views.