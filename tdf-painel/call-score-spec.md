# CallScore AI - Product Specification Document

**Version:** 1.0
**Date:** 2026-04-01
**Author:** Software Architecture Team
**Status:** Draft - Ready for Review

---

## Table of Contents

1. [Product Identity & Positioning](#1-product-identity--positioning)
2. [Core Features (MVP)](#2-core-features-mvp)
3. [Scoring Model](#3-scoring-model)
4. [Technical Architecture](#4-technical-architecture)
5. [Database Schema](#5-database-schema)
6. [API Endpoints](#6-api-endpoints)
7. [UI/UX Recommendations](#7-uiux-recommendations)
8. [Improvements Over Match Sales](#8-improvements-over-match-sales)
9. [Monetization Model](#9-monetization-model)
10. [Roadmap](#10-roadmap)
11. [Architectural Decision Records](#11-architectural-decision-records)

---

## 1. Product Identity & Positioning

### Product Name Candidates

| # | Name | Rationale |
|---|------|-----------|
| 1 | **CallScore AI** | Clear, descriptive, instantly communicates the value. "AI" signals modernity. Easy to remember. Domain-friendly. |
| 2 | **ScoreLine** | Short, punchy. "Line" = phone line + bottom line (results). Feels like a product, not a feature. |
| 3 | **VoxScore** | "Vox" = voice in Latin. Premium feel, unique, brandable. Works internationally. |
| 4 | **SalesEar** | Memorable, implies listening to calls. Friendly, approachable. Risk: too informal for enterprise. |
| 5 | **RankCall** | Action-oriented. "Rank your calls." Clear value proposition in the name. |

**Recommended:** **CallScore AI** -- it is the most self-explanatory, SEO-friendly, and positions the product immediately. The ".ai" domain trend makes it modern. Fallback: **VoxScore** for a more premium brand.

### Value Proposition (1 sentence)

> CallScore AI listens to every sales call, WhatsApp conversation, and support ticket -- then tells each seller exactly what they did right, what they missed, and how to close more deals, all scored and synced directly to your CRM.

### Target Market

**Primary:** B2B companies with 5-50 sellers that use phone + WhatsApp as primary sales channels. Industries: SaaS, real estate, insurance, financial services, home services, water treatment, HVAC, and any consultative sale.

**Secondary:** Customer service teams (SAC) wanting quality assurance without manual call review.

**Geography:** Brazil first (Portuguese-language advantage), then Latin America, then global.

**Buyer Persona:**
- **Decision Maker:** Sales Director / VP Sales / CEO of SMB
- **Pain:** "I have no idea what happens on calls. I only see the result -- won or lost. I cannot coach what I cannot measure."
- **Budget:** R$ 500-5.000/month depending on team size
- **Current Alternative:** Manual listening (10+ hours/week), Match Sales, or nothing

### Competitive Positioning Matrix

| Capability | Match Sales | CallScore AI |
|-----------|-------------|--------------|
| Call recording source | Manual upload / Zoom / Meet | **Automatic pull from GoTo Connect, any VoIP via webhook** |
| WhatsApp analysis | Basic | **WATI + Z-API native with conversation threading** |
| CRM integration | Pipedrive | **Zoho CRM native + Pipedrive + HubSpot** |
| Support/SAC scoring | No | **Full SAC module with CSAT prediction** |
| Knowledge base coaching | Generic tips | **RAG-powered coaching from company's own playbook** |
| Real-time alerts | Email only | **WhatsApp alerts to managers in real-time** |
| Multi-language | English/Spanish | **Portuguese-first + English + Spanish** |
| Deployment | SaaS only | **SaaS + on-premise option for enterprise** |

---

## 2. Core Features (MVP)

### Module 1: Call Analysis Engine

#### 1.1 Audio Ingestion
- **Automatic pull** from GoTo Connect via API (recordings endpoint)
- **Webhook receiver** for any VoIP that supports webhooks (Twilio, Vonage, etc.)
- **Manual upload** via drag-and-drop (MP3, WAV, M4A, OGG, WEBM -- up to 120 minutes per file)
- **Scheduled polling** configurable per company (every 15min, 30min, 1hr)
- Queue system with retry logic for failed downloads
- Audio stored in S3-compatible storage with per-tenant isolation

#### 1.2 Transcription
- **Primary:** Deepgram Nova-2 (best cost/quality for Portuguese)
- **Fallback:** OpenAI Whisper large-v3 (self-hosted for cost optimization at scale)
- **Speaker diarization:** automatic seller vs prospect identification
- **Confidence scoring** per segment (flag low-confidence segments for review)
- **Timestamp mapping:** every word linked to its timestamp for playback sync
- **Language detection:** auto-detect Portuguese, English, Spanish
- Output: structured JSON with speaker labels, timestamps, confidence scores

#### 1.3 AI Analysis (Claude API)
For each transcribed call, run the following analysis pipeline:

**Stage 1 -- Structural Analysis (deterministic):**
- Talk-to-listen ratio (seller talk time vs prospect talk time)
- Monologue detection (seller speaking 60+ seconds without interruption)
- Question count (seller questions vs prospect questions)
- Silence gaps (pauses > 5 seconds)
- Call duration and effective conversation time
- Interruption count (who interrupts whom)

**Stage 2 -- Sales Methodology Detection (Claude):**
- SPIN Selling stage identification:
  - Situation questions detected (count + examples)
  - Problem questions detected (count + examples)
  - Implication questions detected (count + examples)
  - Need-payoff questions detected (count + examples)
- BANT Qualification check:
  - Budget discussed? (yes/no + what was said)
  - Authority confirmed? (yes/no + evidence)
  - Need identified? (yes/no + specific need)
  - Timeline established? (yes/no + timeline mentioned)
- Closing techniques used (trial close, assumptive close, urgency close, etc.)

**Stage 3 -- Behavioral Analysis (Claude):**
- Rapport building quality (greeting, name usage, mirroring, personal connection)
- Active listening signals (paraphrasing, summarizing, confirming understanding)
- Objection handling quality (per objection: what was the objection, how was it handled, was it resolved)
- Proposal/pitch clarity (was the value proposition clear, was pricing presented well)
- Next steps defined (was a clear next action agreed upon)
- Sentiment trajectory (how did the prospect's sentiment change throughout the call)
- Urgency/confidence in closer's voice (tone analysis from transcript patterns)
- Filler word usage ("umm," "like," "you know" frequency)

**Stage 4 -- Coaching Output (Claude + RAG):**
- Top 3 things done well (with specific transcript excerpts)
- Top 3 improvement areas (with specific suggestions)
- Suggested scripts for missed opportunities (using company's RAG knowledge base)
- Role-play scenario generated based on the call's weak points
- Comparison to seller's own average and team average

#### 1.4 Call Classification
- **Outcome tagging:** connected / voicemail / wrong number / callback requested / meeting booked / proposal sent / closed won / closed lost
- **Call type:** cold call / follow-up / demo / negotiation / closing / support
- **Lead temperature:** hot / warm / cold (based on conversation signals)
- **Auto-tagging** with AI, with option for seller to correct

### Module 2: Dashboard - Seller View

#### 2.1 My Performance Overview
- **Score gauge** (0-100) with color coding: red (0-40), yellow (41-70), green (71-100)
- **Trend line** of last 30 calls showing score evolution
- **Streak tracker:** consecutive calls above 70 score
- **Daily/Weekly/Monthly score averages** with comparison to previous period
- **Personal best** highlight with date and call link

#### 2.2 My Calls List
- Chronological list with: date, time, duration, prospect name, phone, score, outcome
- **Color-coded score badges** for instant visual scanning
- **Filter by:** date range, score range, outcome, call type
- **Search by:** prospect name, phone number, keyword in transcript
- Click to expand: full scorecard, transcript with highlights, audio player

#### 2.3 My Coaching Center
- **Improvement plan:** AI-generated weekly focus areas (e.g., "This week, focus on asking more Implication questions")
- **Script library:** suggested scripts for common scenarios, personalized to seller's weaknesses
- **Role-play prompts:** "Practice handling the 'too expensive' objection with the reframing technique"
- **Video/audio examples:** links to team's best calls for each skill (anonymized or with permission)
- **Progress tracker:** skill-by-skill improvement over time with sparklines
- **Badges/achievements:** gamification elements (e.g., "SPIN Master: asked all 4 SPIN stages in 5 consecutive calls")

#### 2.4 Call Playback
- Audio player with waveform visualization
- Transcript panel synced to audio (click text to jump to timestamp)
- Score annotations inline (green highlights = good moments, red = improvement areas)
- Bookmarking capability (seller can bookmark key moments)
- Playback speed control (0.5x, 1x, 1.5x, 2x)

### Module 3: Dashboard - Manager View

#### 3.1 Team Overview
- **Team average score** with trend (last 7, 30, 90 days)
- **Leaderboard:** ranked by average score, with arrows showing position changes
- **Heat map:** sellers x skills matrix (which sellers are weak in which areas)
- **Call volume tracker:** calls per seller per day/week
- **Score distribution histogram:** how many calls in each score bucket
- **Conversion correlation:** scatter plot of call score vs deal conversion rate

#### 3.2 Individual Seller Deep Dive
- Click on any seller to see their full Seller View
- **Comparison mode:** overlay two sellers' metrics side by side
- **Coaching notes:** manager can add private notes per seller
- **1-on-1 agenda generator:** AI suggests talking points based on recent call patterns

#### 3.3 Alerts & Notifications
- **Real-time WhatsApp alert** when any call scores below configurable threshold (default: 40)
- **Daily digest** (email or WhatsApp) with: team average, top performer, lowest performer, calls needing review
- **Weekly report** with trends, coaching priorities, team evolution
- **Deal risk alert:** when a high-value deal has consistently low-scoring calls
- **Celebration alert:** when a seller hits a personal best or streak milestone

#### 3.4 Analytics
- **Call-to-Close correlation:** does higher call score = higher conversion?
- **Time-of-day analysis:** when do calls score best?
- **Call duration sweet spot:** what call length correlates with best outcomes?
- **Objection frequency analysis:** most common objections and how often they're handled well
- **BANT completion rates:** what % of calls properly qualify?
- **Team benchmarks:** how does this team compare to platform average (anonymized cross-tenant)?

### Module 4: CRM Integration

#### 4.1 Zoho CRM (Native, Priority)
- **Call score field** automatically populated on Deal/Contact record
- **Call notes** auto-generated and attached as a Note on the Deal
- **Custom fields** synced: Score_Lead, last call score, average call score, BANT status
- **Deal stage suggestion:** AI recommends pipeline stage based on call content
- **Activity logging:** each analyzed call logged as a Call Activity
- **Workflow triggers:** Zoho workflows can fire based on call score thresholds

#### 4.2 Other CRMs (Phase 2+)
- Pipedrive: similar field mapping via API
- HubSpot: native integration via HubSpot API
- Salesforce: managed package (Phase 4)
- Generic webhook: for any CRM with API

### Module 5: WhatsApp Analysis

#### 5.1 Conversation Ingestion
- **WATI integration:** pull conversations via WATI API, tagged by agent
- **Z-API integration:** pull conversations via Z-API webhook
- **Conversation threading:** group messages into logical conversations (by contact + time window)
- **Media handling:** transcribe audio messages, OCR images if relevant

#### 5.2 WhatsApp Scoring
- **Response time:** how fast did the seller reply? (benchmark: < 5 min = excellent, < 15 min = good, < 1 hr = acceptable, > 1 hr = poor)
- **Message quality:** greeting, personalization, clarity, CTA presence
- **Qualification check:** did the seller ask qualifying questions?
- **Follow-up discipline:** did the seller follow up on unanswered messages?
- **Conversation resolution:** was the prospect's question/need addressed?
- **Handoff quality:** if transferred to another agent, was context provided?
- **Template usage:** did the seller use approved templates where appropriate?
- **Emoji/tone appropriateness:** professional but friendly tone

#### 5.3 WhatsApp-Specific Metrics
- Average response time per seller
- Conversations started vs conversations converted
- Drop-off point analysis (at which message does the prospect stop responding)
- Peak hours analysis (when do prospects engage most)

### Module 6: SAC/Support Module

#### 6.1 Support Call/Chat Scoring
- **Issue identification speed:** how quickly did the agent understand the problem?
- **Knowledge accuracy:** was the information provided correct? (checked against RAG knowledge base)
- **Resolution quality:** was the issue fully resolved?
- **Escalation appropriateness:** was escalation needed? Was it done correctly?
- **Empathy score:** did the agent acknowledge the customer's frustration?
- **CSAT prediction:** based on conversation analysis, predict likely CSAT score (1-5)
- **First Contact Resolution (FCR):** was the issue resolved without callback?

#### 6.2 Support-Specific Dashboard
- FCR rate by agent and by issue type
- Average handling time with quality correlation
- Issue category distribution (auto-tagged by AI)
- Escalation rate and reasons
- Predicted CSAT vs actual CSAT (when feedback is collected)
- Knowledge gap identification: what questions are agents struggling to answer?

### Module 7: Coaching Module (RAG-Powered)

#### 7.1 Knowledge Base Management
- **Upload company materials:** sales playbooks, product catalogs, pricing sheets, FAQ documents, objection handling guides
- **Automatic chunking and embedding** for RAG retrieval
- **Version control:** track changes to knowledge base over time
- **Usage analytics:** which knowledge chunks are referenced most in coaching

#### 7.2 Personalized Coaching
- **AI Coach chat:** seller can ask "How should I handle the 'too expensive' objection for product X?" and get answers grounded in company knowledge
- **Call review with suggestions:** "In this call, when the prospect said X, you could have referenced [specific product feature from knowledge base]"
- **Weekly coaching email:** personalized to each seller's weaknesses, with specific exercises
- **Manager coaching tools:** suggested 1-on-1 agenda, talking points, and exercises per seller

#### 7.3 Role-Play Simulator
- AI-generated prospect personas based on real call patterns
- Seller practices via text or voice (Phase 3)
- Immediate scoring and feedback
- Scenario library: cold call, objection handling, closing, upsell, retention

### Module 8: Alerts & Notifications

#### 8.1 Real-Time Alerts (WhatsApp via WATI)
- Bad call alert: "Seller [Name] just had a call scoring 32/100 with [Prospect]. Key issues: no qualifying questions asked, talked 80% of the time. [Link to review]"
- Deal risk alert: "Deal [Name] (R$ 15.000) has 3 consecutive calls below 50. Manager attention needed."
- Celebration alert: "Seller [Name] just scored 95/100 -- personal best! Great SPIN execution."

#### 8.2 Scheduled Digests
- **Daily (7am):** Yesterday's summary -- total calls, average score, best/worst, calls needing review
- **Weekly (Monday 8am):** Week summary -- trends, leaderboard changes, coaching priorities
- **Monthly:** Executive summary with ROI metrics (score improvement vs conversion improvement)

#### 8.3 Alert Configuration
- Per-company threshold settings
- Per-manager notification preferences (WhatsApp, email, in-app, or combination)
- Quiet hours configuration
- Alert frequency limits (no more than X alerts per hour)

---

## 3. Scoring Model

### Overall Score: 0-100

The overall call score is a weighted average of 6 categories. Weights are configurable per company but have sensible defaults.

### Category Breakdown

| Category | Weight | What It Measures |
|----------|--------|-----------------|
| Opening & Rapport | 15% | First impression, greeting, rapport building, agenda setting |
| Discovery & Qualification | 25% | SPIN questions, BANT check, need identification, active listening |
| Presentation & Value | 20% | Value proposition clarity, feature-benefit linking, customization to prospect's needs |
| Objection Handling | 15% | Objection identification, response quality, resolution |
| Closing & Next Steps | 15% | Trial closes, commitment obtained, clear next steps defined |
| Communication Skills | 10% | Talk ratio, filler words, pace, clarity, professionalism |

### Detailed Scoring Rubric

#### Category 1: Opening & Rapport (15%)

| Score Range | Description | Indicators |
|-------------|-------------|------------|
| 90-100 | Exceptional | Professional greeting with name, clear agenda set, personal connection made, energy and enthusiasm appropriate |
| 70-89 | Good | Proper greeting, agenda mentioned, some rapport building |
| 50-69 | Adequate | Basic greeting, no agenda, minimal rapport |
| 30-49 | Below Average | Rushed or generic opening, no rapport attempt, unclear purpose |
| 0-29 | Poor | No greeting, immediately into pitch, rude or unprofessional |

**Detection Signals (AI looks for):**
- Prospect's name used in first 30 seconds
- "The reason for my call is..." or similar agenda-setting phrases
- Small talk or personal connection attempt
- Permission-based opening ("Do you have a moment?")
- Company/role acknowledgment ("I see you're the [role] at [company]")

#### Category 2: Discovery & Qualification (25%)

| Score Range | Description | Indicators |
|-------------|-------------|------------|
| 90-100 | Exceptional | All 4 SPIN stages present, BANT fully qualified, deep understanding demonstrated, prospect does 60%+ of talking |
| 70-89 | Good | 3+ SPIN stages, BANT mostly complete, good questions asked |
| 50-69 | Adequate | Basic questions asked, some qualification, misses key areas |
| 30-49 | Below Average | Few questions, mostly situation-level, incomplete qualification |
| 0-29 | Poor | No discovery, jumps straight to pitch, makes assumptions |

**SPIN Detection Algorithm:**

```
SITUATION questions: Questions about current state, facts, background
  Patterns: "How do you currently...", "What system do you use...", 
            "How many [people/units/...]", "What's your current process for..."
  
PROBLEM questions: Questions about difficulties, dissatisfactions, challenges  
  Patterns: "What challenges do you face with...", "Are you satisfied with...",
            "What's the biggest problem...", "Where do you see issues..."

IMPLICATION questions: Questions about consequences of problems
  Patterns: "What happens when...", "How does that affect...", 
            "What's the cost of...", "If you don't solve this, what..."

NEED-PAYOFF questions: Questions about value of solutions
  Patterns: "How would it help if...", "What would it mean to your team if...",
            "Would it be useful if...", "What would solving this be worth..."
```

**BANT Detection:**
```
BUDGET: Any mention of budget, price range, investment capacity, 
        "How much do you spend on...", financial constraints mentioned

AUTHORITY: "Who else is involved in this decision?", mentions of committee,
           boss approval needed, "I can decide this" signals

NEED: Explicit statement of need or problem, "We need to...", 
      pain point articulation, desired outcome described

TIMELINE: "When do you need this by?", project deadlines mentioned,
          urgency signals, "We're looking to implement by..."
```

#### Category 3: Presentation & Value (20%)

| Score Range | Description | Indicators |
|-------------|-------------|------------|
| 90-100 | Exceptional | Value proposition tailored to discovered needs, features linked to specific benefits for this prospect, competitive differentiation clear, uses prospect's own words |
| 70-89 | Good | Clear value proposition, some customization, benefits mentioned |
| 50-69 | Adequate | Generic pitch, features listed without benefit linking |
| 30-49 | Below Average | Feature dump, no connection to prospect's needs, confusing |
| 0-29 | Poor | No clear value proposition, irrelevant information, reading from script |

**Detection Signals:**
- References to earlier discovery ("You mentioned that..." )
- Feature-benefit pairing ("This means that for you...")
- Social proof / case studies relevant to prospect's industry
- Quantified value ("This saves X hours / R$ Y per month")
- Check-in questions during presentation ("Does that make sense?", "How does that sound?")

#### Category 4: Objection Handling (15%)

| Score Range | Description | Indicators |
|-------------|-------------|------------|
| 90-100 | Exceptional | Acknowledges objection, asks clarifying questions, reframes effectively, uses evidence/stories, confirms resolution |
| 70-89 | Good | Acknowledges and addresses objection, partial reframing |
| 50-69 | Adequate | Responds to objection but doesn't fully address it |
| 30-49 | Below Average | Dismisses objection, argues, or gets defensive |
| 0-29 | Poor | Ignores objection, panics, gives unnecessary discounts immediately |

**Objection Detection:**
```
PRICE objections: "too expensive", "out of budget", "cheaper alternatives",
                  "can't afford", "need a discount", "competitor is cheaper"

TIMING objections: "not now", "not the right time", "come back later",
                   "we're busy", "maybe next quarter"

AUTHORITY objections: "I need to check with...", "not my decision",
                      "let me talk to my boss", "need committee approval"

TRUST objections: "I've never heard of you", "how do I know it works",
                  "what if it doesn't work", "do you have references"

STATUS QUO objections: "we're fine with what we have", "why change",
                       "it's working okay", "too much hassle to switch"

NEED objections: "I don't think we need this", "not a priority",
                 "we're okay without it"
```

**Handling Quality Assessment:**
- Step 1: Did the seller acknowledge? ("I understand your concern...")
- Step 2: Did the seller ask to understand better? ("Can you tell me more about...")
- Step 3: Did the seller reframe? (Turning objection into opportunity)
- Step 4: Did the seller provide evidence? (Case study, data, guarantee)
- Step 5: Did the seller confirm resolution? ("Does that address your concern?")

Each step present = +20% of this category's score for that objection.

#### Category 5: Closing & Next Steps (15%)

| Score Range | Description | Indicators |
|-------------|-------------|------------|
| 90-100 | Exceptional | Natural transition to close, clear next step agreed with date/time, commitment obtained, recap provided |
| 70-89 | Good | Next steps mentioned, some commitment, follow-up planned |
| 50-69 | Adequate | Vague next steps, "I'll send you something", no specific commitment |
| 30-49 | Below Average | Call ends without clear next step, "I'll call you back sometime" |
| 0-29 | Poor | Abrupt ending, no next step, no summary, prospect confused about what happens next |

**Detection Signals:**
- Trial close attempts ("Based on what we discussed, would [solution] work for you?")
- Specific date/time for follow-up mentioned
- Action items clearly stated ("I'll send the proposal by Thursday")
- Prospect commitment obtained ("Great, so you'll review and we'll talk Friday")
- Summary/recap of key points before ending

#### Category 6: Communication Skills (10%)

| Score Range | Description | Indicators |
|-------------|-------------|------------|
| 90-100 | Exceptional | Talk ratio 35-45%, zero filler words, clear articulation, appropriate pace, enthusiastic but professional |
| 70-89 | Good | Talk ratio 30-50%, few fillers, generally clear |
| 50-69 | Adequate | Talk ratio 50-60%, moderate fillers, some clarity issues |
| 30-49 | Below Average | Talk ratio 60-75%, excessive fillers, rushed or too slow |
| 0-29 | Poor | Talk ratio 75%+, constant fillers, unclear, monotone or aggressive |

**Quantitative Metrics:**
- **Talk-to-listen ratio:** Calculated from diarization. Ideal: seller talks 35-45% of the time.
  - Formula: `seller_talk_seconds / total_conversation_seconds * 100`
  - Penalty curve: linear penalty from 45% to 80%, severe penalty above 80%
- **Filler words per minute:** Count of "um", "uh", "like", "you know", "so", "right" divided by call minutes
  - Excellent: < 2/min, Good: 2-4/min, Adequate: 4-6/min, Poor: > 6/min
- **Longest monologue:** Continuous seller speech without prospect input
  - Excellent: < 30s, Good: 30-60s, Adequate: 60-90s, Poor: > 90s
- **Questions per minute:** Total seller questions / call minutes
  - Excellent: > 3/min, Good: 2-3/min, Adequate: 1-2/min, Poor: < 1/min

### Score Aggregation Formula

```
overall_score = (
  opening_score * 0.15 +
  discovery_score * 0.25 +
  presentation_score * 0.20 +
  objection_score * 0.15 +
  closing_score * 0.15 +
  communication_score * 0.10
)
```

**Special Rules:**
- If no objections arise in the call, the objection handling weight (15%) is redistributed proportionally to other categories
- If the call is under 2 minutes (likely voicemail or wrong number), it is flagged as "Not Scoreable" and excluded from averages
- If the call is a support/SAC call, a different scoring model is used (see SAC Module)

### Benchmarks

| Metric | Bottom 25% | Average | Top 25% | Elite |
|--------|-----------|---------|---------|-------|
| Overall Score | < 45 | 55-65 | 70-80 | 85+ |
| Talk Ratio | > 65% | 50-60% | 40-50% | 35-45% |
| SPIN Coverage | 1 stage | 2 stages | 3 stages | All 4 |
| BANT Completion | 0-1 | 2 | 3 | All 4 |
| Questions/min | < 1 | 1.5 | 2.5 | 3+ |
| Filler words/min | > 6 | 4-6 | 2-4 | < 2 |
| Next Steps Defined | 30% of calls | 50% | 75% | 90%+ |

### WhatsApp Scoring Model (Separate)

WhatsApp conversations use a modified scoring model:

| Category | Weight | Measures |
|----------|--------|----------|
| Response Speed | 25% | Time to first response and subsequent replies |
| Message Quality | 25% | Clarity, professionalism, personalization |
| Qualification | 20% | Questions asked, needs identified |
| Resolution / CTA | 20% | Clear next step, conversion action |
| Follow-up | 10% | Unanswered messages followed up |

### SAC/Support Scoring Model (Separate)

| Category | Weight | Measures |
|----------|--------|----------|
| Empathy & Tone | 15% | Acknowledgment, patience, professionalism |
| Problem Understanding | 20% | Speed and accuracy of issue identification |
| Knowledge Accuracy | 25% | Correctness of information provided (RAG-verified) |
| Resolution Quality | 25% | Issue fully resolved, customer satisfied |
| Process Compliance | 15% | Proper escalation, documentation, follow-up |

---

## 4. Technical Architecture

### Architecture Style: Modular Monolith (MVP) with Event-Driven Extraction Path

**Rationale:** A modular monolith is the right choice for MVP because:
1. Small team building the product -- a single deployable unit reduces operational overhead
2. Boundaries are not yet proven -- modules can be extracted to services later if needed
3. Shared database simplifies cross-module queries (e.g., dashboard aggregations)
4. Faster time to market -- no distributed systems complexity

The event-driven internal design (using an in-process event bus) ensures modules communicate through events, making future extraction to microservices straightforward.

### High-Level Architecture

```
                                    [CDN / Vercel]
                                         |
                                    [Next.js App]
                                    (Frontend SPA)
                                         |
                                    [API Gateway]
                                    (Next.js API Routes / tRPC)
                                         |
                    +--------------------+--------------------+
                    |                    |                    |
              [Auth Module]      [Core API Module]     [Webhook Module]
              (NextAuth.js)      (Business Logic)      (Inbound Events)
                    |                    |                    |
                    +--------------------+--------------------+
                                         |
                              [Internal Event Bus]
                              (BullMQ on Redis)
                                         |
              +----------+----------+----------+----------+
              |          |          |          |          |
         [Ingestion] [Transcription] [Analysis] [Scoring] [Notification]
          Worker      Worker        Worker     Worker     Worker
              |          |          |          |          |
              +----------+----------+----------+----------+
                                         |
                                  [PostgreSQL]
                                  (Multi-tenant)
                                         |
                              [S3 / R2 Storage]
                              (Audio files)
```

### Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Next.js 14 (App Router) + TypeScript | SSR for SEO, RSC for performance, excellent DX |
| **UI Library** | shadcn/ui + Tailwind CSS | Consistent design system, dark theme support, accessible |
| **Charts** | Recharts + Tremor | Dashboard-grade visualizations, responsive |
| **State Mgmt** | TanStack Query (React Query) | Server state management, caching, real-time updates |
| **API Layer** | tRPC | End-to-end type safety, no API spec maintenance |
| **Backend Runtime** | Node.js 20 LTS | Team expertise, ecosystem, async I/O for queue workers |
| **Job Queue** | BullMQ (Redis-backed) | Reliable job processing with retry, backoff, priority queues |
| **Database** | PostgreSQL 16 (Supabase) | Row-Level Security for multi-tenancy, real-time subscriptions, built-in auth option |
| **ORM** | Drizzle ORM | Type-safe, lightweight, great migration tooling |
| **Cache** | Redis (Upstash or self-hosted) | Session cache, rate limiting, job queue backend |
| **File Storage** | Cloudflare R2 or AWS S3 | Audio file storage, per-tenant prefixes |
| **Transcription** | Deepgram Nova-2 API | Best Portuguese accuracy, speaker diarization, fast turnaround |
| **AI Analysis** | Claude API (claude-sonnet-4-20250514) | Best reasoning for nuanced sales analysis, structured output |
| **AI Embeddings** | OpenAI text-embedding-3-small | RAG knowledge base embeddings |
| **Vector Store** | pgvector (PostgreSQL extension) | RAG storage without additional infrastructure |
| **Auth** | NextAuth.js v5 + Supabase Auth | Multi-tenant auth with org/team structure |
| **Email** | Resend | Transactional emails, digests |
| **WhatsApp Alerts** | WATI API | Alert delivery to managers |
| **Monitoring** | Sentry + Axiom | Error tracking + log aggregation |
| **Deployment** | Railway or Vercel + Railway | Frontend on Vercel, workers on Railway |
| **CI/CD** | GitHub Actions | Automated testing, preview deployments |

### Multi-Tenancy Strategy

**Approach:** Shared database with Row-Level Security (RLS)

Every table has a `company_id` column. PostgreSQL RLS policies enforce data isolation at the database level, making it impossible for one tenant to access another's data even if application code has bugs.

```sql
-- Example RLS policy
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY calls_tenant_isolation ON calls
  USING (company_id = current_setting('app.current_company_id')::uuid);
```

**Why not schema-per-tenant?** 
- Simpler migration management
- Connection pooling works better
- Easier cross-tenant analytics (for platform owner only, with elevated privileges)
- Can migrate to schema-per-tenant later for enterprise clients who require it

### Processing Pipeline (Event-Driven)

```
1. INGESTION EVENT
   Trigger: Cron poll (GoTo Connect) or Webhook (VoIP/manual upload)
   Action: Download audio -> Store in R2 -> Emit "call.audio.ready"

2. TRANSCRIPTION EVENT  
   Trigger: "call.audio.ready"
   Action: Send to Deepgram -> Store transcript -> Emit "call.transcript.ready"

3. ANALYSIS EVENT
   Trigger: "call.transcript.ready"
   Action: Send to Claude API (structured prompt) -> Store analysis -> Emit "call.analysis.ready"

4. SCORING EVENT
   Trigger: "call.analysis.ready"  
   Action: Apply scoring rubric -> Calculate scores -> Store -> Emit "call.scored"

5. NOTIFICATION EVENT
   Trigger: "call.scored"
   Action: Check thresholds -> Send alerts if needed -> Sync to CRM

6. CRM SYNC EVENT
   Trigger: "call.scored"
   Action: Update Zoho CRM deal record with score and notes
```

**Retry Policy:** Each stage retries 3 times with exponential backoff (1s, 10s, 60s). After 3 failures, the job moves to a dead-letter queue and an admin alert is sent.

**Concurrency:** Configurable per worker type. Default: 5 concurrent transcriptions, 10 concurrent analyses, 20 concurrent scoring jobs.

### Security

- **Authentication:** JWT tokens with short expiry (15 min access, 7 day refresh)
- **Authorization:** Role-based (owner, admin, manager, seller) with resource-level checks
- **Data encryption:** AES-256 at rest (S3/R2 server-side encryption), TLS 1.3 in transit
- **Audio access:** Signed URLs with 1-hour expiry, no direct public access
- **API keys:** Per-company API keys for CRM integration, rotatable
- **PII handling:** Option to auto-redact phone numbers and names from transcripts
- **Audit log:** All admin actions logged with actor, action, timestamp, IP
- **Rate limiting:** Per-tenant rate limits on API endpoints
- **SOC 2 considerations:** Audit log, encryption, access controls designed for future SOC 2 compliance

---

## 5. Database Schema

### Entity Relationship Diagram (Key Tables)

```
companies ──< users
companies ──< api_keys
companies ──< knowledge_base_documents
companies ──< score_category_configs
users ──< calls
users ──< whatsapp_conversations
users ──< sac_tickets
users ──< coaching_plans
calls ──< call_scores
calls ── call_transcripts (1:1)
calls ── call_analyses (1:1)
whatsapp_conversations ──< whatsapp_messages
whatsapp_conversations ──< whatsapp_scores
sac_tickets ──< sac_scores
coaching_plans ──< coaching_tasks
score_categories (reference table)
```

### Table Definitions

```sql
-- ==========================================
-- TENANT & AUTH
-- ==========================================

CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,  -- used in URLs
    plan VARCHAR(50) NOT NULL DEFAULT 'trial',  -- trial, starter, professional, enterprise
    plan_expires_at TIMESTAMPTZ,
    max_users INT NOT NULL DEFAULT 5,
    max_calls_per_month INT NOT NULL DEFAULT 100,
    calls_this_month INT NOT NULL DEFAULT 0,
    settings JSONB NOT NULL DEFAULT '{}',  -- company-level config
    -- Integration credentials (encrypted)
    goto_connect_config JSONB,  -- {account_key, client_id, client_secret, refresh_token}
    zoho_crm_config JSONB,     -- {client_id, client_secret, refresh_token, org_id}
    wati_config JSONB,         -- {api_key, base_url}
    zapi_config JSONB,         -- {instance_id, token}
    -- Notification settings
    alert_threshold INT NOT NULL DEFAULT 40,  -- score below this triggers alert
    alert_channels JSONB NOT NULL DEFAULT '["in_app"]',  -- ["whatsapp", "email", "in_app"]
    manager_whatsapp VARCHAR(20),  -- for WhatsApp alerts
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ  -- soft delete
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'seller',  -- owner, admin, manager, seller, support_agent
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    -- Seller-specific
    extension VARCHAR(20),  -- phone extension for GoTo Connect matching
    team VARCHAR(100),      -- team/group name
    is_active BOOLEAN NOT NULL DEFAULT true,
    -- Stats (denormalized for dashboard speed)
    total_calls INT NOT NULL DEFAULT 0,
    average_score DECIMAL(5,2),
    last_call_at TIMESTAMPTZ,
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    UNIQUE(company_id, email)
);

CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    key_hash VARCHAR(255) NOT NULL,  -- bcrypt hash of the actual key
    key_prefix VARCHAR(10) NOT NULL,  -- first 8 chars for identification
    name VARCHAR(100) NOT NULL,
    permissions JSONB NOT NULL DEFAULT '["read"]',
    expires_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- ==========================================
-- CALLS & ANALYSIS
-- ==========================================

CREATE TABLE calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    user_id UUID NOT NULL REFERENCES users(id),  -- the seller
    -- Call metadata
    external_id VARCHAR(255),  -- ID from GoTo Connect or other source
    source VARCHAR(50) NOT NULL,  -- goto_connect, manual_upload, twilio, webhook
    direction VARCHAR(10) NOT NULL DEFAULT 'outbound',  -- inbound, outbound
    call_type VARCHAR(50),  -- cold_call, follow_up, demo, negotiation, closing, support
    -- Contact info
    prospect_name VARCHAR(255),
    prospect_phone VARCHAR(20),
    prospect_company VARCHAR(255),
    crm_deal_id VARCHAR(255),  -- linked Zoho Deal ID
    crm_contact_id VARCHAR(255),  -- linked Zoho Contact ID
    -- Call details
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ,
    duration_seconds INT,
    -- Audio
    audio_url VARCHAR(500),  -- S3/R2 presigned URL base path
    audio_format VARCHAR(10),  -- mp3, wav, ogg
    audio_size_bytes BIGINT,
    -- Processing status
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    -- pending -> transcribing -> analyzing -> scoring -> completed -> error
    error_message TEXT,
    -- Classification (AI-generated)
    outcome VARCHAR(50),  -- connected, voicemail, wrong_number, callback, meeting_booked, proposal_sent, closed_won, closed_lost
    lead_temperature VARCHAR(20),  -- hot, warm, cold
    -- Denormalized score (for fast queries)
    overall_score DECIMAL(5,2),
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    scored_at TIMESTAMPTZ,
    synced_to_crm_at TIMESTAMPTZ
);

CREATE INDEX idx_calls_company_user ON calls(company_id, user_id);
CREATE INDEX idx_calls_company_date ON calls(company_id, started_at DESC);
CREATE INDEX idx_calls_status ON calls(status) WHERE status != 'completed';
CREATE INDEX idx_calls_score ON calls(company_id, overall_score);

CREATE TABLE call_transcripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_id UUID NOT NULL UNIQUE REFERENCES calls(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id),
    -- Transcript data
    full_text TEXT NOT NULL,  -- plain text version
    segments JSONB NOT NULL,  -- [{speaker: "seller"|"prospect", text: "...", start_ms: 0, end_ms: 5000, confidence: 0.95}]
    -- Metrics extracted from transcript
    seller_talk_seconds INT,
    prospect_talk_seconds INT,
    silence_seconds INT,
    talk_ratio DECIMAL(5,2),  -- seller percentage
    total_words INT,
    seller_words INT,
    prospect_words INT,
    -- Provider info
    provider VARCHAR(50) NOT NULL,  -- deepgram, whisper
    language VARCHAR(10),  -- pt-BR, en-US, es
    confidence_avg DECIMAL(5,4),
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE call_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_id UUID NOT NULL UNIQUE REFERENCES calls(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id),
    -- SPIN Analysis
    spin_situation_questions JSONB,  -- [{text: "...", timestamp_ms: 1234}]
    spin_problem_questions JSONB,
    spin_implication_questions JSONB,
    spin_need_payoff_questions JSONB,
    spin_coverage INT,  -- 0-4 stages covered
    -- BANT Analysis
    bant_budget JSONB,     -- {detected: true, evidence: "...", timestamp_ms: 1234}
    bant_authority JSONB,
    bant_need JSONB,
    bant_timeline JSONB,
    bant_completion INT,   -- 0-4 items covered
    -- Objection Analysis
    objections JSONB,  -- [{type: "price", text: "...", handling_quality: 85, steps_present: ["acknowledge","clarify","reframe","evidence","confirm"], timestamp_ms: 1234}]
    objection_count INT,
    -- Communication Metrics
    filler_word_count INT,
    filler_words_per_minute DECIMAL(5,2),
    longest_monologue_seconds INT,
    questions_asked INT,
    questions_per_minute DECIMAL(5,2),
    interruption_count INT,
    -- Sentiment
    sentiment_trajectory JSONB,  -- [{quarter: 1, sentiment: "neutral"}, {quarter: 2, sentiment: "positive"}, ...]
    overall_sentiment VARCHAR(20),
    -- Closing
    closing_techniques_used JSONB,  -- [{type: "trial_close", text: "...", timestamp_ms: 1234}]
    next_steps_defined BOOLEAN,
    next_steps_text TEXT,
    -- AI Coaching Output
    strengths JSONB,      -- [{area: "...", evidence: "...", transcript_excerpt: "..."}]
    improvements JSONB,   -- [{area: "...", suggestion: "...", example_script: "..."}]
    -- Raw AI response (for debugging/auditing)
    raw_ai_response JSONB,
    ai_model VARCHAR(100),
    ai_tokens_used INT,
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE score_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,  -- opening_rapport, discovery_qualification, etc.
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    default_weight DECIMAL(5,2) NOT NULL,
    scoring_type VARCHAR(50) NOT NULL,  -- sales, whatsapp, sac
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE score_category_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    category_id UUID NOT NULL REFERENCES score_categories(id),
    weight DECIMAL(5,2) NOT NULL,  -- company-specific weight override
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    custom_criteria JSONB,  -- company-specific scoring adjustments
    UNIQUE(company_id, category_id)
);

CREATE TABLE call_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_id UUID NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id),
    category_id UUID NOT NULL REFERENCES score_categories(id),
    score DECIMAL(5,2) NOT NULL,  -- 0-100
    weight DECIMAL(5,2) NOT NULL,  -- weight used for this scoring
    details JSONB,  -- category-specific scoring details
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(call_id, category_id)
);

CREATE INDEX idx_call_scores_call ON call_scores(call_id);

-- ==========================================
-- WHATSAPP
-- ==========================================

CREATE TABLE whatsapp_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    user_id UUID NOT NULL REFERENCES users(id),  -- the agent/seller
    -- Contact
    contact_phone VARCHAR(20) NOT NULL,
    contact_name VARCHAR(255),
    crm_contact_id VARCHAR(255),
    crm_deal_id VARCHAR(255),
    -- Conversation metadata
    source VARCHAR(50) NOT NULL,  -- wati, zapi
    external_id VARCHAR(255),
    started_at TIMESTAMPTZ NOT NULL,
    last_message_at TIMESTAMPTZ,
    message_count INT NOT NULL DEFAULT 0,
    -- Classification
    conversation_type VARCHAR(50),  -- sales, support, follow_up
    status VARCHAR(50) NOT NULL DEFAULT 'active',  -- active, resolved, abandoned
    -- Score
    overall_score DECIMAL(5,2),
    -- Metrics
    avg_response_time_seconds INT,
    first_response_time_seconds INT,
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    scored_at TIMESTAMPTZ
);

CREATE TABLE whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES whatsapp_conversations(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id),
    -- Message data
    direction VARCHAR(10) NOT NULL,  -- inbound, outbound
    message_type VARCHAR(20) NOT NULL,  -- text, audio, image, document, template
    content TEXT,  -- text content or transcription of audio
    media_url VARCHAR(500),
    -- Timing
    sent_at TIMESTAMPTZ NOT NULL,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    response_time_seconds INT,  -- time from previous inbound to this outbound
    -- Metadata
    external_id VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wa_messages_conversation ON whatsapp_messages(conversation_id, sent_at);

CREATE TABLE whatsapp_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES whatsapp_conversations(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id),
    category_id UUID NOT NULL REFERENCES score_categories(id),
    score DECIMAL(5,2) NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(conversation_id, category_id)
);

-- ==========================================
-- SAC / SUPPORT
-- ==========================================

CREATE TABLE sac_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    user_id UUID NOT NULL REFERENCES users(id),  -- support agent
    -- Ticket info
    source VARCHAR(50) NOT NULL,  -- call, whatsapp, email
    call_id UUID REFERENCES calls(id),  -- if from a call
    conversation_id UUID REFERENCES whatsapp_conversations(id),  -- if from WhatsApp
    -- Classification
    issue_category VARCHAR(100),  -- AI-classified
    issue_subcategory VARCHAR(100),
    severity VARCHAR(20),  -- low, medium, high, critical
    -- Resolution
    status VARCHAR(50) NOT NULL DEFAULT 'open',  -- open, in_progress, resolved, escalated
    resolution_text TEXT,
    resolved_at TIMESTAMPTZ,
    escalated_to UUID REFERENCES users(id),
    escalated_at TIMESTAMPTZ,
    -- Scoring
    overall_score DECIMAL(5,2),
    predicted_csat DECIMAL(3,1),  -- 1.0 - 5.0
    actual_csat DECIMAL(3,1),     -- from customer feedback
    first_contact_resolution BOOLEAN,
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sac_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES sac_tickets(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id),
    category_id UUID NOT NULL REFERENCES score_categories(id),
    score DECIMAL(5,2) NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(ticket_id, category_id)
);

-- ==========================================
-- COACHING
-- ==========================================

CREATE TABLE coaching_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    user_id UUID NOT NULL REFERENCES users(id),
    -- Plan details
    focus_areas JSONB NOT NULL,  -- [{category: "discovery", priority: 1, current_avg: 45, target: 70}]
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_until TIMESTAMPTZ NOT NULL,  -- usually 1 week
    status VARCHAR(50) NOT NULL DEFAULT 'active',  -- active, completed, superseded
    -- AI-generated content
    summary TEXT NOT NULL,
    detailed_plan JSONB NOT NULL,  -- [{day: 1, exercise: "...", focus: "...", estimated_time: "15min"}]
    role_play_scenarios JSONB,  -- [{title: "...", persona: "...", situation: "...", objective: "..."}]
    -- Progress
    tasks_completed INT NOT NULL DEFAULT 0,
    tasks_total INT NOT NULL DEFAULT 0,
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE coaching_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES coaching_plans(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id),
    -- Task details
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    task_type VARCHAR(50) NOT NULL,  -- read, practice, role_play, review_call, quiz
    resource_url VARCHAR(500),  -- link to relevant call, article, etc.
    sort_order INT NOT NULL DEFAULT 0,
    -- Completion
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    seller_notes TEXT,
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- KNOWLEDGE BASE (RAG)
-- ==========================================

CREATE TABLE knowledge_base_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    -- Document info
    title VARCHAR(255) NOT NULL,
    doc_type VARCHAR(50) NOT NULL,  -- playbook, product_catalog, faq, objection_guide, pricing, policy
    file_url VARCHAR(500),
    original_filename VARCHAR(255),
    -- Content
    content TEXT NOT NULL,  -- extracted text
    chunk_count INT NOT NULL DEFAULT 0,
    -- Metadata
    uploaded_by UUID REFERENCES users(id),
    version INT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE knowledge_base_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES knowledge_base_documents(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id),
    -- Chunk content
    content TEXT NOT NULL,
    chunk_index INT NOT NULL,
    -- Vector embedding (pgvector)
    embedding vector(1536),  -- OpenAI text-embedding-3-small dimension
    -- Metadata
    metadata JSONB,  -- {section: "...", page: 1, etc.}
    token_count INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_kb_chunks_embedding ON knowledge_base_chunks 
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ==========================================
-- NOTIFICATIONS & AUDIT
-- ==========================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    user_id UUID REFERENCES users(id),  -- NULL = company-wide
    -- Notification content
    type VARCHAR(50) NOT NULL,  -- bad_call_alert, deal_risk, celebration, digest, system
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    data JSONB,  -- {call_id: "...", score: 32, etc.}
    -- Delivery
    channels JSONB NOT NULL DEFAULT '["in_app"]',  -- ["in_app", "whatsapp", "email"]
    delivered_via JSONB DEFAULT '[]',
    -- Status
    is_read BOOLEAN NOT NULL DEFAULT false,
    read_at TIMESTAMPTZ,
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(company_id, user_id, is_read, created_at DESC);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    user_id UUID REFERENCES users(id),
    -- Action
    action VARCHAR(100) NOT NULL,  -- user.created, call.deleted, settings.updated, etc.
    resource_type VARCHAR(50),
    resource_id UUID,
    -- Details
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    -- Timestamp
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_company_date ON audit_logs(company_id, created_at DESC);

-- ==========================================
-- PLATFORM ANALYTICS (owner-only, not tenant-scoped)
-- ==========================================

CREATE TABLE platform_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_date DATE NOT NULL,
    -- Usage
    total_companies INT,
    active_companies INT,
    total_users INT,
    active_users INT,
    total_calls_processed INT,
    total_whatsapp_analyzed INT,
    -- Revenue
    mrr_cents BIGINT,
    -- Costs
    transcription_cost_cents BIGINT,
    ai_analysis_cost_cents BIGINT,
    storage_cost_cents BIGINT,
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(metric_date)
);
```

### Row-Level Security Setup

```sql
-- Enable RLS on all tenant tables
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ... (all tenant tables)

-- Policy: users can only see their own company's data
CREATE POLICY tenant_isolation ON calls
    USING (company_id = current_setting('app.current_company_id')::uuid);

-- Seller policy: sellers can only see their own calls
CREATE POLICY seller_own_calls ON calls
    FOR SELECT
    USING (
        company_id = current_setting('app.current_company_id')::uuid
        AND (
            user_id = current_setting('app.current_user_id')::uuid
            OR current_setting('app.current_user_role') IN ('owner', 'admin', 'manager')
        )
    );
```

---

## 6. API Endpoints

### Authentication

```
POST   /api/auth/register          -- Register new company + owner user
POST   /api/auth/login             -- Login, returns JWT
POST   /api/auth/refresh           -- Refresh access token
POST   /api/auth/forgot-password   -- Send password reset email
POST   /api/auth/reset-password    -- Reset password with token
POST   /api/auth/logout            -- Invalidate refresh token
```

### Company Management

```
GET    /api/company                -- Get current company profile
PUT    /api/company                -- Update company settings
PUT    /api/company/integrations   -- Update integration credentials (GoTo, Zoho, WATI, Z-API)
GET    /api/company/usage          -- Get current month usage stats
POST   /api/company/test-integration/:provider  -- Test integration connection
```

### User Management

```
GET    /api/users                  -- List users in company
POST   /api/users                  -- Create user (invite)
GET    /api/users/:id              -- Get user details
PUT    /api/users/:id              -- Update user
DELETE /api/users/:id              -- Deactivate user (soft delete)
PUT    /api/users/:id/role         -- Change user role
GET    /api/users/:id/stats        -- Get user performance stats
GET    /api/users/:id/evolution    -- Get user score evolution over time
```

### Calls

```
GET    /api/calls                  -- List calls (paginated, filterable)
  Query params: user_id, date_from, date_to, score_min, score_max, 
                outcome, call_type, status, page, limit, sort_by, sort_order
POST   /api/calls/upload           -- Manual audio upload
GET    /api/calls/:id              -- Get call details (metadata + score)
GET    /api/calls/:id/transcript   -- Get full transcript with segments
GET    /api/calls/:id/analysis     -- Get detailed AI analysis
GET    /api/calls/:id/scores       -- Get per-category scores
GET    /api/calls/:id/audio-url    -- Get presigned audio URL (expires in 1hr)
PUT    /api/calls/:id/classify     -- Manual classification override
DELETE /api/calls/:id              -- Delete call and all related data
POST   /api/calls/:id/reanalyze    -- Re-run AI analysis on existing transcript
POST   /api/calls/:id/sync-crm    -- Manually sync call score to CRM
```

### Dashboard / Analytics

```
GET    /api/dashboard/overview     -- Team overview stats
  Query params: date_from, date_to, user_id (optional)
GET    /api/dashboard/leaderboard  -- Team ranking
  Query params: date_from, date_to, metric (score, calls, conversion)
GET    /api/dashboard/heatmap      -- Skills x Sellers matrix
  Query params: date_from, date_to
GET    /api/dashboard/trends       -- Score trends over time
  Query params: date_from, date_to, user_id (optional), granularity (day, week, month)
GET    /api/dashboard/objections   -- Most common objections analysis
  Query params: date_from, date_to
GET    /api/dashboard/bant-rates   -- BANT completion rates
  Query params: date_from, date_to, user_id (optional)
GET    /api/dashboard/talk-ratio   -- Talk ratio distribution
  Query params: date_from, date_to, user_id (optional)
GET    /api/dashboard/correlation  -- Score vs conversion correlation
  Query params: date_from, date_to
GET    /api/dashboard/call-times   -- Best time to call analysis
  Query params: date_from, date_to
```

### WhatsApp

```
GET    /api/whatsapp/conversations       -- List conversations
  Query params: user_id, date_from, date_to, score_min, status, page, limit
GET    /api/whatsapp/conversations/:id   -- Get conversation with messages
GET    /api/whatsapp/conversations/:id/scores  -- Get conversation scores
GET    /api/whatsapp/stats               -- WhatsApp performance stats
POST   /api/whatsapp/webhook             -- Webhook receiver for WATI/Z-API
```

### SAC / Support

```
GET    /api/sac/tickets            -- List support tickets
POST   /api/sac/tickets            -- Create ticket manually
GET    /api/sac/tickets/:id        -- Get ticket details
PUT    /api/sac/tickets/:id        -- Update ticket
GET    /api/sac/tickets/:id/scores -- Get ticket scores
GET    /api/sac/stats              -- Support performance stats
GET    /api/sac/knowledge-gaps     -- Frequently unanswered questions
POST   /api/sac/tickets/:id/feedback  -- Submit actual CSAT for a ticket
```

### Coaching

```
GET    /api/coaching/plan          -- Get current coaching plan for user
POST   /api/coaching/plan/generate -- Generate new coaching plan
PUT    /api/coaching/tasks/:id     -- Mark task as completed
POST   /api/coaching/chat          -- AI coaching chat (RAG-powered)
GET    /api/coaching/role-plays    -- Get available role-play scenarios
POST   /api/coaching/role-plays/:id/start  -- Start a role-play session
POST   /api/coaching/role-plays/:id/message -- Send message in role-play
```

### Knowledge Base

```
GET    /api/knowledge-base/documents       -- List documents
POST   /api/knowledge-base/documents       -- Upload document
GET    /api/knowledge-base/documents/:id   -- Get document details
PUT    /api/knowledge-base/documents/:id   -- Update document
DELETE /api/knowledge-base/documents/:id   -- Delete document
POST   /api/knowledge-base/search          -- Search knowledge base (semantic)
```

### Score Configuration

```
GET    /api/score-config/categories        -- List score categories
PUT    /api/score-config/categories/:id    -- Update category weight/enabled
PUT    /api/score-config/threshold         -- Update alert threshold
GET    /api/score-config/benchmarks        -- Get platform benchmarks (anonymized)
```

### Notifications

```
GET    /api/notifications           -- List notifications (paginated)
PUT    /api/notifications/:id/read  -- Mark as read
PUT    /api/notifications/read-all  -- Mark all as read
GET    /api/notifications/preferences -- Get notification preferences
PUT    /api/notifications/preferences -- Update notification preferences
```

### Webhooks (Inbound)

```
POST   /api/webhooks/goto-connect   -- GoTo Connect call recording webhook
POST   /api/webhooks/wati           -- WATI WhatsApp message webhook
POST   /api/webhooks/zapi           -- Z-API WhatsApp message webhook
POST   /api/webhooks/zoho           -- Zoho CRM event webhook
POST   /api/webhooks/generic        -- Generic webhook for custom integrations
```

### Admin (Platform Owner Only)

```
GET    /api/admin/companies         -- List all companies
GET    /api/admin/metrics           -- Platform metrics
PUT    /api/admin/companies/:id/plan -- Change company plan
GET    /api/admin/companies/:id/usage -- Detailed usage for a company
```

---

## 7. UI/UX Recommendations

### Design System

**Theme:** Dark mode primary with optional light mode toggle. Dark theme conveys professionalism and modernity, reduces eye strain for managers reviewing dashboards throughout the day.

**Color Palette:**
```
Background:     #0F1117 (near-black)
Surface:        #1A1D27 (card backgrounds)
Surface-hover:  #252836
Border:         #2E3144
Text Primary:   #F0F0F3
Text Secondary: #8B8FA3
Accent:         #6366F1 (Indigo - primary actions)
Success:        #22C55E (green - good scores)
Warning:        #F59E0B (amber - average scores)
Danger:         #EF4444 (red - bad scores)
Info:           #3B82F6 (blue - informational)
```

**Typography:**
- Headings: Inter (700)
- Body: Inter (400)
- Monospace/Data: JetBrains Mono
- Score numbers: Tabular figures for alignment

**Score Color Coding (consistent everywhere):**
- 85-100: Bright green with subtle glow
- 70-84: Green
- 55-69: Amber/Yellow
- 40-54: Orange
- 0-39: Red

### Page Layouts

#### Landing Page (Marketing)
- Hero: "Know what happens on every call. Coach what matters." with product screenshot
- Problem/Solution: 3 pain points with solutions
- Features grid with illustrations
- Pricing table
- Social proof: logos, testimonials, case studies
- CTA: "Start Free Trial - 14 Days, No Credit Card"

#### Login / Register
- Clean centered card on dark background
- Company registration: name, slug, admin email, password
- Google SSO option
- "Already have an account?" toggle

#### Seller Dashboard (Home)

```
+----------------------------------------------------------+
| [Logo]  Dashboard  My Calls  Coaching    [Avatar] [Bell] |
+----------------------------------------------------------+
|                                                          |
|  +------------------+  +-----------+  +----------------+ |
|  | MY SCORE         |  | CALLS     |  | STREAK         | |
|  | [Gauge: 72/100]  |  | Today: 8  |  | 5 calls > 70  | |
|  | +3 from last wk  |  | Week: 34  |  | Personal best! | |
|  +------------------+  +-----------+  +----------------+ |
|                                                          |
|  +-----------------------------------------------------+ |
|  | SCORE TREND (30 days)                                | |
|  | [Sparkline chart with daily average]                 | |
|  +-----------------------------------------------------+ |
|                                                          |
|  +-----------------------------------------------------+ |
|  | SKILL BREAKDOWN                                      | |
|  | Opening    [=======----] 72                          | |
|  | Discovery  [====-------] 45  <-- Focus area          | |
|  | Presenting [========---] 78                          | |
|  | Objections [======-----] 65                          | |
|  | Closing    [=====------] 55                          | |
|  | Communic.  [=========--] 88                          | |
|  +-----------------------------------------------------+ |
|                                                          |
|  +-----------------------------------------------------+ |
|  | RECENT CALLS                                         | |
|  | [Score] [Date] [Prospect] [Duration] [Outcome] [>>] | |
|  |  [85]  Today  J. Silva    12:34      Meeting    >>  | |
|  |  [42]  Today  M. Santos   3:21       No answer  >>  | |
|  |  [71]  Yest.  A. Costa    18:02      Proposal   >>  | |
|  +-----------------------------------------------------+ |
+----------------------------------------------------------+
```

#### Manager Dashboard (Home)

```
+----------------------------------------------------------+
| [Logo]  Overview  Team  Alerts  Analytics    [Avatar]    |
+----------------------------------------------------------+
|                                                          |
|  +----------+  +---------+  +----------+  +----------+  |
|  | TEAM AVG |  | CALLS   |  | TOP      |  | ALERTS   |  |
|  | 67/100   |  | 142/wk  |  | Ana: 82  |  | 3 new    |  |
|  | +5 trend |  | +12%    |  | streak:8 |  | [review] |  |
|  +----------+  +---------+  +----------+  +----------+  |
|                                                          |
|  +-------------------------+  +------------------------+ |
|  | LEADERBOARD             |  | SKILLS HEATMAP         | |
|  | 1. Ana Silva    82 (+2) |  |        Op Di Pr Ob Cl  | |
|  | 2. Pedro Costa  78 (-1) |  | Ana    89 75 82 80 85  | |
|  | 3. Maria Luz    74 (+1) |  | Pedro  82 80 75 72 78  | |
|  | 4. João Reis    65 (=)  |  | Maria  70 78 74 68 75  | |
|  | 5. Carlos M.    58 (-2) |  | João   65 55 70 60 62  | |
|  +-------------------------+  | Carlos 50 42 60 55 58  | |
|                               +------------------------+ |
|                                                          |
|  +-----------------------------------------------------+ |
|  | SCORE DISTRIBUTION (This Week)                       | |
|  | [Histogram: how many calls in each score bucket]     | |
|  +-----------------------------------------------------+ |
|                                                          |
|  +-----------------------------------------------------+ |
|  | CALLS NEEDING REVIEW (Score < 40)                    | |
|  | [Score] [Seller] [Prospect] [Issues]          [>>]   | |
|  |  [28]  Carlos    Big Corp   No discovery, 80% talk   | |
|  |  [35]  João      Tech Inc   Missed objections        | |
|  +-----------------------------------------------------+ |
+----------------------------------------------------------+
```

#### Call Detail Page

```
+----------------------------------------------------------+
| [< Back]  Call with J. Silva  |  Score: 72/100  [Green]  |
+----------------------------------------------------------+
|                                                          |
| +--LEFT PANEL (60%)--+ +--RIGHT PANEL (40%)-----------+ |
| | AUDIO PLAYER       | | SCORECARD                    | |
| | [====>----] 12:34  | | Overall: 72                  | |
| | [|<] [<<] [>] [>>] | | Opening:     82  [=======]   | |
| |                     | | Discovery:   65  [=====]     | |
| | TRANSCRIPT          | | Presenting:  78  [======]    | |
| | [Seller] 0:02       | | Objections:  70  [======]    | |
| | "Hi João, this is   | | Closing:     55  [====]      | |
| |  Ana from TDF..."   | | Communic.:   85  [========]  | |
| |                     | |                              | |
| | [Prospect] 0:08     | | SPIN COVERAGE: 3/4          | |
| | "Hi Ana, yes I      | | [x] Situation                | |
| |  remember you..."   | | [x] Problem                  | |
| |                     | | [x] Implication              | |
| | [Seller] 0:15       | | [ ] Need-Payoff  <-- missed  | |
| | [GREEN HIGHLIGHT]   | |                              | |
| | "Last time we spoke | | BANT: 2/4                    | |
| |  you mentioned the  | | [x] Need                     | |
| |  water quality..."  | | [x] Timeline                 | |
| |                     | | [ ] Budget                   | |
| | [RED HIGHLIGHT]     | | [ ] Authority                | |
| | [Seller] 4:30       | |                              | |
| | "So our price is    | | TALK RATIO: 42% / 58%       | |
| | R$2.500 and..."     | | [========|==========]        | |
| | (monologue: 90s)    | |  Seller    Prospect          | |
| |                     | |                              | |
| +---------------------| | COACHING TIPS                | |
|                        | | 1. Great rapport building   | |
|                        | | 2. Ask Need-Payoff Qs next  | |
|                        | | 3. Confirm budget early     | |
|                        | +------------------------------| |
+----------------------------------------------------------+
```

### Mobile Design (Seller)

- Bottom tab navigation: Dashboard | Calls | Coaching | Profile
- Calls list as cards with score badge, swipe for actions
- Call detail: transcript scrollable, scorecard collapsible at top
- Pull-to-refresh on all lists
- Push notifications for coaching reminders
- Offline: cache last 10 call scores for review

### Key Interaction Patterns

1. **Score gauge animation:** When opening a call, the score gauge animates from 0 to the final score (1 second, ease-out). Creates a moment of anticipation.

2. **Transcript-audio sync:** Clicking on any transcript segment jumps the audio player to that timestamp. The current segment is highlighted as audio plays.

3. **Drill-down everywhere:** Every number on the manager dashboard is clickable and drills down to the supporting data.

4. **Comparison mode:** Manager can select 2 sellers and see their metrics side-by-side, with differences highlighted.

5. **Keyboard shortcuts:** Power users can navigate with keyboard (j/k for next/previous call, space for play/pause, s for skip to next speaker).

---

## 8. Improvements Over Match Sales

### 15 Specific Improvements

| # | Improvement | Match Sales | CallScore AI | Business Impact |
|---|------------|-------------|--------------|-----------------|
| 1 | **Automatic recording pull** | Manual upload or limited integrations | GoTo Connect + webhook for any VoIP -- zero manual work | Eliminates 100% of upload friction. Every call is captured. |
| 2 | **Real-time WhatsApp alerts** | Email notifications only | WhatsApp message to manager within 2 minutes of a bad call | Manager can intervene immediately, not hours later |
| 3 | **RAG-powered coaching** | Generic sales tips | Coaching grounded in company's own playbook, product catalog, and pricing | Suggestions are actually actionable because they reference real products and processes |
| 4 | **SAC/Support scoring** | Sales only | Full support quality module with CSAT prediction | Addresses a completely unserved market segment |
| 5 | **Native Zoho CRM** | Pipedrive focus | Score auto-syncs to Zoho Deal record as custom field | Zoho has 100M+ users globally. Match Sales ignores them. |
| 6 | **WhatsApp conversation scoring** | Basic or none | Full conversation analysis with response time, qualification, follow-up | WhatsApp is the #1 sales channel in Brazil/LatAm |
| 7 | **Multi-tenant from day 1** | Single company tool | Each company isolated with own data, config, and branding | Can sell to unlimited companies without custom deployments |
| 8 | **Configurable scoring weights** | Fixed scoring model | Companies can adjust category weights to match their sales methodology | A B2B SaaS company and a real estate company have different priorities |
| 9 | **Role-play simulator** | No | AI-generated practice scenarios based on seller's weak areas | Practice without risk, anytime, from mobile |
| 10 | **Portuguese-first** | English/Spanish focus | Built for Brazilian Portuguese with proper cultural context | Brazilian colloquialisms, negotiation patterns, and sales culture understood |
| 11 | **Knowledge gap detection (SAC)** | No | AI identifies questions support agents cannot answer well | Feeds back into training and documentation improvement |
| 12 | **Score-to-conversion correlation** | Shows scores in isolation | Scatter plot showing call score vs deal conversion rate | Proves ROI -- "sellers above 70 convert 2.3x more" |
| 13 | **Manager 1-on-1 agenda generator** | No | AI creates talking points for each seller's coaching session based on recent call patterns | Saves manager 30+ minutes per week in coaching prep |
| 14 | **Call timing intelligence** | No | Analysis of when calls score highest and when prospects are most receptive | Data-driven call scheduling improves connect rates |
| 15 | **Gamification with streaks** | Basic leaderboard | Streak tracking, badges, personal bests, team challenges | Drives intrinsic motivation beyond just a ranking number |

---

## 9. Monetization Model

### Pricing Philosophy

- **Per-seat pricing** (not per-call) -- customers want predictable costs
- **Call volume tiers** within each plan -- prevents abuse while remaining fair
- **Annual discount** of 20% to reduce churn and improve LTV

### Pricing Tiers

| Feature | Starter | Professional | Enterprise |
|---------|---------|-------------|------------|
| **Price** | R$ 89/user/month | R$ 149/user/month | R$ 249/user/month |
| **Annual Price** | R$ 69/user/month | R$ 119/user/month | R$ 199/user/month |
| **Minimum Users** | 3 | 5 | 10 |
| **Calls/month** | 200 per user | 500 per user | Unlimited |
| **Call Scoring** | Yes | Yes | Yes |
| **WhatsApp Analysis** | No | Yes | Yes |
| **SAC Module** | No | No | Yes |
| **CRM Integration** | Zoho only | Zoho + Pipedrive | All CRMs + custom |
| **Knowledge Base (RAG)** | 5 documents | 50 documents | Unlimited |
| **Coaching Module** | Basic tips | Full coaching + role-play | Full + custom scenarios |
| **Real-time Alerts** | In-app only | In-app + WhatsApp | In-app + WhatsApp + email |
| **Manager Dashboard** | Basic | Full analytics | Full + custom reports |
| **API Access** | No | Read-only | Full read/write |
| **Custom Scoring** | No | Weight adjustment | Full custom categories |
| **Data Retention** | 90 days | 1 year | Unlimited |
| **Support** | Email | Email + chat | Dedicated CSM |
| **White Label** | No | No | Custom branding |
| **SSO/SAML** | No | No | Yes |

### Revenue Projections

**Assumptions for Year 1:**
- Month 1-3: 5 companies (beta/free), average 8 users
- Month 4-6: 20 companies, average 10 users, 60% Professional
- Month 7-12: 50 companies, average 12 users, 50% Professional, 10% Enterprise

**Monthly recurring revenue targets:**
- Month 6: R$ 25.000 MRR
- Month 12: R$ 80.000 MRR
- Month 18: R$ 200.000 MRR

### Free Trial Strategy

- **14-day free trial** of Professional plan (no credit card required)
- Full access to all Professional features during trial
- Limit: 5 users, 50 calls analyzed
- Automated email sequence during trial (day 1, 3, 7, 10, 13)
- Day 13 email: "Your trial ends tomorrow. Here's what you'll lose access to: [personalized stats]"
- **Conversion target:** 15-20% trial-to-paid

### Additional Revenue Streams

1. **Overage charges:** R$ 0.50 per call above plan limit
2. **Add-on modules:** SAC module available as add-on for Professional (R$ 49/user/month)
3. **Professional services:** Custom integration setup, custom scoring model design (R$ 5.000-15.000 one-time)
4. **Partner/reseller program:** 20% revenue share for agencies that sell CallScore AI to their clients
5. **API marketplace:** Charge third-party integrations for API access

---

## 10. Roadmap

### Phase 1: MVP Core (Weeks 1-4)

**Goal:** Working call scoring with dashboard for a single company (Tudo de Filtro as beta).

**Week 1: Foundation**
- [x] Project setup (Next.js + TypeScript + Tailwind + shadcn)
- [x] Database schema creation (PostgreSQL + Drizzle migrations)
- [x] Authentication system (NextAuth.js with email/password)
- [x] Company and user management CRUD
- [x] Dark theme design system setup

**Week 2: Call Processing Pipeline**
- [x] Audio upload endpoint (manual upload)
- [x] GoTo Connect integration: poll recordings API
- [x] Deepgram transcription worker with speaker diarization
- [x] BullMQ job queue setup with Redis
- [x] Audio storage to R2/S3

**Week 3: AI Analysis & Scoring**
- [x] Claude API integration for call analysis
- [x] Prompt engineering for SPIN/BANT/objection detection
- [x] Scoring engine with weighted categories
- [x] Call detail page with transcript + scorecard
- [x] Audio player with transcript sync

**Week 4: Dashboards**
- [x] Seller dashboard: score gauge, trend, recent calls, skill breakdown
- [x] Manager dashboard: team overview, leaderboard, heatmap
- [x] Call list with filters and search
- [x] Basic in-app notifications

**Deliverable:** Working product that can analyze calls from GoTo Connect, score them, and display results in dashboards. Tudo de Filtro uses it as beta.

### Phase 2: Integrations & WhatsApp (Weeks 5-8)

**Week 5: CRM Integration**
- [ ] Zoho CRM OAuth flow
- [ ] Auto-sync call scores to Deal records
- [ ] Auto-create Call Activity in Zoho
- [ ] CRM field mapping configuration UI

**Week 6: WhatsApp Analysis**
- [ ] WATI webhook receiver
- [ ] Z-API webhook receiver
- [ ] Conversation threading logic
- [ ] WhatsApp scoring engine (response time, quality, etc.)
- [ ] WhatsApp dashboard section

**Week 7: Alerts & Notifications**
- [ ] Real-time WhatsApp alerts via WATI API
- [ ] Daily digest generation (email via Resend)
- [ ] Alert threshold configuration UI
- [ ] Notification preferences per user

**Week 8: Coaching Module v1**
- [ ] AI coaching plan generation
- [ ] Task tracking (checklist-style)
- [ ] AI coaching chat (RAG-powered with knowledge base)
- [ ] Knowledge base upload and indexing

**Deliverable:** Full integration suite. Calls auto-sync to Zoho. WhatsApp conversations analyzed. Managers get WhatsApp alerts for bad calls.

### Phase 3: SAC Module & Multi-Tenant (Weeks 9-12)

**Week 9: SAC/Support Module**
- [ ] Support call scoring model
- [ ] CSAT prediction engine
- [ ] FCR tracking
- [ ] Knowledge gap detection
- [ ] Support-specific dashboard

**Week 10: Multi-Tenant Architecture**
- [ ] Row-Level Security policies
- [ ] Company registration self-service
- [ ] Billing integration (Stripe)
- [ ] Plan enforcement (call limits, feature gates)
- [ ] Usage tracking and metering

**Week 11: Advanced Analytics**
- [ ] Score-to-conversion correlation
- [ ] Call timing analysis
- [ ] Objection frequency reports
- [ ] BANT completion trends
- [ ] Exportable PDF reports

**Week 12: Polish & Launch Prep**
- [ ] Marketing landing page
- [ ] Onboarding wizard (step-by-step setup)
- [ ] Documentation / help center
- [ ] Performance optimization
- [ ] Security audit
- [ ] Load testing

**Deliverable:** Multi-tenant SaaS ready for paying customers. SAC module live. Self-service registration with Stripe billing.

### Phase 4: Market Launch & Growth (Weeks 13-16)

**Week 13: Launch**
- [ ] ProductHunt launch
- [ ] LinkedIn launch campaign
- [ ] First 10 paying customers
- [ ] Referral program setup

**Week 14: Role-Play Simulator**
- [ ] AI persona generation
- [ ] Text-based role-play interface
- [ ] Scoring of role-play sessions
- [ ] Scenario library management

**Week 15: Additional CRM Integrations**
- [ ] Pipedrive integration
- [ ] HubSpot integration
- [ ] Generic webhook for custom CRMs

**Week 16: Advanced Features**
- [ ] Team challenges / gamification
- [ ] Custom report builder
- [ ] API documentation for third-party integrations
- [ ] White-label option for Enterprise
- [ ] Mobile-optimized PWA

**Deliverable:** Market-ready product with multiple CRM integrations, gamification, and enterprise features. Actively selling.

### Phase 5: Scale (Months 5-6)

- Voice-based role-play (WebRTC + real-time AI)
- Spanish language support
- Salesforce managed package
- Enterprise SSO (SAML/OIDC)
- Advanced analytics: win/loss prediction model
- Partner/reseller portal
- Mobile native app (React Native)

---

## 11. Architectural Decision Records

### ADR-001: Modular Monolith over Microservices for MVP

**Status:** Accepted

**Context:** We need to choose an architecture for the initial product. The team is small (1-3 developers). The domain boundaries are not yet proven in production. We need to ship in 4 weeks.

**Decision:** Build as a modular monolith with an internal event bus (BullMQ). Each module (auth, calls, scoring, coaching, notifications) is a separate directory with clear boundaries, communicating through events. The database is shared but uses schemas/prefixes for logical separation.

**Consequences:**
- Easier: Deployment, debugging, cross-module queries, developer onboarding
- Harder: Independent scaling of hot modules (transcription), independent deployment of features
- Migration path: Any module can be extracted to a service by replacing the in-process event with a real message queue (the event contract stays the same)

### ADR-002: Deepgram over Whisper for Transcription

**Status:** Accepted

**Context:** We need speech-to-text with speaker diarization, supporting Brazilian Portuguese. Options: Deepgram Nova-2, OpenAI Whisper API, self-hosted Whisper, AssemblyAI.

**Decision:** Use Deepgram Nova-2 as primary provider. Keep Whisper as fallback for cost optimization at scale.

**Consequences:**
- Easier: No GPU infrastructure, fast turnaround (~1/4 of audio duration), excellent Portuguese support, built-in diarization
- Harder: Ongoing API cost (vs self-hosted Whisper), vendor dependency
- Cost: ~$0.0043/minute (Nova-2). A 15-minute call costs ~$0.065. 1000 calls/month = ~$65/month.

### ADR-003: Row-Level Security for Multi-Tenancy

**Status:** Accepted

**Context:** Multi-tenant data isolation is critical for a SaaS product. Options: separate databases per tenant, schema per tenant, shared schema with RLS, application-level filtering.

**Decision:** Shared PostgreSQL database with Row-Level Security (RLS) policies. Every table has a `company_id` column. RLS policies enforce isolation at the database layer.

**Consequences:**
- Easier: Single database to maintain, migrations apply once, connection pooling, cross-tenant analytics for platform owner
- Harder: Must remember to set session context before every query, potential for noisy-neighbor performance issues
- Mitigation: Supabase handles RLS context automatically. For noisy neighbors, we can move large tenants to dedicated schemas in Enterprise tier.

### ADR-004: Claude API over GPT-4 for Analysis

**Status:** Accepted

**Context:** The AI analysis engine needs to understand nuanced sales conversations, detect SPIN stages, evaluate objection handling quality, and generate coaching advice. This requires strong reasoning and Portuguese language understanding.

**Decision:** Use Claude (claude-sonnet-4-20250514) for all analysis. Use structured output (JSON mode) for consistent scoring.

**Consequences:**
- Easier: Superior reasoning for nuanced analysis, better Portuguese understanding, structured output reliability, generous context window for long transcripts
- Harder: Anthropic API availability dependency, cost per analysis (~$0.05-0.15 per call depending on length)
- Cost: Average call transcript ~3000 tokens input + 2000 tokens output. At Sonnet pricing, ~$0.025/call. 1000 calls/month = ~$25/month.

### ADR-005: Next.js Full-Stack over Separate Frontend/Backend

**Status:** Accepted

**Context:** We need both a web application and API. Team is small. Options: separate React SPA + Node.js API, Next.js full-stack, Remix.

**Decision:** Use Next.js 14 with App Router for both frontend and API (tRPC for type-safe API, Server Components for dashboard performance).

**Consequences:**
- Easier: Single codebase, shared types, SSR for dashboards, Vercel deployment, faster development
- Harder: Background workers still need separate process (Railway), less flexibility in API framework
- Trade-off accepted: Workers run as a separate Node.js process on Railway, consuming the same job queue.

### ADR-006: BullMQ over SQS/RabbitMQ for Job Queue

**Status:** Accepted

**Context:** Call processing is a multi-step pipeline (ingest -> transcribe -> analyze -> score -> notify). Each step can fail and needs retry. We need job prioritization and concurrency control.

**Decision:** Use BullMQ backed by Redis (Upstash) for the job queue. Each processing step is a separate queue with configurable concurrency and retry policies.

**Consequences:**
- Easier: Node.js native, excellent DX, built-in retry/backoff, dashboard (Bull Board), no additional infrastructure beyond Redis
- Harder: Redis is a single point of failure (mitigated by Upstash HA), message ordering not guaranteed (acceptable for our use case)
- Cost: Upstash Redis free tier handles MVP. Pro tier ($10/month) handles 10K+ jobs/day.

---

## Appendix A: Claude API Prompt Template for Call Analysis

```
You are an expert sales call analyst. Analyze the following sales call transcript and provide a structured evaluation.

COMPANY CONTEXT:
{company_name} sells {products_description}. Their target customer is {target_customer}.

SCORING CRITERIA:
{scoring_categories_with_weights}

TRANSCRIPT:
{transcript_with_speaker_labels}

Provide your analysis as JSON with the following structure:
{
  "call_classification": {
    "call_type": "cold_call|follow_up|demo|negotiation|closing|support",
    "outcome": "connected|voicemail|wrong_number|callback|meeting_booked|proposal_sent|closed_won|closed_lost",
    "lead_temperature": "hot|warm|cold"
  },
  "spin_analysis": {
    "situation_questions": [{"text": "...", "timestamp_approx": "mm:ss"}],
    "problem_questions": [...],
    "implication_questions": [...],
    "need_payoff_questions": [...],
    "coverage": 0-4
  },
  "bant_analysis": {
    "budget": {"detected": true/false, "evidence": "...", "timestamp_approx": "mm:ss"},
    "authority": {...},
    "need": {...},
    "timeline": {...},
    "completion": 0-4
  },
  "objections": [
    {
      "type": "price|timing|authority|trust|status_quo|need",
      "objection_text": "...",
      "handling_steps_present": ["acknowledge", "clarify", "reframe", "evidence", "confirm"],
      "handling_quality": 0-100,
      "timestamp_approx": "mm:ss"
    }
  ],
  "scores": {
    "opening_rapport": {
      "score": 0-100,
      "reasoning": "...",
      "evidence": ["quote from transcript"]
    },
    "discovery_qualification": {...},
    "presentation_value": {...},
    "objection_handling": {...},
    "closing_next_steps": {...},
    "communication_skills": {...}
  },
  "communication_metrics": {
    "filler_words_detected": ["word: count"],
    "longest_monologue_approx_seconds": 0,
    "interruptions_by_seller": 0,
    "questions_asked_by_seller": 0
  },
  "sentiment_trajectory": [
    {"quarter": 1, "sentiment": "neutral|positive|negative", "note": "..."},
    {"quarter": 2, ...},
    {"quarter": 3, ...},
    {"quarter": 4, ...}
  ],
  "coaching": {
    "strengths": [
      {"area": "...", "evidence": "transcript quote", "impact": "..."}
    ],
    "improvements": [
      {"area": "...", "suggestion": "...", "example_script": "what the seller could have said"}
    ],
    "next_steps_defined": true/false,
    "next_steps_text": "..."
  }
}
```

---

## Appendix B: Cost Analysis per Call

| Component | Cost per Call (15 min avg) | 1000 calls/month |
|-----------|--------------------------|-------------------|
| Deepgram transcription | $0.065 | $65 |
| Claude analysis | $0.025 | $25 |
| Audio storage (R2) | $0.001 | $1 |
| Redis/Queue | negligible | $10 (flat) |
| Database | negligible | $25 (flat) |
| **Total variable** | **$0.091** | **$91** |
| **Total with fixed** | - | **$126** |

**At Professional pricing (R$ 149/user/month, assuming 10 users = R$ 1.490/month = ~$280/month):**
- Cost: $126
- Gross margin: 55%
- Scales favorably: fixed costs stay flat, variable costs grow linearly

---

## Appendix C: Competitive Intelligence Checklist

Before launch, validate against these competitors:

1. **Match Sales** (Brazil) -- Primary competitor. Differentiate on integrations and WhatsApp.
2. **Gong.io** (US) -- Enterprise, expensive ($100+/user). We target SMB at 1/5 the price.
3. **Chorus.ai** (US, acquired by ZoomInfo) -- Enterprise focus, no Portuguese.
4. **ExecVision** (US) -- Similar feature set but no WhatsApp, no Portuguese.
5. **Refract** (UK) -- Good coaching features, benchmark our coaching module against theirs.
6. **Jiminny** (UK) -- Strong conversation intelligence, good UX reference.
7. **SalesLoft** (US) -- Has conversation intelligence as one feature. We are specialized.
8. **Dialpad** (US) -- Built-in AI. But no CRM-native scoring.

**Our moat:** Portuguese-first + WhatsApp-native + Zoho-native + RAG coaching. No one else combines all four.

---

*End of Specification Document*
*CallScore AI v1.0 -- Ready for Development*
