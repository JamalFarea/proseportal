import { Document } from "@/lib/types";

export const GUEST_USER_ID = "__guest__";

export const guestDocuments: (Document & { id: string })[] = [
  {
    id: "demo-1",
    title: "Welcome to ProsePortal",
    content: `# Welcome to ProsePortal 👋

**ProsePortal** is a modern markdown editor with AI-powered content suggestions, real-time cloud sync, and a distraction-free writing experience.

## Features

- **AI Content Enhancement** — Improve writing, fix grammar, change tone, or translate content
- **Markdown Preview** — See your rendered content side by side
- **Cloud Sync** — Your documents are saved and synced in real time
- **Dark Mode** — Easy on the eyes, day or night

## Quick Start

Try clicking the **Enhance** button in the toolbar above to see AI suggestions in action!

\`\`\`markdown
# This is markdown
**Bold** and *italic* text
- Lists
- Are
- Easy
\`\`\`

---

*This is a demo document. Sign in to create, edit, and save your own documents.*`,
    summary: "Welcome guide introducing ProsePortal features and markdown basics",
    updatedAt: Date.now(),
    userId: GUEST_USER_ID,
    folderId: "",
  },
  {
    id: "demo-2",
    title: "Project Proposal — AI Writing Assistant",
    content: `# Project Proposal: AI Writing Assistant

**Date:** 2026-06-17
**Status:** Draft

## Executive Summary

This proposal outlines the development of an AI-powered writing assistant integrated directly into our markdown editor. The assistant will help users improve clarity, fix grammar, adjust tone, and translate content across languages.

## Goals

1. Reduce editing time by 40%
2. Improve content quality scores
3. Support multilingual content creation

## Proposed Features

| Feature | Priority | Timeline |
|---------|----------|----------|
| Grammar correction | P0 | Q3 2026 |
| Tone adjustment | P1 | Q3 2026 |
| Arabic translation | P2 | Q4 2026 |

## Implementation

The assistant will use Genkit flows with Google's Gemini model:

\`\`\`typescript
const result = await aiEnhanceContent({
  content: markdownContent,
  enhanceType: "improve-writing",
});
\`\`\`

## Budget

- **Development:** 120 hours
- **API costs:** ~$50/month
- **Testing:** 30 hours

---

> *This is a demo document. Sign in to create, edit, and save your own documents.*`,
    summary: "Sample project proposal showcasing document structure and tables",
    updatedAt: Date.now(),
    userId: GUEST_USER_ID,
    folderId: "",
  },
  {
    id: "demo-3",
    title: "Mastering Markdown — A Quick Guide",
    content: `# Mastering Markdown

Markdown is a lightweight markup language that lets you write formatted text using a plain-text editor.

## Headers

\`\`\`
# H1
## H2
### H3
\`\`\`

## Text Formatting

- **Bold** — \`**text**\`
- *Italic* — \`*text*\`
- ~~Strikethrough~~ — \`~~text~~\`
- \`Inline code\` — \\\`code\\\`

## Lists

### Unordered
- Item one
- Item two
  - Nested item

### Ordered
1. First step
2. Second step

## Code Blocks

\`\`\`python
def hello():
    print("Hello, Markdown!")
\`\`\`

## Blockquotes

> This is a blockquote.
> It can span multiple lines.

## Tables

| Name | Role |
|------|------|
| Alice | Designer |
| Bob | Developer |

## Links & Images

[Visit ProsePortal](https://proseportal.vercel.app)

![Alt text](https://picsum.photos/400/200)

---

> *This is a demo document. Sign in to create, edit, and save your own documents.*`,
    summary: "Comprehensive markdown syntax reference with examples",
    updatedAt: Date.now(),
    userId: GUEST_USER_ID,
    folderId: "",
  },
  {
    id: "demo-4",
    title: "Technical Guide — REST API Documentation",
    content: `# REST API Documentation

## Base URL

\`\`\`
https://api.example.com/v1
\`\`\`

## Authentication

All requests require an API key in the header:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.example.com/v1/users
\`\`\`

## Endpoints

### List Users

\`\`\`http
GET /users
\`\`\`

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| page | number | No | Page number |
| limit | number | No | Results per page |

**Response:**

\`\`\`json
{
  "data": [
    {
      "id": "usr_123",
      "name": "John Doe",
      "email": "john@example.com"
    }
  ],
  "total": 42
}
\`\`\`

### Create User

\`\`\`http
POST /users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
\`\`\`

## Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 429 | Rate Limited |
| 500 | Server Error |

---

> *This is a demo document. Sign in to create, edit, and save your own documents.*`,
    summary: "Technical API documentation example with endpoints, auth, and error codes",
    updatedAt: Date.now(),
    userId: GUEST_USER_ID,
    folderId: "",
  },
  {
    id: "demo-5",
    title: "Sprint Planning — Meeting Notes",
    content: `# Sprint Planning — Week 25

**Date:** Monday, June 15
**Attendees:** Team Alpha
**Duration:** 60 min

## Agenda

1. Review previous sprint goals
2. Plan sprint backlog
3. Assign tasks

## Previous Sprint Review

| Task | Status | Notes |
|------|--------|-------|
| User auth | ✅ Done | Deployed to staging |
| Dashboard UI | ✅ Done | Waiting for review |
| Export feature | 🟡 In progress | Blocked on API |
| Dark mode | ❌ Not started | Moved to this sprint |

## Sprint Backlog

### High Priority

- [x] Fix login redirect bug
- [ ] Implement search
- [ ] Add pagination to document list

### Medium Priority

- [ ] Keyboard shortcuts
- [ ] Drag-and-drop folders

### Low Priority

- [ ] Custom themes
- [ ] Email notifications

## Action Items

- @alice: Finalize dashboard review by Wednesday
- @bob: Unblock export API by Friday
- @carol: Write tests for auth flow

## Notes

> "We should prioritize search before the next release — users are asking for it."

---

> *This is a demo document. Sign in to create, edit, and save your own documents.*`,
    summary: "Sprint planning meeting notes with task tracking and action items",
    updatedAt: Date.now(),
    userId: GUEST_USER_ID,
    folderId: "",
  },
  {
    id: "demo-6",
    title: "مرحباً — دليل التحرير بالعربية",
    content: `# مرحباً بك في بروسبورتال 🌍

**بروسبورتال** هو محرر نصوص ماركداون حديث، مدعوم بالذكاء الاصطناعي، ويتيح لك مزامنة المحتوى مع السحابة في الوقت الفعلي.

## المميزات

- **تحسين المحتوى بالذكاء الاصطناعي** — تحسين الكتابة، تصحيح القواعد، تغيير النبرة، أو الترجمة
- **معاينة ماركداون** — شاهد المحتوى منسقاً بجانب المحرر
- **مزامنة سحابية** — حفظ وتحديث تلقائي للمستندات
- **الوضع المظلم** — مريح للعين في النهار والليل

## تنسيق النصوص

\`\`\`markdown
# عنوان رئيسي
## عنوان فرعي

**نص غامق** و *نص مائل*

- قائمة غير مرقمة
- عنصر ثاني

1. عنصر مرقم
2. عنصر ثاني
\`\`\`

## مثال على النص العربي

هذا النص هو مثال لنص يمكن أن يستخدم في تصميم واجهة المستخدم. الهدف من استخدامه هو توضيح كيف سيبدو النص العربي في التطبيق.

> بروسبورتال يدعم اللغة العربية بالكامل، بما في ذلك الكتابة من اليمين إلى اليسار.

---

*هذه وثيقة تجريبية. سجل الدخول لإنشاء وتحرير وحفظ مستنداتك الخاصة.*`,
    summary: "دليل ترحيبي باللغة العربية يشرح مميزات بروسبورتال وتنسيق ماركداون",
    updatedAt: Date.now(),
    userId: GUEST_USER_ID,
    folderId: "",
  },
];

export function isGuestId(id: string): boolean {
  return id.startsWith("demo-");
}

export function getGuestDocument(id: string): (Document & { id: string }) | undefined {
  return guestDocuments.find(d => d.id === id);
}

export function isGuest(userId: string | undefined | null): boolean {
  return !userId || userId === GUEST_USER_ID;
}
