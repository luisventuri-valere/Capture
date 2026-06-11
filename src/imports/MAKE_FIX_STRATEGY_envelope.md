# Figma Make — Correction Pass · Strategy & Plan tab
## Add the missing intelligence envelope. Do NOT restructure or re-invent anything.

The current screens are **correct and approved in structure and content**: the 10 sections, the FAIR bands, the sidebar, the action rows, the Ask AI drawer, and — most importantly — **all data values bound from the real opportunity JSON**. Keep 100% of that.

This pass is **strictly additive**. You will add the per-section "intelligence envelope" (confidence, AI reasoning, sources, version history), restore the fourth FAIR band (Recommendations & Actions), restore the Edit affordance, and add two demonstration states.

### ⛔ Hard rules
1. **Bind ONLY from the JSON in this prompt + the existing opportunity data. Never invent a value, name, number, date, or source.** If something isn't in the data, leave it out.
2. Do not change any existing bound value, section structure, band order, layout, or copy.
3. Do not add a third panel. The Ask AI drawer stays as is.

---

## 1. Per-section envelope data (bind from this JSON — verbatim)

```json
{
  "overall_confidence": 74,
  "generated_by": "Capture Strategy Agent · v3 · 2026-02-10",
  "sections": {
    "strategicPositioning": {
      "confidence": 82,
      "ai_reasoning": "Prime on EAGLE II SB is recommended because the 8(a) set-aside matches TechForward's active certification, the FedRAMP High ATO removes the largest entry barrier, and incumbent Peraton's agency ATO expiration creates a rare displacement window before the 2026-07-15 award.",
      "sources": [
        {"label": "SAM.gov — DHS-2026-CLOUD-0042 pre-solicitation"},
        {"label": "USAspending — DHS OCIO awards FY23–25"},
        {"label": "DHS OSDBU guidance memo (SB targets)"},
        {"label": "Industry Day notes — 2026-01-15"}
      ],
      "version_history": [{"version": 1, "changed_at": "2026-02-10", "changed_by": "agent", "change_summary": "Initial generation from IDENTIFY + ANALYZE outputs"}],
      "recommendations": [
        {"id": "SP-R1", "text": "Pursue as Prime on EAGLE II SB under the 8(a) set-aside", "status": "accepted"},
        {"id": "SP-R2", "text": "Commit to 35% SB subcontracting target per DHS OSDBU guidance", "status": "accepted"},
        {"id": "SP-R3", "text": "Hold pWin at 35% pending RFP release — reassess at milestone MS-04", "status": "proposed"}
      ],
      "conflicts": []
    },
    "winStrategy": {
      "confidence": 85,
      "ai_reasoning": "All three win themes are evidence-backed by CPARS-rated past performance (DHS CISA Exceptional, Army Very Good) and target the M.1/M.2/M.3 evaluation factors; D-01 (FedRAMP High, operational day one) is the strongest discriminator because no 8(a) competitor holds an equivalent authorization.",
      "sources": [
        {"label": "CPARS — own contract records"},
        {"label": "Competitive intel — CMP-001 assessment"},
        {"label": "Industry Day notes — 2026-01-15"}
      ],
      "version_history": [{"version": 1, "changed_at": "2026-02-10", "changed_by": "agent", "change_summary": "Initial generation"}],
      "recommendations": [
        {"id": "WS-R1", "text": "Adopt WT-01 / WT-02 / WT-03 as the proposal win themes", "status": "accepted"},
        {"id": "WS-R2", "text": "Lead the M.1 response with discriminator D-01 (FedRAMP High ATO)", "status": "proposed"},
        {"id": "WS-R3", "text": "Develop ghosting language against Peraton's expiring ATO — internal use only", "status": "proposed"}
      ],
      "conflicts": []
    },
    "teamStrategy": {
      "confidence": 68,
      "ai_reasoning": "The three capability gaps map to the 340+ application inventory parsed from the draft PWS; DataBridge closes the largest gap (data migration at DHS scale) but carries OCI exposure as the incumbent's subcontractor, which is why this section remains in review.",
      "sources": [
        {"label": "USAspending — subaward records"},
        {"label": "SAM.gov — entity registrations (UEI)"},
        {"label": "Competitive intel — CMP-001"}
      ],
      "version_history": [{"version": 1, "changed_at": "2026-02-10", "changed_by": "agent", "change_summary": "Initial generation"}],
      "recommendations": [
        {"id": "TS-R1", "text": "Partner with DataBridge Analytics — Data Migration & ETL, 15% workshare", "status": "proposed"},
        {"id": "TS-R2", "text": "Partner with GovFlow Technologies — ServiceNow Integration, 10% workshare", "status": "proposed"},
        {"id": "TS-R3", "text": "Engage MainframeNext Inc. — Mainframe Modernization, 8% workshare", "status": "proposed"}
      ],
      "conflicts": [
        {"type": "sb_credit_risk", "message": "GovFlow Technologies is cited as 8(a) in the partner rationale, but SAM.gov shows its 8(a) status graduated 2025-12 — projected SB workshare credit may be overstated. Verify before TA."}
      ]
    },
    "customerEngagement": {
      "confidence": 46,
      "ai_reasoning": "Engagement intelligence rests on a single Industry Day conversation and one matchmaking event; 2 of 5 key relationships (CO, CIO) remain neutral or cold with no direct channel, so engagement-dependent assumptions carry low confidence until the scheduled briefings occur.",
      "sources": [
        {"label": "Industry Day attendance — 2026-01-15"},
        {"label": "RFI response log — 2026-01-28"},
        {"label": "AFCEA conference — Nov 2025"}
      ],
      "version_history": [{"version": 1, "changed_at": "2026-02-10", "changed_by": "agent", "change_summary": "Initial generation"}],
      "recommendations": [
        {"id": "CE-R1", "text": "Schedule capabilities briefing with Patricia Nguyen — 2026-02-15 · Sarah Chen", "status": "proposed"},
        {"id": "CE-R2", "text": "Submit clarifying questions on draft PWS — 2026-02-20 · Contracts Manager", "status": "proposed"},
        {"id": "CE-R3", "text": "Request CIO introduction through Patricia Nguyen — 2026-02-28 · CEO", "status": "proposed"},
        {"id": "CE-R4", "text": "Maintain no-contact discipline with Marcus Johnson (likely TEB) — procurement sensitive", "status": "accepted"},
        {"id": "CE-R5", "text": "Accept Lisa Park's OSDBU introduction to OCIO acquisition staff — 2026-02-14 · Sarah Chen", "status": "proposed"}
      ],
      "conflicts": []
    },
    "staffingStrategy": {
      "confidence": 64,
      "ai_reasoning": "6 of 8 critical positions have named candidates and 2 Key Personnel LOIs are signed; confidence is held down by the unsourced Migration Architect (recruiting priority) and the dependency of two positions on unsigned teaming agreements.",
      "sources": [
        {"label": "Company Profile — employee bench (CPB-001)"},
        {"label": "LOI records — D. Kim, R. Foster"},
        {"label": "ClearanceJobs pipeline data"}
      ],
      "version_history": [{"version": 1, "changed_at": "2026-02-10", "changed_by": "agent", "change_summary": "Initial generation"}],
      "recommendations": [
        {"id": "SS-R1", "text": "Lock Key Personnel LOIs (Kim, Foster) with retention packages", "status": "accepted"},
        {"id": "SS-R2", "text": "Prioritize Migration Architect recruiting — 3 external candidates in review", "status": "proposed"},
        {"id": "SS-R3", "text": "Accept partner-provided Data Migration Lead (DataBridge) and ServiceNow Specialist (GovFlow)", "status": "proposed"}
      ],
      "conflicts": []
    },
    "pastPerformance": {
      "confidence": 88,
      "ai_reasoning": "The lead reference (DHS Cybersecurity Modernization, Exceptional, same agency, cleared workforce) is a near-direct match to the evaluation factors; the Army migration reference proves cloud migration at scale with the CloudPathfinder tool cited in WT-01.",
      "sources": [
        {"label": "CPARS — own contract records"},
        {"label": "Contract files — CORs & periods of performance"},
        {"label": "Partner-provided references (DataBridge, GovFlow)"}
      ],
      "version_history": [{"version": 1, "changed_at": "2026-02-10", "changed_by": "agent", "change_summary": "Initial generation"}],
      "recommendations": [
        {"id": "PP-R1", "text": "Use DHS Cybersecurity Modernization as the lead reference", "status": "accepted"},
        {"id": "PP-R2", "text": "Use Army Enterprise Cloud Migration as reference #2", "status": "accepted"},
        {"id": "PP-R3", "text": "Include partner references: DataBridge (USCIS) and GovFlow (DHS ServiceNow)", "status": "proposed"}
      ],
      "conflicts": []
    },
    "pricingStrategy": {
      "confidence": 71,
      "ai_reasoning": "PTW of $42.0M sits between the bottom-up engineering estimate ($44.2M) and top-down competitive analysis ($39.8M); the $185/hr blended rate undercuts the incumbent's $195/hr while preserving the 22% margin target — but the unknown LPTA-vs-Best-Value methodology caps confidence.",
      "sources": [
        {"label": "USAspending — 8 comparable DHS OCIO awards FY23–25"},
        {"label": "GSA CALC+ rate data"},
        {"label": "Public billing-rate data — incumbent contract"}
      ],
      "version_history": [{"version": 1, "changed_at": "2026-02-10", "changed_by": "agent", "change_summary": "Initial generation"}],
      "recommendations": [
        {"id": "PR-R1", "text": "Set Price-to-Win at $42.0M", "status": "proposed"},
        {"id": "PR-R2", "text": "Hold blended rate at $185/hr with 22% overall margin target", "status": "proposed"},
        {"id": "PR-R3", "text": "Prepare dual pricing model for the LPTA contingency (PTW floor $38M)", "status": "proposed"}
      ],
      "conflicts": []
    },
    "timeline": {
      "confidence": 79,
      "ai_reasoning": "The milestone chain is anchored to the pre-solicitation notice; the critical path runs through MS-02 (teaming agreements, 2026-02-20) — a slip there compresses customer engagement and proposal kick-off, and the RFP date itself may slip 1–2 weeks.",
      "sources": [
        {"label": "Pre-solicitation notice — procurement timeline"},
        {"label": "Internal gate records — Go/No-Go 2026-02-05"}
      ],
      "version_history": [{"version": 1, "changed_at": "2026-02-10", "changed_by": "agent", "change_summary": "Initial generation"}],
      "recommendations": [
        {"id": "TL-R1", "text": "Confirm the 8-milestone plan as the capture schedule", "status": "accepted"},
        {"id": "TL-R2", "text": "Hold Pink Team 2026-03-25 and Red Team 2026-04-15 dates with external reviewers", "status": "proposed"}
      ],
      "conflicts": []
    },
    "riskRegister": {
      "confidence": 74,
      "ai_reasoning": "Three risks score 12 (DataBridge OCI, Kim counteroffer, CR delay); the highest-impact scenario remains the LPTA switch (R-02, impact CRITICAL), which is why the dual-pricing contingency in §7 exists.",
      "sources": [
        {"label": "Internal risk board — 2026-02-05 review"},
        {"label": "Procurement signals — OSDBU channel"}
      ],
      "version_history": [{"version": 1, "changed_at": "2026-02-10", "changed_by": "agent", "change_summary": "Initial generation"}],
      "recommendations": [
        {"id": "RR-R1", "text": "Approve mitigation plans for R-01 through R-05", "status": "proposed"},
        {"id": "RR-R2", "text": "Activate weekly monitoring on R-03 (Kim counteroffer) and R-05 (CR delay)", "status": "proposed"}
      ],
      "conflicts": []
    },
    "resourcePlan": {
      "confidence": 83,
      "ai_reasoning": "B&P projection ($340K) lands inside the board-approved $350K with the current $15K/month burn; capture-labor spend is front-loaded as expected for the qualification phase, and no category is trending over.",
      "sources": [
        {"label": "Finance system — B&P ledger"},
        {"label": "Board authorization — 2026-02-05"}
      ],
      "version_history": [{"version": 1, "changed_at": "2026-02-10", "changed_by": "agent", "change_summary": "Initial generation"}],
      "recommendations": [
        {"id": "RP-R1", "text": "Confirm the $350K B&P budget and category allocations", "status": "accepted"},
        {"id": "RP-R2", "text": "Confirm capture team allocations (6 members) through award", "status": "accepted"}
      ],
      "conflicts": []
    }
  }
}
```

---

## 2. UI additions (apply to every section screen, same pattern)

1. **Action row:** add an **✏️ Edit** button between "Request Review" and "Ask AI". (Restores editability.)
2. **AI Reasoning band:** directly under the section header, add the 🤖 band: small label `AI Reasoning — Capture Strategy Agent v3` + the section's `ai_reasoning` text. Subtle background, full width, before 📋 Facts.
3. **Confidence chip:** in the section header next to the status badge, a chip showing `{confidence}% confidence` (green ≥75, amber 50–74, red <50). Also add `{confidence}%` to each section's sidebar row, and add the overall **`74% confidence`** chip + the line **`Drafted by Capture Strategy Agent · v3 · 2026-02-10`** to the plan header (next to "5 / 10 confirmed").
4. **Source chips:** at the bottom of the 📋 Facts band, a row of small `📎 {label}` chips from `sources[]`. One chip per source, verbatim labels.
5. **✅ Recommendations & Actions band:** add as the **fourth band, after 🧠 Intelligence**, in every section. Render each item in `recommendations[]` as a row: text + three small icon buttons (✓ accept · ✕ reject · ✏️ edit). Items with `"status":"accepted"` show a subtle green left border + filled check; `"proposed"` are neutral. Use the verbatim texts above.
6. **Footer per section:** keep the existing "Last reviewed" line; add a collapsed **`Version History (1)`** link bound to `version_history`.
7. **Low-confidence banner:** in **§4 Customer Engagement** (confidence 46 → red chip), show a yellow banner directly under the AI Reasoning band with this exact text: **"This recommendation is based on limited data. Run ANALYZE workflow for better intelligence."**
8. **Conflict callout:** in **§3 Team Strategy**, under the AI Reasoning band, an amber warning callout with the `conflicts[0].message` text verbatim (the GovFlow 8(a) graduation flag).
9. **Label fix:** sidebar §6 feeds-to label `PP` → `Past Performance`.

---

## 3. One new state screen: "backward engineering"

Duplicate the **§3 Team Strategy** screen and modify it to show the post-edit state (name the frame `3 · Team Strategy — Change detected`):
- Recommendation **TS-R1 (DataBridge)** shown as **rejected**: struck-through text, red ✕ filled, with a small reason line: `"Rejected by S. Chen — partner no longer bidding (2026-02-12)"`.
- Section status badge changes to **⚠ Needs Review**; sidebar updates accordingly (4 / 10 confirmed in the plan header).
- `Version History (2)` in the footer.
- A toast/banner at the top of the detail panel: **"Change detected — downstream tabs flagged for regeneration: Teaming, Staffing, Pricing."**
- In the sidebar, sections 3, 5, 7 show a small amber "update" dot.

---

## 4. Done checklist
- [ ] Every section shows: confidence chip (header + sidebar) · 🤖 AI Reasoning band · 📎 source chips under Facts · ✅ Recommendations & Actions band · Version History link · Edit button.
- [ ] All envelope values come verbatim from the JSON in §1 of this prompt — nothing invented.
- [ ] Plan header shows `74% confidence` + "Drafted by Capture Strategy Agent · v3 · 2026-02-10".
- [ ] §4 shows the red 46% chip + the verbatim yellow banner.
- [ ] §3 shows the amber conflict callout (GovFlow 8(a)).
- [ ] New `3 · Team Strategy — Change detected` frame with rejected TS-R1, ⚠ Needs Review, version 2, the regeneration toast, and amber dots on sections 3/5/7.
- [ ] Sidebar §6 says `Past Performance`, not `PP`.
- [ ] Nothing else changed: existing data values, FAIR band contents, layout, and the Ask AI drawer remain untouched.
