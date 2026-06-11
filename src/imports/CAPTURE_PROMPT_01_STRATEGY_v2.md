# Claude Code Task — Capture Reconstruction · Strategy Tab v2 (supersedes Prompt 01 Part B)
## Tab 1: Strategy & Plan (CAP-060) — rebuilt as "the comprehensive plan document"

You are working in the **GovHub demo** (Next.js + React + TypeScript). The first version of this tab was reviewed by the product owner (Greg, founder, 20+ yrs GovCon) on 2026-06-09 and **did not pass**. This prompt rebuilds it according to his explicit direction. Read the "North star" section carefully — it is the acceptance bar.

---

## 0. North star — what the owner actually asked for (verbatim intent)

1. **"We want it to be like a document."** The tab is a **comprehensive capture strategy document** — an 80%+ complete plan the AI drafted — not a status tracker with 10 collapsed rows. The user's job is to *read a plan*, then refine and confirm it.
2. **"Seed corn."** Each of the 10 sections is the seed for a downstream tab. Sections must visibly align to the containers of the subsequent tabs (Teaming, Solutioning, Staffing, PP, Pricing, Data Calls).
3. **FAIR storyline per section** — *Facts → Analysis → Intelligence → Recommendations.* "It tells the user a storyline: here's what we're finding, here's why, and here's the logic process around the plan."
4. **Interact, edit, confirm, deny.** Every strategy point must be editable; the user can chat with the AI about any section; recommendations are accept/reject-able items, not prose.
5. **Traceability.** "Show what the sources are, where exactly it came from, why — give the user confidence in the strategy."
6. **Backward engineering.** The system ran the full critical path to completion; the user goes in and edits critical components (e.g., "this partner is no longer bidding"), and downstream agents detect the change and re-flow. The demo must *show* this loop.
7. **Anchor to real agent data.** Do not invent UI content. Render what the agent actually outputs.

**The Greg test (definition of done):** a capture manager sits down cold, reads this tab top-to-bottom like a document, understands the full plan and why, and knows exactly what to refine and confirm next. If a screen element doesn't serve that, cut it.

---

## 1. Sources of truth (the three-source method, operationalized)

| Source | Where | What to take from it |
|---|---|---|
| **v1 — Demo data (Yankee-derived)** | `src/data/capture/opp-001-strategy.json` (+ `hero-001/2/3-strategy.json`) | **The content.** This JSON is already deep: pWin history with triggers, win themes with narratives + evidence anchors + eval factor targets, discriminators with competitor gaps, capability gaps with descriptions + target partners, 5 customer relationships with strength/last contact/next action/owner, critical positions with candidates + LOI status, lead references with CPARS + COR + highlights, PTW with basis + philosophy + competitor rate estimates + margin targets + pricing risks, milestones with deliverables, risks with likelihood/impact scores + mitigation + contingency, B&P budget by category + team allocations. **Render ALL of it.** |
| **v2 — Current demo surface (X-ray-derived)** | `src/components/opportunity/tabs/capture/StrategyPlanSubTab.tsx` | **The working interactions to keep:** 10-section structure, readiness summary, triage filter, Confirm/Edit/Request-Review flow, section status metadata, propagation pills. |
| **v3 — Agent contract** | `CSA-001` spec (Capture Strategy Agent): `CaptureStrategy` → 10 × `StrategySection<T>` with `status · confidence · ai_reasoning · propagated_to[] · version_history[]` | **The envelope.** Per-section confidence (0–100), visible AI reasoning, propagation records, version history, and the degradation rule: low-confidence sections show the yellow banner *"This recommendation is based on limited data. Run ANALYZE workflow for better intelligence."* |

**Synthesis rule:** v1 content + v2 interactions + v3 envelope = the canonical tab. **Do not lose functionality from any of the three.**

### 🚫 The anti-flattening rule (this is why v1 failed)
The previous build collapsed rich JSON into one-line summaries with a confidence chip. **Forbidden.** Hard requirement: **every field present in the strategy JSON is rendered somewhere in the expanded section view.** If `winStrategy` has 3 themes × (narrative, evidenceAnchors, evaluationFactorTarget, strengthRating) + 4 discriminators × (impact, proof, competitorGap) — the user can see all of it. Depth is the feature.

---

## 2. Global rules
1. **Demo, not engine.** All AI outputs (content, confidence, reasoning, sources) are read from JSON; behavior is scripted; no backend calls. But it must be a *faithful promise* of CSA-001.
2. **No fabricated internals.** Never render proprietary scoring formulas/weights/thresholds (GRD-001 filters methodology — keep SBS internals out of strategy text).
3. **Reuse demo conventions** (`@/components/shared/*`, `lucide-react`). No new design system.
4. **Type everything** (`StrategyData` interfaces). No `as unknown as typeof X`.
5. **No browser storage** — React state/Context only.
6. **Layout decisions already governed (2026-05-27 review — do not relitigate):** drill-down = **expandable accordion**; chat assistant = **drawer on high z-index**; AI actions live in the **standard right-hand AI panel — no third panel** on the main canvas.

---

## 3. PART A — Shared infra
`CaptureProvider` (`src/context/CaptureContext.tsx`) with `confirm / revise / get / isConfirmed` and namespaced keys (`strategy:strategicPositioning`, …) per the original Prompt 01 Part A. **If it already exists, keep it unchanged.** Add one thing: `revise(key)` now also appends a `version_history` entry `{ version, changed_at, changed_by, change_summary }` to the section (CSA-001 envelope).

---

## 4. PART B — The rebuilt tab

### 4.1 Layout: a document, not a dashboard
- **Objective header** (keep): one sentence telling the user their job — review the AI-drafted plan, refine, confirm; confirmed sections feed the downstream tabs.
- **Plan header bar** (evolve the readiness bar): `overall_confidence` (weighted, from JSON) · capture phase · "X of 10 confirmed" · triage filter (All / Needs attention / Confirmed) · **"Regenerate plan" affordance (scripted)** · generated-by/version metadata ("Drafted by Capture Strategy Agent · v3 · Feb 10").
- **Body = the 10 sections as document chapters** (accordion). Collapsed: number + title + one-line thesis + status + confidence + "feeds →" pill. Expanded: the full FAIR layout (4.2). Sections read in order like chapters of a capture plan: 1 Strategic Positioning · 2 Win Strategy · 3 Team Strategy · 4 Customer Engagement · 5 Staffing Strategy · 6 Past Performance · 7 Pricing Strategy · 8 Timeline & Milestones · 9 Risk Register · 10 Resource Plan & B&P.

### 4.2 Section anatomy — the FAIR storyline (the repeating pattern)
Every expanded section renders four bands, in order:

**📋 FACTS** — the data grounding this section. Compact key-value/table layout. Every fact carries an inline **source chip** (e.g., `SAM.gov`, `USAspending FY23–25`, `Industry Day 01/15`, `CPARS`, `Company Profile`); clicking a chip opens a popover: source name, what was extracted, retrieved-at. *(Mock refs in JSON.)*

**🔍 ANALYSIS** — the "so what": the agent's reading of the facts, as readable prose + structured elements (e.g., pWin trajectory with its triggers, prime-vs-sub rationale, gap severity reasoning). Includes the **visible `ai_reasoning`** (CSA-001) — inline, not hidden behind an icon.

**🧠 INTELLIGENCE** — competitive/agency/relationship context informing the section: discriminators vs named competitors with `competitorGap`, incumbent posture, agency hot buttons, ghosting angles (internal-only framing). Where the JSON has it (winStrategy.discriminators, partner riskNotes, pricingRisks…), render it here.

**✅ RECOMMENDATIONS & ACTIONS** — discrete, decidable items, each with **[Accept] [Reject] [Edit]** (checkbox-style, like the owner's prototype). E.g., §3: "Partner with DataBridge Analytics for Data Migration (workshare 15%)" → accept/reject/edit. Accepted items get bundled into the section's cascade payload on confirm. Rejected items are struck through with a reason field.

**Section footer (every section):** confidence chip (0–100) + yellow low-confidence banner when `< 50` (verbatim CSA-001 text) · conflict warning when `conflicts[]` non-empty · **💬 Ask AI** (opens the chat **drawer**, pre-scoped to the section, with 2–3 scripted exchanges in mock data, e.g. *"Why prime instead of sub?" → reasoned answer citing facts*) · **✏️ Edit** (inline editing of fields/prose) · **Confirm** / **Request Review** · status metadata (status, lastReviewed, reviewedBy) · **"Feeds → {tab}"** pill naming the exact downstream container (the seed-corn linkage) · version history (collapsible list from `version_history[]`).

### 4.3 Per-section FAIR mapping (content → bands; from the real JSON)
| § | Facts | Analysis | Intelligence | Recommendations |
|---|---|---|---|---|
| 1 Strategic Positioning | vehicle, set-aside, NAICS/PSC, value breakdown, contract type, dates | prime/sub rationale; **pWin 35 + history w/ triggers**; SB target basis | competitive position context | positioning decision; SB target 35% |
| 2 Win Strategy | eval factors targeted | **3 win themes: full narratives** + strength ratings | **4 discriminators w/ impact·proof·competitorGap**; ghosting (internal-only) | accept/edit each theme & discriminator |
| 3 Team Strategy | **3 capability gaps w/ full descriptions** | severity reasoning; coverage math | partner rationale + **riskNotes** (OCI, competitor-courting) | partner recs w/ workshare % → accept/reject |
| 4 Customer Engagement | **5 relationships:** title, org, strength, last contact | engagement-posture read (warm/cold map) | notes intel (e.g., "Deputy CIO frustrated w/ incumbent delays") | **next actions w/ dates + owners** → accept/edit |
| 5 Staffing Strategy | **8 critical positions:** LCAT, clearance, designation | pipeline read; clearance capacity (18 TS/SCI etc.) | candidate sourcing intel (LOIs, ethical-wall notes) | per-position approach → confirm |
| 6 Past Performance | **3 lead refs:** number, value, CPARS, COR | relevance reasoning per ref (relevanceFactors) | partner references + their CPARS | use/replace per reference |
| 7 Pricing Strategy | PTW $42M, blended rate, margin targets | **ptw_basis (full text)** + **philosophy (full text)** | **competitor rate estimates w/ basis**; pricingRisks | pricing approach → confirm |
| 8 Timeline | **8 milestones w/ dates, owners, deliverables** | critical-path read; slack analysis | slippage signals ("may slip 1–2 wks") | milestone confirmations |
| 9 Risk Register | **5 risks w/ likelihood/impact scores** | risk-score matrix read | category patterns | **mitigation + contingency** per risk → accept/edit |
| 10 Resource Plan & B&P | budget $350K, spend, burn, **6 categories**; **6 team members w/ allocations** | burn-vs-projection read | — | allocation confirmations |

### 4.4 The cascade + backward engineering (the demo's money moment)
- **Confirm** → writes the section's cascade payload to `CaptureProvider` (same keys as the prompt series: §1 `{positioning, sbTarget}` → all/Teaming/Pricing · §2 `{winThemes}` → Solutioning · §3 `{capabilityGaps, recommendedPartners}` → Teaming · §5 `{staffingApproach, keyPersonnel}` → Staffing · §6 `{leadReferences}` → PP · §7 `{pricingApproach, ptw, marginTargets}` → Pricing · §10 `{bpBudget, contractValue}` → Pricing) and shows "✓ propagated to {tabs}" with a `propagated_to[]` record (target tab + what + when).
- **Backward engineering (scripted, must be demoable):** edit a **confirmed** section (e.g., in §3 mark "DataBridge Analytics — no longer bidding" via reject/edit) → status returns to `needs_review`, a `version_history` entry is appended ("user override: partner removed"), downstream keys are flagged `superseded`, and a toast/inline note appears: *"Change detected — downstream tabs flagged for regeneration (Teaming, Staffing, Pricing)."* This demonstrates the owner's run-forward/engineer-backward loop end to end.

### 4.5 DON'T
- No cross-tab Capture Overview / readiness score / phase bid-no-bid (ungoverned — still parked with the owner).
- No third panel; chat is the drawer; AI actions stay in the right-hand panel.
- No invented content beyond the JSON; no SBS/scoring internals; no lorem.
- Don't regress: keep triage, statuses, confirm flow, propagation pills from v1.

---

## 5. Data tasks (`src/data/capture/*-strategy.json`)
1. **Keep all existing content** (it is the v1 source — it's good). Normalize section keys/shape across opp-001 + hero-001/2/3.
2. **Add the CSA-001 envelope per section:** `confidence` (0–100), `ai_reasoning` (2–4 sentences, references the section's facts), `sources[]` (`{label, ref, retrievedAt, excerpt}`), `version_history[]` (≥1 "agent generated" entry), `conflicts[]` (default empty), `chatSeed[]` (2–3 scripted Q&A per section for the drawer).
3. **Restructure each section's content into the FAIR bands** (`facts`, `analysis`, `intelligence`, `recommendations[]` with `{id, text, status: 'proposed'|'accepted'|'rejected', editable: true}`) — mapping per the table in 4.3, preserving every existing field.
4. **Demonstrate the states:** ≥1 section `confidence < 50` (yellow banner) · ≥1 section with a `conflict` · ≥1 recommendation pre-rejected with reason · ≥1 section with `version_history` showing a user edit · in opp-001, keep the realistic status mix (confirmed / needs_review / draft).

---

## 6. Done criteria
- [ ] Reads as a document: 10 chapters, each expandable into the full FAIR storyline; a cold reader passes **the Greg test**.
- [ ] **Anti-flattening verified:** every JSON field is visible somewhere in its expanded section (spot-check §2 narratives/discriminators, §4 relationship notes/next actions, §7 ptw_basis/philosophy/competitor estimates, §9 mitigations/contingencies, §10 categories/team).
- [ ] Every fact carries a source chip with popover; every section shows confidence + visible `ai_reasoning`; `< 50` shows the verbatim yellow banner.
- [ ] Recommendations are discrete accept/reject/edit items; accepted ones form the confirm payload.
- [ ] Ask-AI drawer works per section with scripted exchanges; no third panel.
- [ ] Inline edit works on section content; editing a confirmed section triggers the backward-engineering flow (needs_review + version_history + downstream `superseded` + "change detected" note).
- [ ] Confirm writes the correct cascade keys + `propagated_to[]` records; "✓ propagated to …" shown; "Feeds →" pills name real downstream containers.
- [ ] Kept from v1: readiness summary, triage filter, statuses, Confirm/Edit/Request-Review.
- [ ] `StrategyData` typed; no `as unknown`; shapes normalized across the 4 opportunities; no overview/readiness cross-tab added.

## Out of scope
Tabs 2–7 (their own re-grounded prompts follow this template) · War Room · COP-001 · Partner Portal · cross-tab Overview.
