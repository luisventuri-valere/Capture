# Figma Make — Capture · Solutioning tab (CAP-062/063/064 · SOL-001 + STV-001) · Build Prompt v2

Build the **Solutioning** tab as the third tab of the approved Capture pattern (Strategy ✓, Teaming ✓). Same shell, same envelope vocabulary, same edit/confirm/traceability behavior. This is the tab that carries the **SBS methodology — the product's competitive moat** — so it also carries one hard rule the other tabs don't have (§5, GRD-001).

**I am attaching `opp-001-solutioning.json`. It is the single source of truth for this tab.** Read all values from it. Where anything in this prompt and the file could disagree, the file wins.

---

## 0. North star — what "done" means (Greg's review, 9-Jun)

The tab must read like the **solution case the capture team is building** — each element a requirement met with a method, validated before it's allowed near the proposal. Not a checklist of capabilities.

- **FAIR** storyline per element (mapping in §4).
- **Seed corn:** validated elements feed Past Performance (evidence) and Proposal (themes); the uncovered evaluation factor flags Staffing.
- **Anchored to the attached JSON** — never invented content. If a field is not in the file, it does not appear.
- **Editability + chat + traceability:** Confirm / Request Review / Edit / Ask AI per element; source chips and AI reasoning visible.
- **Backward engineering:** the DataBridge withdrawal story continues here (§6).
- **The Greg test (DoD):** read it cold. If you can tell *which claims are proposal-ready, which are conditional, and exactly why* — it passes. If it reads like a feature list, it fails.

### Three-source synthesis applied
**(1) Content** ← the attached `opp-001-solutioning.json`. **(2) Interactions** ← the X-ray Solutioning surface: keep its strength rail, Win Themes + Goal Coverage panel, HOW-not-WHAT check with the 70 threshold, and the 3-Rule grid with per-rule chips. **(3) Envelope** ← already inside the JSON (`envelope` per element + top-level `overview`/`overallConfidence`) — bind it, don't re-create it.

### Binding rules (the lesson from Teaming — non-negotiable)
1. Bind every field **verbatim**. Never paraphrase, summarize, re-author, or "improve" any value — including long fields (`customerSaid`, `customerReallyWants`, `customerDoesntKnow`, `solution.method`, rationales, suggestions). If a long value doesn't fit, truncate with an ellipsis; do not reword.
2. If a field is absent or null, omit the UI element. Do not fill gaps.
3. Header and content must agree everywhere ($45.0M, DHS-2026-CLOUD-0042, pWin 35%).

---

## 1. Shell — reuse the approved chrome exactly

- Same top header, stage tabs, Capture subnav (**Solutioning** active), opportunity header: **Enterprise Cloud Migration and Modernization Services · DHS-2026-CLOUD-0042 · EAGLE II SB · 8(a) · pWin 35% · $45.0M · Award 2026-07-15 · ON_TRACK**.
- **Plan header strip:** `72% confidence` chip · **3 / 6 validated** · "Drafted by **Solutioning Agent (SOL-001)** · validated by **Strength Validator (STV-001)** · v3 · 2026-02-10" · triage filter **All / Passed / Conditional / Failed** · Regenerate · **Preview cascade** button (same control as Teaming).
- Keep Strategy and Teaming untouched.

## 2. Layout — three zones (Solutioning is operational, like Teaming's board; not a 10-chapter document)

**Zone A — Win Themes & Goal Coverage panel** (top, collapsible, default expanded; from the X-ray):
- Three win-theme cards from `overview.winThemes`: theme title + a source chip **"Strategy §2"** (the narrative lives in Strategy — link "View in Strategy"; do not invent narrative text here).
- **Goal Coverage card** from `overview.goalCoverage`: the % (75), covered factors as quiet pills, and the uncovered factor as an **amber warning row**: "⚠ M.4 — Transition & Staffing" + its `note` verbatim (it flags Staffing — render a "→ Staffing" chip on it).

**Zone B — Element rail** (left, ~300px; from the X-ray):
- Elements **grouped by win theme** (WT-01 group: sol-1, sol-4 · WT-02: sol-2 · WT-03: sol-3), with a final group **"Capability gaps — no theme"** (sol-5, sol-6). The orphan group is intentional: it shows which work isn't yet reinforcing any theme.
- Each rail item: verdict dot (green PASSED / amber CONDITIONAL / red FAILED) · title · `{howRatio}% HOW` chip · `{envelope.confidence}%` chip.
- Counts header: "SOLUTION ELEMENTS · 6" + the triage filter state.

**Zone C — Element detail** (right; FAIR per §4). Default selection: **sol-1**.

## 3. Element detail header & actions (same vocabulary as Strategy/Teaming)

- Header row: overall verdict badge (`✓ PASSED` / `△ CONDITIONAL` / `✕ FAILED` from `sbsValidation.overall`) · element title · category · status badge (validated / needs-work / shaping).
- **Linkage chips** (from `linkage`): `WT-xx`, `D-xx`, `CG-xx`, partner name — each a small chip; this is the seed-corn trace made visible.
- `✦ {confidence}% confidence` chip (green ≥75 / amber 50–74 / red <50).
- **Action row:** **Confirm** (solid primary; **disabled on FAILED elements** with tooltip "Cannot confirm a failed validation") · Request Review (outline) · Edit · Ask AI (tertiary) · feeds chips: **→ Past Performance · → Proposal**.
- **🤖 AI Reasoning band** directly below: "AI Reasoning — Solutioning Agent v3" + `envelope.aiReasoning` verbatim.
- **sol-6 only:** its confidence is 48 (<50) → directly under the AI Reasoning band, the yellow banner with this exact text: **"This recommendation is based on limited data. Run ANALYZE workflow for better intelligence."**

## 4. FAIR bands per element (bind from the JSON)

| Band | Content (verbatim fields) |
|---|---|
| 📋 **Facts — The Requirement** | `customerSaid` (full text, framed as "What the customer asked for") + category + linkage chips repeated small + `📎` source chips from `envelope.sources[]` |
| 🔍 **Analysis — The Read & Our Solution** | `customerReallyWants` (labeled "What they really want") + `solution.statement` + `solution.method` + `solution.metric` |
| 🧠 **Intelligence — The Edge** | `customerDoesntKnow` with a **🔒 Internal only** frame (this is competitive intelligence, never proposal text) + `solution.proof` + `evidence[]` as a list with CPARS pills where present |
| ✅ **Validation & Recommendations** | (a) **HOW-not-WHAT check**: `{howRatio}% HOW` vs the 70 threshold from `overview.howThreshold`, with the one-line explanation (≥70: "Meets the 70% threshold — the claim explains the method, not just the outcome." / <70: "Below the 70% threshold — too much WHAT vs HOW. Reframe around the delivery method."). (b) **3-Rule Validation grid**: three columns — Demonstrable / Differentiating / Defensible — each with its verdict chip (`Pass` / `Conditional` / `Fail`) and its `rationale` verbatim beneath; overall verdict badge on the band header. (c) **Suggestions** from `sbsValidation.suggestions[]` as discrete recommendation items with ✓ accept · ✕ reject · ✏️ edit buttons (≥32×32px targets, tooltips — the UX polish standard). (d) `gapResolution` when non-null, as a quiet callout titled "Gap resolution". |
| Footer | "Last generated 2026-02-10 · SOL-001/STV-001" · `Version History (1)` link bound to `envelope.versionHistory` |

In Solutioning, the **R of FAIR is the validator's output** — the suggestions are the recommendations. That is the intended mapping, not a substitution.

## 5. 🔒 SBS display rules — GRD-001 Output Layer (hard, non-negotiable)

The SBS methodology is IP. The UI may show **outputs**; it must never show **mechanics**:
- ✅ **Show:** verdicts per rule (Pass/Conditional/Fail) · the three rule **names** (Demonstrable · Differentiating · Defensible) · overall verdict (PASSED/CONDITIONAL/FAILED) · rationales and suggestions verbatim from the JSON · HOW% quality score and the 70 threshold · confidence.
- ⛔ **Never show:** per-rule numeric scores, scoring thresholds behind the verdicts (the 75/60 bands), weights, formulas, rule *definitions* or pass/fail criteria text, or any "how the methodology works" explanation. If the Ask AI drawer is asked "how is this scored?", the scripted reply is: "Validation mechanics are proprietary — I can explain *why this element* received its verdict from its evidence."
- The JSON contains no forbidden values by design. Do not generate any.

## 6. States & the cascade demo

1. **All three verdict states are real data** — sol-1/2/3 PASSED, sol-4/5 CONDITIONAL, sol-6 FAILED — reachable via the rail and the triage filter. No extra state frames needed for these.
2. **Preview cascade** (backward engineering — continues the cross-tab DataBridge story from Strategy/Teaming). On toggle:
   - **sol-1**: `demonstrable` chip Pass → **Conditional**, overall **PASSED → △ CONDITIONAL**, status validated → needs-work; a new suggestion appears at the top of its suggestions list: *"Re-source CG-01: DataBridge withdrew (2026-02-12) — engage MigrationPro Federal or Attain Federal before the wave-plan claim re-enters the proposal."*; confidence chip 82 → **64**; rail dot green → amber.
   - **Plan header** recounts: **2 / 6 validated** · triage counts update (2 Passed / 3 Conditional / 1 Failed).
   - **Toast:** "Change detected — Strategy §3 edit propagated: sol-1 re-validated. Downstream flagged for regeneration: Past Performance, Pricing."
   - Amber dots on sol-1 in the rail and on the **→ Past Performance** feeds chip.
   - Toggle off restores the baseline. Nothing else changes.

## 7. Out of scope — do not build, do not invent
- **No CVP panel** (CVP-001): no CVP data exists in the file; the panel is a future extension pending real data. Do not fabricate CVPs.
- No War Room elements, no third panel (Ask AI stays a drawer), no per-rule numeric scores (§5), no new evidence items, metrics, or contract names.

## 8. Done checklist — the Greg test
- [ ] All 6 elements render with the full FAIR storyline; every JSON field bound verbatim (anti-flattening: the three customer-intelligence levels, full method/metric/proof, full rationales and suggestions).
- [ ] Zone A shows the 3 win themes (with "Strategy §2" source chips) + Goal Coverage 75% with the amber M.4 uncovered row flagging Staffing.
- [ ] Rail grouped by win theme with the "no theme" orphan group; verdict dots + HOW% + confidence chips.
- [ ] 3-Rule grid shows names + verdicts + rationales only — zero numeric rule scores, zero methodology text (GRD-001).
- [ ] HOW-not-WHAT check bound to `howRatio` with the 70-threshold explanation line.
- [ ] sol-6: red 48% chip + verbatim yellow banner; Confirm disabled with tooltip.
- [ ] Suggestions render as accept/reject/edit items (≥32×32px, tooltips); `gapResolution` callouts on sol-4/5/6.
- [ ] Plan header: 72% · 3/6 validated · SOL-001/STV-001 byline · All/Passed/Conditional/Failed triage · Preview cascade.
- [ ] Preview cascade runs the sol-1 degradation exactly as §6, consistent with the Strategy/Teaming DataBridge story, and restores on toggle-off.
- [ ] Strategy and Teaming tabs untouched; header values agree everywhere ($45.0M · DHS-2026-CLOUD-0042 · pWin 35%).
