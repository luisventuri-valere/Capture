# Figma Make — Teaming tab · Correction Pass (Option A)
## Rebuild ONLY Section 3 (Partner Pipeline) as a full-width board. Change nothing else.

The Teaming tab is approved in content, data, and envelope. Sections 1 (Teaming Strategy), 2 (Capability Gaps), and 4 (Workshare & Small Business) are correct and **must not change**. The intelligence-envelope language — confidence chips, 🤖 AI Reasoning, 📎 source chips, ✅ Recommendations (accept/reject/edit), Edit/Confirm/Request Review, Ask AI drawer, Version History — is the cross-tab design system and **stays identical**.

The single problem: **Section 3's partner pipeline was rendered as vertically-stacked full-width cards inside the document detail panel, which flattens the kanban into a list.** The pipeline is an *operational board*, not a document section. This pass gives it the board treatment it needs — while keeping the same visual vocabulary.

### ⛔ Hard rules
1. Touch **only Section 3 (Partner Pipeline)**. Do not alter Sections 1, 2, 4, the section index, the plan header, or the shell.
2. Bind every value from `opp-001-teaming.json`. Invent nothing.
3. Keep the envelope vocabulary identical (chips, reasoning band, source chips, recommendations, Ask AI). This is a *layout* change for one section, not a new language.

---

## What changes: Section 3 becomes a full-width pipeline board

When the user selects **Partner Pipeline** in the section index, the detail area switches from the document layout to a **board layout**:

- **Collapse the left section index** into a slim horizontal breadcrumb/segmented control at the top of the detail area (the 4 sections become pills: Teaming Strategy · Capability Gaps · **Partner Pipeline** · Workshare). This frees the full canvas width for the board. The other 3 sections keep the normal index+detail layout — only Partner Pipeline goes full-width.
- Keep the section header row exactly as the others: section title "Partner Pipeline", ⚠/○/✓ status, **58% confidence** chip, "Last reviewed 2026-02-10 · Teaming Intelligence Agent", and the action row (Confirm · Request Review · Edit · Ask AI · feeds → Staffing, Data Calls).
- Keep the 🤖 **AI Reasoning** band (verbatim text already in place) and the amber **conflict callout** (Coalfire OCI) directly under it.

### The board (📋 Facts band, full width)
A horizontal **7-column kanban**, columns left→right:
`Identified · Contacted · NDA Signed · Evaluating · TA Signed · Committed · Declined`

- Each column has a header with the stage name + a count badge.
- Place the 5 partner cards in their columns:

| Card | Column | Card face (compact) |
|---|---|---|
| **DataBridge Analytics** | Committed | Data Migration & ETL · **20% · $9.0M** · NDA ✓ · TA legal review · 🔒 CACI/Vertex contacted |
| **GovFlow Technologies** | Evaluating | ServiceNow & ITSM · **15% · $6.75M** · NDA ✓ · term sheet |
| **MainframeNext Inc.** | Contacted | Mainframe Modernization · **10% · $4.5M** · NDA legal review |
| **Coalfire Federal** | Contacted | FedRAMP 3PAO · advisory · **⚠ On Hold — OCI** |
| **Nightwing Analytics** | Identified | Cloud FinOps · **limited-data card** (muted; "Limited data — run ANALYZE workflow for better intelligence") |

- Empty columns (NDA Signed, TA Signed, Declined) render as empty drop zones with a dashed placeholder, so the funnel reads at a glance.
- Cards are visually draggable (prototype only). A **workshare rail** sits under the board: "Committed 20% of 45% sub-target" with a progress fill.
- Card compact face = name + core capability + workshare/$ + stage-specific status chip (NDA/TA). Keep the loud all-caps to a minimum; lead with the partner name.

### Partner detail (drill-down, not a stacked card)
Clicking a card opens a **right-side drawer** (same drawer pattern as Ask AI, not a third panel) with that partner's full record from the JSON:
- **Facts:** UEI, CAGE, size, certifications, employees, annual revenue, core capability, relevant experience.
- **Pipeline:** stage history (date + note per stage), NDA status + dates, TA status + estimated sign date + key terms, workshare + estimated value.
- **People:** keyPersonnel[] — name / role / clearance / years.
- **Past performance:** pastPerformance[] — contract / value / CPARS / agency.
- **Intelligence:** risks[] (severity + mitigation), strengthForTeam, competitorInterest, each 🔒 where internal.

This moves the rich per-partner content **out of the vertical stack and into an on-demand drawer**, which is what makes the board scannable (Hick's Law — detail on demand).

### 🔍 Analysis / 🧠 Intelligence / ✅ Recommendations bands (below the board)
Keep these three bands exactly as the envelope defines them, rendered full-width under the board:
- 🔍 **Analysis — Pipeline Status:** stage distribution (1 Committed, 1 Evaluating, 2 Contacted, 1 Identified, 0 Declined), total committed vs target workshare, momentum note.
- 🧠 **Intelligence — Competitive Risks:** the competitor-interest and risk notes aggregated (CACI/Vertex on DataBridge & GovFlow; Leidos on Coalfire; capacity notes on the small firms), 🔒 framed.
- ✅ **Recommendations & Actions:** PP-R1…PP-R4 verbatim, each with accept/reject/edit (≥32×32px targets, per the UX polish standard).

---

## Keep (do not regress)
- The conflict callout (Coalfire OCI) and the Nightwing limited-data treatment — now expressed as the On-Hold badge and the muted card on the board.
- The "Change detected" backward-engineering toggle (if not yet built, add it here per the v2 prompt §6): DataBridge → Declined column, CG-01 reopens, workshare hole, downstream flags. On the board this reads beautifully — the card physically moves to the Declined column.
- Snake_case fix is optional; "NDA Signed" / "TA Signed" display labels are fine.

## Done checklist
- [ ] Sections 1, 2, 4 untouched; section index, plan header, shell untouched.
- [ ] Partner Pipeline renders full-width; section index collapses to top pills only on this section.
- [ ] 7-column kanban with count badges; 5 cards placed per the table; empty columns show drop zones.
- [ ] Workshare rail under the board (committed vs 45% sub-target).
- [ ] Clicking a card opens a right drawer with the full partner record (facts/pipeline/people/past-perf/intelligence) from the JSON.
- [ ] Header, confidence chip (58%), AI Reasoning, conflict callout, and the Analysis/Intelligence/Recommendations bands all retained with identical vocabulary.
- [ ] Every value traces to `opp-001-teaming.json`; nothing invented.