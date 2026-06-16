# GovHub Capture — Build Guide for the Remaining 4 Tabs
**Read this first. It is the contract for building Staffing, Past Performance, Pricing, and Data Calls.**

This repo already contains three completed Capture tabs — **Strategy & Plan**, **Teaming**, and **Solutioning** — built to a pattern that the product owner (Greg Dameron) reviewed and accepted after an earlier version was rejected. Your job is to build the remaining four tabs **to the same pattern**, reading their content from the JSON data files (one per tab) without inventing any values.

Do not redesign the pattern. Do not "improve" the established tabs. Match them.

---

## PART 1 — The validated pattern (applies to every tab)

### 1.1 The shell / chrome
Every Capture tab reuses the same outer frame, already implemented for Strategy/Teaming/Solutioning:
- Top app header, stage tab bar (Identify · Intel & Analysis · **Capture** · Proposal · Post-Submission), and the Capture subnav (the 7 tabs).
- **Opportunity header** (identical on every tab): `Enterprise Cloud Migration and Modernization Services · DHS-2026-CLOUD-0042 · EAGLE II SB · 8(a) · pWin 35% · $45.0M · Award 2026-07-15 · ON_TRACK`. These values must agree across all tabs.
- **Plan header strip:** overall confidence chip · "N / M confirmed (or validated)" · "Drafted by {Agent Name} · v3 · 2026-02-10" · a triage filter · Regenerate · **Preview cascade** button.
- **Per-section action row:** Confirm (solid primary) · Request Review (outline) · Edit · Ask AI · feeds-to chips. Confirm is disabled on any FAILED item.
- **Ask AI** is a right-side drawer scoped to the current section, with suggested questions. Never a third panel.

### 1.2 FAIR — the storyline of every section
Each section tells a four-band story, in this order:
- 📋 **Facts** — what is true / what was asked. Plus 📎 source chips at the bottom.
- 🔍 **Analysis** — the read on it + the proposed approach (statement, method, metric).
- 🧠 **Intelligence** — the edge: competitive/internal read, framed with a 🔒 **Internal only** treatment where the content is competitive intelligence (never proposal text).
- ✅ **Recommendations / Validation** — discrete items with accept (✓) / reject (✕) / edit (✏️) buttons.

### 1.3 The intelligence envelope (per section)
Every section carries, bound from its JSON:
- A **confidence chip** (green ≥75 / amber 50–74 / red <50) in the section header **and** in the left index/rail.
- A 🤖 **AI Reasoning** band directly under the header (the `aiReasoning` text, verbatim).
- 📎 **source chips** (from `sources[]`, verbatim labels).
- A **Version History** link (from `versionHistory`).
- An **Edit** affordance.
- The overall confidence chip + agent byline in the plan header.

### 1.4 Hard rules (these are why the earlier version was rejected — do not break them)

**RULE A — Bind verbatim. Never invent.** Every value comes from the tab's JSON file. Never paraphrase, summarize, re-author, or "improve" any value — including long text fields. If a long value doesn't fit, truncate with an ellipsis; do not reword. If a field is absent or null, omit the UI element — do not fill the gap. Header and body must agree everywhere.

**RULE B — Anti-flattening.** Render *every* field of each object. If the JSON has 5 items in an array, show 5. Do not collapse a multi-sentence field into one line. The product owner specifically wants depth; he reads these top to bottom.

**RULE C — GRD-001 (the SBS moat — only relevant to Solutioning's 3-Rule grid, but know it).** The validation methodology is IP. Show **outputs** (verdicts: Pass/Conditional/Fail; the three rule *names*: Demonstrable/Differentiating/Defensible; overall verdict; rationales; quality scores like HOW%). Never show **mechanics** (per-rule numeric scores, the thresholds behind verdicts, weights, formulas, or rule definitions). The JSON contains no forbidden values by design — do not generate any.

**RULE D — Source tier discipline.** Two of the four JSON files (Past Performance, Pricing) are **derived mock data**, not captured agent output. They carry a `_provenance` field saying so. That field must travel with the data; never present derived data as live agent output.

### 1.5 States every tab must support
- **Low-confidence banner:** any section with confidence <50 shows, under its AI Reasoning band, the verbatim text: **"This recommendation is based on limited data. Run ANALYZE workflow for better intelligence."**
- **Conflict callout:** where the JSON has a `conflicts[]` entry, an amber warning callout with the message verbatim.
- **Backward-engineering cascade** (the "Preview cascade" toggle): this is the cross-tab DataBridge story. In Strategy, the user rejects partner DataBridge. That single edit propagates: Teaming (card → Declined), Solutioning (sol-1 PASSED → CONDITIONAL), and it must also land in **Staffing** (the DataBridge-provided Data Migration Lead is removed) and **Pricing** (the $9M subcontractor line drops). When building Staffing and Pricing, wire their `cascade` state to this same event, consistent with the three existing tabs. The toast pattern: "Change detected — downstream flagged for regeneration: {tabs}."

### 1.6 The three-source method (how each tab was designed)
Each tab synthesizes three sources, never just one: **(1) content** ← the tab's JSON file; **(2) interaction surface** ← the existing tab patterns in this repo (study Strategy for the document layout, Teaming for the operational/board layout); **(3) the agent contract** ← the envelope fields already baked into the JSON. You are implementing (1) and (2); (3) is already in the data.

### 1.7 UX polish standard (already applied to the three tabs — match it)
- Accept/reject/edit buttons: ≥32×32px hit area, ≥8px apart, with hover tooltips.
- Lists/tables of 4+ rows: show the first 3, collapse the rest behind "Show all N".
- Facts band: emphasize the 2–3 decision-critical facts; demote the rest to secondary grey.
- Button hierarchy: Confirm solid → Request Review outline → Edit/Ask AI tertiary.
- All secondary grey text must clear WCAG 4.5:1.
- Use the design system tokens (`--gh-*`), never hardcoded colors.

---

## PART 2 — The four tabs to build

Build order (lowest risk first): **Staffing → Data Calls → Pricing → Past Performance**. The first two have real JSON; the last two are derived (and Pricing/Staffing share the cascade wiring, so build Staffing before Pricing).

### TAB 4 — Staffing (CAP-065 · Staffing Intelligence Agent / SFI-001)
- **Data:** `opp-001-staffing.json` (real, exists in Zulu). Layout: **operational**, like Teaming's board — but the operational pattern here is **LCAT → candidate drill-down** (the product owner asked for this explicitly).
- **Structure:** top `staffingOverview` panel (33 FTE, prime 18 / sub 15, 3 Key Personnel, 5 critical / 8 commodity positions, clearance breakdown TS-SCI 18 / Secret 12 / Public Trust 3, overall readiness 72, MEDIUM risk). Then an **LCAT rail/list** — each LCAT (LCAT-01 Program Manager, etc.) shows designation (Key/Critical/Commodity), importance (Discriminator/…), FTE, and a **fill status**. Clicking an LCAT opens its detail: the full `requirements` (education/experience/certifications/clearance, all verbatim) and the **`candidates[]`** — each candidate as a card with matchScore, source (Internal/External), relevantExperience, `strengths[]`, `concerns[]`, status (committed/reviewing/sourcing/partner), LOI status, availability. The candidate detail is the drill-down; do not flatten the strengths/concerns into one line.
- **FAIR mapping:** Facts = the overview + LCAT requirements; Analysis = candidate fit (matchScore, relevant experience); Intelligence = strengths/concerns/competitive notes (e.g., a candidate currently at Peraton — 🔒); Recommendations = lock/source/interview actions.
- **Cascade:** rejecting DataBridge removes the partner-provided Data Migration Lead candidate(s); the relevant LCAT drops to "sourcing", readiness recalculates.
- **Confidence:** the JSON's `staffingHealth.overallReadiness` (72) maps to the plan-header confidence.

### TAB 5 — Data Calls (CAP-068 · Data Calls Agent / DCA-001) — Tab 7, lives inside Capture
- **Data:** `opp-001-datacalls.json` (real, exists in Zulu). Layout: **document**, like Strategy.
- **Structure:** `collectionStrategy` panel up top — the **4 phases** (Pre-TA / Post-TA / Proposal Development / Final Verification) with timelines and status, plus quality standards. Then the `dataCalls[]` — each (DC-001 Internal Past Performance, DC-002 Key Personnel Packages, …) with phase, status, priority, owner, dates, and its **`items[]`** — each item with deliverable, qualityScore, and `qualityNotes` (verbatim). The phase grouping is the spine (Pre-TA vs Post-TA is a core distinction).
- **FAIR mapping:** Facts = the data call + items + deliverables; Analysis = status/progress against due dates; Intelligence = quality notes (e.g., DC-001-02's "FinOps savings data needs independent verification" — this note is the source of a flag that already appears in Solutioning, keep it consistent); Recommendations = next collection actions.
- **Note:** Data Calls is the natural home of the past-performance quality flags that Past Performance and Pricing depend on — keep the qualityNotes wording identical across tabs.

### TAB 6 — Pricing (CAP-067 · Pricing Agent / PRC-001) — JSON must be DERIVED
- **Data:** `opp-001-pricing.json` — **does not exist; will be provided as derived mock data** (with `_provenance`). Derived from: `pricingStrategy` in strategy.json (PTW $42M), the `workshareAllocation` in teaming.json ($45M total; 55/20/15/10), and the labor/rates implied by staffing.json.
- **Layout:** **operational**. The product owner asked specifically for a **price-to-win vs build-up "hourglass"** view — i.e., two estimates converging: top-down PTW ($42.0M competitive analysis) and bottom-up build-up ($44.2M engineering estimate), meeting at the proposed number. Build the hourglass as the centerpiece (the Facts/Analysis bands).
- **Cascade:** this tab is wired to the DataBridge event — rejecting the partner drops the $9M subcontractor line from the build-up; the hourglass and totals recalculate. Pricing also has a **ROM live-link to Staffing** (labor cost flows from staffing FTE × rates).
- **Wait for the derived JSON before building.** Do not invent pricing numbers.

### TAB 7 — Past Performance (CAP-066 · Past Performance Agent / PPF-001) — JSON must be DERIVED
- **Data:** `opp-001-pastperformance.json` — **does not exist; will be provided as derived mock data** (with `_provenance`). Derived from: the 3 references in strategy.json, the DC-001 package in datacalls.json (DHS Cybersecurity Modernization / Exceptional, Army Cloud Migration / Very Good, Treasury IT Modernization / Very Good), and partner references (GovFlow DHS ServiceNow $3.1M; DataBridge USCIS $4.2M).
- **Layout:** **document**, like Strategy.
- **CRITICAL DATA RULE:** every CPARS reference must be labeled **"estimated — public data inference"**. Direct CPARS access is government-restricted; the platform never claims direct CPARS data. This label is non-negotiable and appears wherever a CPARS rating is shown.
- **FAIR mapping:** Facts = the reference (contract, agency, value, period, CPARS-estimated); Analysis = relevance to this pursuit + how it maps to evaluation factors; Intelligence = the discriminating angle (same-agency, recency) 🔒; Recommendations = use as lead/supporting reference, gaps to close.
- **Wait for the derived JSON before building.**

---

## PART 3 — What NOT to build yet (in active debate — do not implement)

These are under discussion with the product owner and the engineering lead and are **not settled**. Do not build them into the tabs:
1. **Stepper navigation / sequential locking.** There is a live decision about converting the Capture subnav from tabs to a stepper with locked/needs-review/in-regeneration states. **Until ratified, keep the existing tab navigation.** Do not implement step locking.
2. **The editing-interaction model** (structured forms vs. freeform chat for content modification within locked steps) — unresolved.
3. **Multi-user concurrency** (check-out, the "reality gap") — deferred.
4. **The DAG-based projected-impact / change-log feature** — designed but not approved. The current "Preview cascade" demo toggle is the only cascade behavior to implement; do not build a general projected-impact engine.
5. **Agent mesh / autonomous agent invocation.** Architecture has shifted to rule-classes + controlled LLM calls (not an agent mesh). The tabs are a **design preview with scripted states**, not a live engine. Do not wire real agent calls.

If a task seems to require one of these, stop and flag it — do not improvise.

---

## PART 4 — Repo conventions
- Tab components live in `src/app/components/capture/` (see `SolutioningTab.tsx` as the reference implementation — study its envelope rendering, the 3-Rule grid GRD compliance, and the cascade wiring).
- JSON data lives in `src/data/capture/` (canonical) — **import from a single canonical copy per tab**. Note: a stray duplicate `opp-001-solutioning.json` with a different shape exists; the working import is the one with `solutionElements`. When you add the new tabs, use one canonical file each and delete any duplicates.
- This is a Figma Make export (`@figma/my-make-file`). Vite + React + TS. Run `pnpm dev` to preview, `pnpm build` to verify.
- Deliverable language: English (UI copy and code). 

## PART 5 — Definition of done per tab (the "Greg test")
Read the finished tab cold, top to bottom. If it reads as the team's actual plan for that domain — who staffs it / what we've proven / what it costs / what we're collecting — and every value traces to the JSON file, it passes. If it reads as a generic list, or any value can't be traced to the data, it fails. Plus: confidence + AI reasoning + sources + recommendations + Edit on every section; the <50 banner where applicable; cascade consistent with the other tabs; header values agree ($45.0M · DHS-2026-CLOUD-0042); nothing from Part 3 built.
