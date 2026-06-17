import { Document } from "@/lib/types";

export const GUEST_USER_ID = "__guest__";

export const guestDocuments: (Document & { id: string })[] = [
  {
    id: "demo-1",
    title: "Welcome to ProsePortal",
    content: `# Welcome to ProsePortal

> **A modern markdown editor with AI-powered content suggestions, real-time cloud sync, and a distraction-free writing experience.**
> Supports Arabic and English — يدعم اللغة العربية.

---

## Table of Contents

- [Key Features](#key-features)
- [Quick Start Guide](#quick-start-guide)
- [Editor Layout](#editor-layout)
- [AI Enhancement Tools](#ai-enhancement-tools)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Markdown Reference](#markdown-reference)

---

## Key Features

| Feature | Description |
|---|---|
| AI Content Enhancement | Improve writing, fix grammar, change tone, or translate content |
| Live Markdown Preview | See rendered content side by side with the editor |
| Cloud Sync | Documents saved and synced in real time via Firebase |
| Dark Mode | Easy on the eyes, day and night |
| Multi-language | Full Arabic (RTL) support |
| Guest Mode | Try the app without signing up |

---

## Quick Start Guide

### 1. Create a Document

Click the **Create** button on the dashboard to start a new document.

### 2. Write in Markdown

\`\`\`markdown
# Document Title

**Bold text** and *italic text*

- List item one
- List item two
  - Nested item

1. Ordered item
2. Ordered item
\`\`\`

### 3. Use AI Enhancement

Select text or click the **Enhance** button in the toolbar to access:
- Improve Writing
- Fix Grammar
- Make Shorter / Longer
- Change Tone
- Translate to Arabic or English

### 4. Save & Sync

Your work is automatically saved to the cloud when you're signed in.

---

## Editor Layout

| Pane | Purpose |
|---|---|
| Toolbar | Title, AI tools, view mode, text direction, save |
| Editor (left) | Write markdown with syntax highlighting |
| Preview (right) | See rendered HTML output in real time |
| AI Dialog | Preview AI-generated changes before applying |

---

## AI Enhancement Tools

| Tool | Description |
|---|---|
| ✨ Improve Writing | Enhances clarity, flow, and readability |
| 📝 Fix Grammar | Corrects spelling, grammar, and punctuation |
| 📏 Make Shorter | Condenses content while preserving key info |
| 📖 Make Longer | Expands content with more detail |
| 🎭 Change Tone | Shifts to professional, formal, or casual tone |
| 🇸🇦 Translate to Arabic | Converts English content to Arabic |
| 🇬🇧 Translate to English | Converts Arabic content to English |

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| \`Ctrl + S\` | Save document |
| \`Ctrl + Shift + P\` | Toggle preview |
| \`Ctrl + B\` | Bold text |
| \`Ctrl + I\` | Italic text |

---

## Markdown Reference

### Headers

\`\`\`
# H1 — Document Title
## H2 — Section
### H3 — Subsection
#### H4 — Detail
\`\`\`

### Text Formatting

| Style | Syntax |
|---|---|
| Bold | \`**text**\` |
| Italic | \`*text*\` |
| Strikethrough | \`~~text~~\` |
| Inline Code | \`\`code\`\` |
| Link | \`[text](url)\` |

### Code Blocks

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Blockquotes

> This is a blockquote.
> It can span multiple lines.
>
> > Nested blockquotes work too.

### Tables

| Column A | Column B | Column C |
|---|---|---|
| Left | Center | Right |
| Data | Data | Data |

### Task Lists

- [x] Completed task
- [ ] Pending task
- [ ] Future task

---

> *This is a demo document. Sign in to create, edit, and save your own documents.*`,
    summary: "Welcome guide introducing ProsePortal features, shortcuts, and markdown reference",
    updatedAt: Date.now(),
    userId: GUEST_USER_ID,
    folderId: "",
  },
  {
    id: "demo-2",
    title: "Project Proposal — AI Writing Assistant",
    content: `# Project Proposal — AI Writing Assistant

> **Senior Product Proposal**
> ProsePortal Engineering Team
>
> **Date:** 2026-06-17
> **Status:** Draft v2.3

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [Problem Statement](#problem-statement)
- [Proposed Solution](#proposed-solution)
- [Feature Roadmap](#feature-roadmap)
- [Technical Architecture](#technical-architecture)
- [Implementation Phases](#implementation-phases)
- [Budget & Resources](#budget--resources)
- [Success Metrics](#success-metrics)
- [Risk Assessment](#risk-assessment)

---

## Executive Summary

This proposal outlines the development of an **AI-powered writing assistant** integrated directly into ProsePortal's markdown editor. The assistant will leverage Genkit flows with Google's Gemini model to provide real-time content improvements.

**Key Objectives:**

| Objective | Target | Timeline |
|---|---|---|
| Reduce editing time | 40% reduction | Q3 2026 |
| Improve content quality | +35% readability score | Q3 2026 |
| Multilingual support | 5 languages | Q4 2026 |

---

## Problem Statement

### Current Challenges

1. **Manual editing overhead** — Users spend 60% of their time editing and proofreading
2. **Inconsistent quality** — Content quality varies significantly across users
3. **Language barriers** — 30% of users need bilingual (Arabic/English) content
4. **Formatting errors** — 25% of documents have markdown formatting issues

### User Feedback

> "I spend more time formatting and proofreading than actually writing. An AI assistant would be a game-changer." — Beta User Survey, 2026

---

## Proposed Solution

### Core Features

| Feature | Priority | Complexity |
|---|---|---|
| Grammar & Spelling Fix | P0 | Medium |
| Writing Improvement | P0 | High |
| Tone Adjustment | P1 | High |
| Content Translation | P1 | Medium |
| Style Consistency | P2 | Low |

### Architecture Overview

\`\`\`typescript
// Example: AI enhancement flow
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const enhanceFlow = ai.defineFlow(
  {
    name: 'aiEnhanceContentFlow',
    inputSchema: z.object({
      content: z.string(),
      enhanceType: z.enum(['improve-writing', 'fix-grammar', 'make-shorter']),
    }),
    outputSchema: z.object({
      enhancedContent: z.string(),
      summary: z.string(),
    }),
  },
  async (input) => {
    const { output } = await ai.generate({
      model: gemini15Flash,
      prompt: \`Enhance this content: \${input.content}\`,
    });
    return { enhancedContent: output.text, summary: 'Content enhanced' };
  }
);
\`\`\`

---

## Feature Roadmap

### Phase 1 — Foundation (Q3 2026)

- [x] Text improvement engine
- [x] Grammar correction pipeline
- [x] Preview dialog UI
- [ ] User feedback collection

### Phase 2 — Expansion (Q4 2026)

- [ ] Arabic translation support
- [ ] Tone adjustment (professional, casual, formal)
- [ ] Content shortening and expansion
- [ ] Batch processing

### Phase 3 — Advanced (Q1 2027)

- [ ] Custom style guides
- [ ] Brand voice training
- [ ] Plagiarism detection
- [ ] API for third-party integrations

---

## Technical Architecture

\`\`\`
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Client App  │────▶│  Server Action │────▶│  Genkit Flow │
│  (Next.js)   │     │  (use server) │     │  (Gemini)    │
└──────────────┘     └──────────────┘     └──────────────┘
                            │                       │
                            ▼                       ▼
                    ┌──────────────┐     ┌──────────────┐
                    │  Prompt      │     │  Response    │
                    │  Template    │     │  Parser      │
                    └──────────────┘     └──────────────┘
\`\`\`

### Technology Stack

| Component | Technology |
|---|---|
| Frontend | Next.js 16 + Turbopack |
| AI Framework | Google Genkit |
| Model | Gemini 2.5 Flash |
| Storage | Firebase Firestore |
| Type Safety | Zod schemas |

---

## Budget & Resources

### Development Hours

| Role | Hours | Rate |
|---|---|---|
| Senior Engineer | 120 | $150/h |
| ML Engineer | 80 | $175/h |
| UI/UX Designer | 40 | $120/h |
| QA Engineer | 60 | $100/h |
| **Total** | **300** | |

### Operational Costs

| Item | Monthly Cost |
|---|---|
| Gemini API | ~$50 |
| Firebase | ~$25 |
| Monitoring | ~$15 |
| **Total** | **~$90** |

---

## Success Metrics

| Metric | Current | Target |
|---|---|---|
| User editing time | 12 min/doc | 7 min/doc |
| Grammar error rate | 8.5/100 words | 2/100 words |
| User satisfaction | 3.2/5 | 4.5/5 |
| Adoption rate | — | 60% of active users |

---

## Risk Assessment

| Risk | Impact | Mitigation |
|---|---|---|
| API latency > 2s | High | Streaming responses |
| Translation accuracy < 90% | Medium | Human review prompt |
| Cost overrun | Low | Usage quotas |
| Model hallucination | Medium | Strict output validation |

---

> *This is a demo document. Sign in to create, edit, and save your own documents.*`,
    summary: "Detailed project proposal for AI writing assistant with architecture, roadmap, budget, and risk assessment",
    updatedAt: Date.now(),
    userId: GUEST_USER_ID,
    folderId: "",
  },
  {
    id: "demo-3",
    title: "Technical Guide — System Architecture & API Design",
    content: `# Technical Guide — System Architecture & API Design

> **Lead Architect:** Engineering Team
> **Last Updated:** 2026-06-17
> **Version:** 3.1.0

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [API Specifications](#api-specifications)
4. [Database Schema](#database-schema)
5. [Authentication Flow](#authentication-flow)
6. [Error Handling](#error-handling)
7. [Performance Benchmarks](#performance-benchmarks)
8. [Deployment Guide](#deployment-guide)

---

## System Overview

The platform follows a **microservices architecture** with the following core services:

| Service | Responsibility | Tech Stack |
|---|---|---|
| Web App | Client-side rendering, editor UI | Next.js 16 |
| API Gateway | Request routing, auth, rate limiting | Next.js API routes |
| AI Service | Content enhancement, suggestions | Genkit + Gemini |
| Sync Service | Real-time document sync | Firebase Firestore |
| Storage Service | File uploads, assets | Firebase Storage |

---

## Architecture Diagram

\`\`\`
                           ┌──────────────┐
                           │   CDN       │
                           │ (Vercel)    │
                           └──────┬───────┘
                                  │
                           ┌──────▼───────┐
                           │  Next.js     │
                           │  App Router  │
                           └──┬───┬────┬──┘
                              │   │    │
                 ┌────────────┘   │    └────────────┐
                 ▼                ▼                 ▼
          ┌──────────┐    ┌──────────┐     ┌──────────────┐
          │ Firebase │    │  Genkit  │     │  Monaco      │
          │ Firestore│    │  Flows   │     │  Editor      │
          └──────────┘    └──────────┘     └──────────────┘
\`\`\`

---

## API Specifications

### Base URL

\`\`\`
https://api.proseportal.dev/v1
\`\`\`

### Authentication

All API requests require a bearer token:

\`\`\`bash
curl -H "Authorization: Bearer \${FIREBASE_TOKEN}" \\
  https://api.proseportal.dev/v1/documents
\`\`\`

### Endpoints

#### List Documents

\`\`\`http
GET /documents
\`\`\`

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| \`folderId\` | string | No | — | Filter by folder |
| \`limit\` | number | No | 20 | Results per page |
| \`offset\` | number | No | 0 | Pagination offset |
| \`sort\` | enum | No | \`updatedAt\` | Sort field |

**Response:**

\`\`\`json
{
  "data": [
    {
      "id": "doc_abc123",
      "title": "Project Proposal",
      "content": "# Markdown content...",
      "summary": "AI-generated summary",
      "updatedAt": 1718640000000,
      "folderId": "folder_xyz"
    }
  ],
  "pagination": {
    "total": 42,
    "limit": 20,
    "offset": 0
  }
}
\`\`\`

#### Create Document

\`\`\`http
POST /documents
Content-Type: application/json

{
  "title": "New Document",
  "content": "",
  "folderId": ""
}
\`\`\`

**Response:** \`201 Created\`

\`\`\`json
{
  "id": "doc_def456",
  "title": "New Document",
  "content": "",
  "updatedAt": 1718640000000
}
\`\`\`

#### Update Document

\`\`\`http
PATCH /documents/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "# New content..."
}
\`\`\`

**Response:** \`200 OK\`

---

## Database Schema

### Documents Collection

\`\`\`typescript
interface Document {
  id: string;
  title: string;
  content: string;
  summary?: string;
  updatedAt: number;
  folderId?: string;
  userId: string;
}
\`\`\`

### Folders Collection

\`\`\`typescript
interface Folder {
  id: string;
  name: string;
  userId: string;
  createdAt: number;
}
\`\`\`

### Indexes

| Collection | Fields | Purpose |
|---|---|---|
| documents | \`userId + updatedAt\` | Sort by recent |
| documents | \`userId + folderId\` | Filter by folder |
| folders | \`userId + createdAt\` | List folders |

---

## Authentication Flow

\`\`\`
1. User signs in via Firebase Auth (Google, Email, Anonymous)
2. Firebase returns ID token
3. Token sent with every API request
4. Server verifies token via Firebase Admin SDK
5. User ID extracted for document ownership

// Example: Token verification
const token = request.headers.authorization?.split(' ')[1];
const decoded = await admin.auth().verifyIdToken(token);
const userId = decoded.uid;
\`\`\`

---

## Error Handling

### Error Response Format

\`\`\`json
{
  "error": {
    "code": "DOCUMENT_NOT_FOUND",
    "message": "The requested document does not exist or you do not have access.",
    "status": 404
  }
}
\`\`\`

### Common Error Codes

| Code | HTTP Status | Description |
|---|---|---|
| \`UNAUTHORIZED\` | 401 | Missing or invalid authentication |
| \`FORBIDDEN\` | 403 | Insufficient permissions |
| \`NOT_FOUND\` | 404 | Resource does not exist |
| \`RATE_LIMITED\` | 429 | Too many requests |
| \`INTERNAL_ERROR\` | 500 | Server-side failure |

---

## Performance Benchmarks

| Operation | p50 | p95 | p99 |
|---|---|---|---|
| List documents | 120ms | 310ms | 520ms |
| Get document | 45ms | 110ms | 210ms |
| Save document | 80ms | 220ms | 410ms |
| AI enhancement | 1.2s | 2.8s | 4.5s |
| Auth verification | 60ms | 150ms | 280ms |

---

## Deployment Guide

### Prerequisites

- Node.js 22+
- Firebase project with Firestore enabled
- Gemini API key

### Environment Variables

\`\`\`bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# AI
GEMINI_API_KEY=

# App
NEXT_PUBLIC_BASE_URL=https://proseportal.vercel.app
\`\`\`

### Commands

\`\`\`bash
# Development
npm run dev

# Production build
npm run build
npm start

# AI development
npm run genkit:dev
\`\`\`

---

> *This is a demo document. Sign in to create, edit, and save your own documents.*`,
    summary: "Comprehensive system architecture guide covering API design, database schema, auth flow, and deployment",
    updatedAt: Date.now(),
    userId: GUEST_USER_ID,
    folderId: "",
  },
  {
    id: "demo-4",
    title: "Database Migration Plan — PostgreSQL to CockroachDB",
    content: `# Database Migration Plan — PostgreSQL to CockroachDB

> **Infrastructure Team Report**
> **Migration Window:** 2026-07-12 02:00–06:00 UTC
> **Status:** Approved for Execution

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [Current Architecture](#current-architecture)
- [Target Architecture](#target-architecture)
- [Migration Strategy](#migration-strategy)
- [Schema Changes](#schema-changes)
- [Rollback Plan](#rollback-plan)
- [Timeline](#timeline)
- [Risk Matrix](#risk-matrix)

---

## Executive Summary

Migrating from **PostgreSQL 15** (single-node) to **CockroachDB 24.1** (multi-region) to achieve:

- **99.995%** uptime (vs current 99.9%)
- **< 50ms** read latency globally (vs current 120ms)
- **Automatic horizontal scaling** without sharding
- **Multi-region disaster recovery**

| Metric | Current (PostgreSQL) | Target (CockroachDB) |
|---|---|---|
| Uptime SLA | 99.9% | 99.995% |
| Write latency (p95) | 45ms | 80ms |
| Read latency (p95) | 120ms | 35ms |
| Max connections | 500 | 10,000 |
| Storage | 500 GB SSD | 2 TB (auto-sharded) |

---

## Current Architecture

\`\`\`
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  App Server  │────▶│  PgBouncer   │────▶│  PostgreSQL  │
│  (us-east-1) │     │  (pooler)    │     │  (us-east-1) │
└──────────────┘     └──────────────┘     └──────────────┘
                                                   │
                                           ┌───────▼───────┐
                                           │  Read Replica │
                                           │  (eu-west-1)  │
                                           └───────────────┘
\`\`\`

### Current Limitations

1. **Single point of failure** — Primary node crash = downtime
2. **Manual sharding** — Tables manually partitioned by region
3. **Replica lag** — Read replicas have 2–5 second lag
4. **Connection limits** — 500 max connections causes blocking under load
5. **Backup window** — 4-hour nightly maintenance window

---

## Target Architecture

\`\`\`
                    ┌─────────────────────────────┐
                    │     CockroachDB Cluster     │
                    │                             │
                    │  ┌──────────┐ ┌──────────┐  │
                    │  │ Region 1 │ │ Region 2 │  │
                    │  │ us-east  │ │ eu-west  │  │
                    │  └──────────┘ └──────────┘  │
                    │         │        │          │
                    │  ┌──────▼────────▼──────┐   │
                    │  │      Region 3        │   │
                    │  │      ap-southeast    │   │
                    │  └─────────────────────┘   │
                    └─────────────────────────────┘
\`\`\`

### Key Improvements

- **Multi-active** — Any node can handle reads and writes
- **Auto-replication** — Data replicated across 3 regions by default
- **No replicas needed** — Built-in distributed consensus (Raft)
- **Horizontal scaling** — Add nodes without downtime

---

## Migration Strategy

### Phase 1: Schema Migration

\`\`\`sql
-- Existing PostgreSQL schema
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  summary TEXT,
  user_id UUID NOT NULL,
  folder_id UUID,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CockroachDB equivalent (with partitioning)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title STRING NOT NULL,
  content STRING NOT NULL DEFAULT '',
  summary STRING,
  user_id UUID NOT NULL,
  folder_id UUID,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
) LOCALITY GLOBAL;
\`\`\`

### Phase 2: Dual-Write

\`\`\`typescript
async function migrateDocument(doc: Document) {
  // Write to both databases during transition
  await Promise.all([
    postgres.insert(doc),    // Old PostgreSQL
    cockroach.insert(doc),   // New CockroachDB
  ]);
}
\`\`\`

### Phase 3: Cutover

| Step | Action | Duration |
|---|---|---|
| 1 | Stop writes to PostgreSQL | 1 min |
| 2 | Verify CockroachDB consistency | 5 min |
| 3 | Update connection strings | 2 min |
| 4 | Deploy new app config | 3 min |
| 5 | Monitor for errors | 15 min |

---

## Schema Changes

### Tables to Migrate

| Table | Rows | Size | Priority |
|---|---|---|---|
| \`documents\` | 1.2M | 4.5 GB | Critical |
| \`users\` | 45K | 120 MB | Critical |
| \`folders\` | 8K | 25 MB | High |
| \`sessions\` | 120K | 350 MB | High |
| \`audit_logs\` | 8.5M | 12 GB | Medium |

### Index Migration

\`\`\`sql
-- PostgreSQL index
CREATE INDEX idx_documents_user_id ON documents(user_id);

-- CockroachDB index (with hash sharding for better distribution)
CREATE INDEX idx_documents_user_id ON documents(user_id)
  USING HASH WITH BUCKET_COUNT = 16;
\`\`\`

---

## Rollback Plan

### Trigger Conditions

- Error rate exceeds 5% after cutover
- Write latency > 200ms for more than 5 minutes
- Data inconsistency detected in validation

### Rollback Steps

| # | Action | ETA |
|---|---|---|
| 1 | Enable PostgreSQL writes | 1 min |
| 2 | Switch connection strings | 2 min |
| 3 | Redeploy previous config | 3 min |
| 4 | Run data validation | 10 min |
| 5 | Declare rollback complete | — |

---

## Timeline

\`\`\`
Week 1-2: Schema migration & testing
Week 3:   Dual-write implementation
Week 4:   Performance validation
Week 5:   Staged rollout (10% → 50% → 100%)
Week 6:   PostgreSQL decommission
\`\`\`

---

## Risk Matrix

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Data loss during cutover | Low | Critical | Dual-write until verified |
| Increased write latency | Medium | High | Tune replication factor |
| Connection pool exhaustion | Low | Medium | Increase pool size |
| Schema incompatibility | Low | High | Comprehensive test suite |
| Query performance regression | Medium | High | Rewrite slow queries |

---

## Monitoring Plan

### Key Metrics

\`\`\`promql
# Query latency
rate(cockroachdb_sql_latency_seconds[5m])

# Replication lag
cockroachdb_replication_quorum

# Node health
up{job="cockroachdb"}

# Error rate
rate(cockroachdb_sql_errors_total[5m])
\`\`\`

### Alerting Thresholds

| Metric | Warning | Critical |
|---|---|---|
| Latency p99 | > 100ms | > 200ms |
| Error rate | > 1% | > 5% |
| Node down | 1 node | 2+ nodes |
| Replication lag | > 500ms | > 2s |

---

> *This is a demo document. Sign in to create, edit, and save your own documents.*`,
    summary: "Detailed database migration plan from PostgreSQL to CockroachDB with schema changes, rollback strategy, and risk matrix",
    updatedAt: Date.now(),
    userId: GUEST_USER_ID,
    folderId: "",
  },
  {
    id: "demo-5",
    title: "API Performance Benchmark — Load Testing Results",
    content: `# API Performance Benchmark — Load Testing Results

> **QA Engineering Report**
> **Test Date:** 2026-06-15
> **Test Suite:** k6 v0.54
> **Environment:** Staging (us-east-1)

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [Test Configuration](#test-configuration)
- [Scenarios](#scenarios)
- [Results by Endpoint](#results-by-endpoint)
- [Response Time Distribution](#response-time-distribution)
- [Error Analysis](#error-analysis)
- [Resource Utilization](#resource-utilization)
- [Recommendations](#recommendations)

---

## Executive Summary

Load testing performed on **12 API endpoints** across **4 scenarios** simulating real-world usage patterns.

| Metric | Result | Target | Status |
|---|---|---|---|
| Peak throughput | 2,450 req/s | 2,000 req/s | ✅ Pass |
| p95 latency | 210ms | 250ms | ✅ Pass |
| Error rate | 0.12% | < 1% | ✅ Pass |
| Concurrent users | 5,000 | 5,000 | ✅ Pass |

---

## Test Configuration

### Infrastructure

| Component | Specification |
|---|---|
| App instances | 4 × t3.medium (2 vCPU, 4 GB) |
| Database | db.r6g.large (2 vCPU, 16 GB) |
| CDN | CloudFront (us-east-1, eu-west-1, ap-southeast-1) |
| Load generator | 2 × c6i.xlarge (4 vCPU, 8 GB) |

### k6 Script Configuration

\`\`\`javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 1000 },  // Ramp up
    { duration: '5m', target: 5000 },  // Peak load
    { duration: '2m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<250', 'p(99)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get(
    'https://api.example.com/v1/documents',
    { headers: { Authorization: 'Bearer \${__ENV.TOKEN}' } }
  );
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
\`\`\`

---

## Scenarios

| Scenario | Description | Target RPS | Duration |
|---|---|---|---|
| Light Read | Browse documents, view editor | 500 | 10 min |
| Heavy Read | Search, filter, pagination | 1,500 | 10 min |
| Write Heavy | Create, save, update documents | 800 | 10 min |
| Mixed Workload | 70% read / 30% write | 2,000 | 15 min |

---

## Results by Endpoint

### Read Endpoints

| Endpoint | p50 | p95 | p99 | Max RPS |
|---|---|---|---|---|
| \`GET /documents\` | 45ms | 120ms | 210ms | 850 |
| \`GET /documents/:id\` | 28ms | 85ms | 150ms | 1,200 |
| \`GET /folders\` | 22ms | 65ms | 110ms | 1,500 |
| \`GET /search\` | 95ms | 245ms | 420ms | 400 |
| \`GET /users/me\` | 18ms | 55ms | 95ms | 2,000 |

### Write Endpoints

| Endpoint | p50 | p95 | p99 | Max RPS |
|---|---|---|---|---|
| \`POST /documents\` | 65ms | 180ms | 310ms | 350 |
| \`PATCH /documents/:id\` | 55ms | 160ms | 280ms | 400 |
| \`DELETE /documents/:id\` | 48ms | 140ms | 250ms | 300 |
| \`POST /folders\` | 35ms | 95ms | 170ms | 500 |

### AI Endpoints

| Endpoint | p50 | p95 | p99 | Max RPS |
|---|---|---|---|---|
| \`POST /enhance\` | 1,200ms | 2,800ms | 4,500ms | 25 |
| \`POST /suggest\` | 900ms | 2,100ms | 3,800ms | 30 |

---

## Response Time Distribution

### Mixed Workload Scenario

\`\`\`
Latency (ms)    Requests     Percent
─────────────────────────────────────
0–50            142,830      38.2%
51–100          135,210      36.1%
101–200         62,440       16.7%
201–500         28,110        7.5%
501–1000        4,520         1.2%
1000+           1,120         0.3%
─────────────────────────────────────
Total           374,230      100%
\`\`\`

### Key Observations

- **74.3%** of requests complete under 100ms
- **91%** of requests complete under 200ms
- **99.7%** of requests complete under 1 second
- AI endpoints dominate the > 1s latency bucket

---

## Error Analysis

### Error Breakdown

| Error Type | Count | Rate | Cause |
|---|---|---|---|
| 429 Rate Limited | 342 | 0.09% | Burst traffic exceeding per-IP limit |
| 500 Internal Error | 72 | 0.02% | Connection pool exhaustion at peak |
| 504 Gateway Timeout | 28 | 0.01% | AI endpoint timeout under load |
| **Total** | **442** | **0.12%** | |

### Timeline of Errors

\`\`\`
Error Rate (%)
    0.20 ┤                                    ╭─╮
    0.15 ┤                          ╭────╮    │ │
    0.10 ┤         ╭──╮            │    │    │ │
    0.05 ┤  ╭──────╯  ╰────────────╯    ╰────╯ ╰──
    0.00 ┼──────────────────────────────────────────▶
          0    2    4    6    8   10   12   14  Time(min)
\`\`\`

Peak error rate occurred at minute 7 during the connection pool exhaustion event.

---

## Resource Utilization

### Application Servers

| Metric | Average | Peak |
|---|---|---|
| CPU | 62% | 91% |
| Memory | 3.1 GB | 3.8 GB |
| Connections | 180 | 420 |
| File descriptors | 420 | 890 |

### Database

| Metric | Average | Peak |
|---|---|---|
| CPU | 45% | 78% |
| Connections | 120 | 280 |
| IOPS | 2,100 | 4,500 |
| Replication lag | 45ms | 120ms |

---

## Recommendations

### Immediate Actions

1. **Increase connection pool size** from 200 to 400 to prevent 500 errors
2. **Add rate limiting by user ID** (not just IP) for fair resource allocation
3. **Increase AI endpoint timeout** from 5s to 10s for large content

### Long-term Improvements

| Improvement | Impact | Effort |
|---|---|---|
| Implement response caching | -40% read latency | Medium |
| Add read replicas for AI service | -30% AI latency | High |
| Optimize database queries | -25% write latency | Medium |
| Upgrade to t3.large instances | -15% CPU pressure | Low |

---

> *This is a demo document. Sign in to create, edit, and save your own documents.*`,
    summary: "Load testing performance benchmark with response time distribution, error analysis, and infrastructure recommendations",
    updatedAt: Date.now(),
    userId: GUEST_USER_ID,
    folderId: "",
  },
  {
    id: "demo-6",
    title: "إدارة المشاريع — دليل منهجية أجايل",
    content: `# إدارة المشاريع — دليل منهجية أجايل

> **دليل فريق التطوير**
> **آخر تحديث:** ١٧ يونيو ٢٠٢٦
> **الإصدار:** ٢.١.٠

---

## فهرس المحتويات

- [نظرة عامة](#نظرة-عامة)
- [مبادئ أجايل](#مبادئ-أجايل)
- [هيكل الفريق](#هيكل-الفريق)
- [دورة العمل](#دورة-العمل)
- [السباقات (Sprints)](#السباقات-sprints)
- [قوالب الاجتماعات](#قوالب-الاجتماعات)
- [مؤشرات الأداء](#مؤشرات-الأداء)
- [الأدوات المستخدمة](#الأدوات-المستخدمة)

---

## نظرة عامة

**منهجية أجايل (Agile)** هي إطار عمل لإدارة المشاريع يعتمد على التطوير المتكرر والتسليم المستمر. يركز هذا الدليل على ممارسات **سكرِم (Scrum)** المطبقة في فريق التطوير.

### المبادئ الأساسية

| المبدأ | الوصف |
|---|---|
| التسليم المبكر | تسليم قيمة للعميل في أسرع وقت ممكن |
| التكيف مع التغيير | الترحيب بتغيير المتطلبات حتى في مراحل متأخرة |
| التعاون المستمر | تواصل يومي بين فريق التطوير وأصحاب المصلحة |
| التحسين المستمر | تقييم الأداء وتحسينه بشكل دوري |

---

## مبادئ أجايل

> "الأفراد والتفاعلات فوق العمليات والأدوات. البرنامج التشغيلي فوق التوثيق الشامل. التعاون مع العميل فوق التفاوض على العقد. الاستجابة للتغيير فوق اتباع الخطة."

— **بيان أجايل (Agile Manifesto)**

### القيم الأربعة

1. **الأفراد والتفاعلات** — أهم من العمليات والأدوات
2. **البرنامج التشغيلي** — أهم من التوثيق الشامل
3. **التعاون مع العميل** — أهم من التفاوض على العقد
4. **الاستجابة للتغيير** — أهم من اتباع الخطة

---

## هيكل الفريق

| الدور | المسؤولية | عدد الأعضاء |
|---|---|---|
| Product Owner | تحديد أولويات المنتج وإدارة backlog | 1 |
| Scrum Master | تسهيل العمليات وإزالة العوائق | 1 |
| فريق التطوير | تنفيذ المهام وتسليم القصص | 4–6 |
| UI/UX Designer | تصميم واجهات المستخدم | 1 |
| QA Engineer | اختبار الجودة وضمان الموثوقية | 1 |

---

## دورة العمل

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                    دورة السبرنت                          │
│                                                         │
│  التخطيط → التطوير → الاختبار → المراجعة → الاستعراض    │
│    │          │          │          │          │        │
│    └──────────┴──────────┴──────────┴──────────┘        │
│                      التكرار                            │
└─────────────────────────────────────────────────────────┘
\`\`\`

### مراحل الدورة

| المرحلة | المدة | النشاط |
|---|---|---|
| تخطيط السبرنت | 4 ساعات | تحديد المهام وتوزيعها |
| التطوير | 8–10 أيام | كتابة الكود والاختبارات |
| المراجعة | 2 ساعة | عرض الإنجازات على Product Owner |
| استعراض السبرنت | 1 ساعة | تقييم الأداء وتحسين العمليات |

---

## السباقات (Sprints)

### مدة السبرنت

**مدة كل سبرنت:** أسبوعين (من الإثنين إلى الجمعة من الأسبوع التالي)

### قالب السباق

\`\`\`markdown
# Sprint N — الأسبوع XX–XX

**الهدف:** [هدف السبرنت]

## المهام

### أولوية عالية
- [ ] مهمة ١ — وصف المهمة
- [ ] مهمة ٢ — وصف المهمة

### أولوية متوسطة
- [ ] مهمة ٣ — وصف المهمة

### ملاحظات
> أي ملاحظات أو عوائق تحتاج إلى متابعة
\`\`\`

---

## قوالب الاجتماعات

### 1. الاجتماع اليومي (Daily Standup)

\`\`\`
المدة: ١٥ دقيقة
الوقت: ٩:٣٠ صباحاً

أسئلة كل عضو:
1. ماذا أنجزت بالأمس؟
2. ماذا ستعمل اليوم؟
3. هل هناك أي عوائق؟
\`\`\`

### 2. تخطيط السبرنت (Sprint Planning)

\`\`\`
المدة: ٤ ساعات
الحضور: Product Owner + Scrum Master + فريق التطوير

الجدول:
- ٣٠ دقيقة: عرض الـ Product Goal
- ٦٠ دقيقة: مناقشة القصص المقترحة
- ٦٠ دقيقة: تقدير المهام (Story Points)
- ٣٠ دقيقة: توزيع المهام
- ٦٠ دقيقة: وضع خطة التسليم
\`\`\`

### 3. استعراض السبرنت (Sprint Retrospective)

> "ما الذي سار بشكل جيد؟ ما الذي يمكن تحسينه؟ ما الذي سنفعله بشكل مختلف في السبرنت القادم؟"

| النشاط | المدة |
|---|---|
| جمع الملاحظات | ١٥ دقيقة |
| مناقشة النقاط الإيجابية | ١٥ دقيقة |
| مناقشة نقاط التحسين | ١٥ دقيقة |
| وضع خطة التحسين | ١٥ دقيقة |

---

## مؤشرات الأداء

| المؤشر | الهدف | طريقة القياس |
|---|---|---|
| Velocity | ٢٠–٣٠ نقطة/سبرنت | مجموع Story Points المنجزة |
| Sprint Completion | > ٨٠٪ | نسبة المهام المنجزة |
| Bug Rate | < ٥٪ | عدد البق لكل ١٠٠ نقطة |
| Lead Time | < ٣ أيام | من بدء المهمة إلى تسليمها |
| Customer Satisfaction | > ٤/٥ | استبيان بعد كل إصدار |

---

## الأدوات المستخدمة

| الأداة | الاستخدام |
|---|---|
| Jira | إدارة المهام وسباقات العمل |
| GitHub | إدارة الكود والمراجعات |
| Slack | التواصل اليومي |
| Figma | تصميم واجهات المستخدم |
| Datadog | مراقبة الأداء |

---

## قالب: خطة السبرنت

| المهمة | المسؤول | الحالة | الأولوية | التقدير |
|---|---|---|---|---|
| تحسين سرعة التحميل | أحمد | 🟡 قيد التنفيذ | عالية | ٨ نقاط |
| إضافة خاصية البحث | سارة | 🔴 متوقفة | عالية | ١٣ نقطة |
| تصميم صفحة الإعدادات | ليلى | ✅ منجزة | متوسطة | ٥ نقاط |

---

> *هذه وثيقة تجريبية. سجل الدخول لإنشاء وتحرير وحفظ مستنداتك الخاصة.*`,
    summary: "دليل شامل لإدارة المشاريع بمنهجية أجايل يغطي هيكل الفريق، دورات العمل، قوالب الاجتماعات، ومؤشرات الأداء",
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
