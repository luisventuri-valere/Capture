# Figma Make — Capture · Teaming tab (CAP-061 · TMI-001) · Build Prompt v2

Build the **Teaming & Partner Management** tab as a continuation of the approved Strategy tab pattern. Same shell, same FAIR storyline, same intelligence envelope, same edit/confirm/traceability behavior. The only new pattern is the **partner pipeline kanban** inside Section 3.

This prompt is the contract. Every value comes from the real agent output `opp-001-teaming.json` (DHS Enterprise Cloud Migration). **Do not invent any value** — that is the single rule that sank v1 of Strategy.

---

## 0. North star — what "done" means (Greg's review, 9-Jun)

The tab must read **like a document a capture manager wrote**, 80%+ pre-populated, that a human edits and confirms — not a tracker.

- **FAIR** in every section: **F**acts → **A**nalysis → **I**ntelligence → **R**ecommendations.
- **Seed corn**: each section declares what it feeds downstream and the payload (Teaming feeds Solutioning, Staffing, Pricing).
- **Anchored to real agent JSON** — never invented content. If a field is not in the JSON, it does not appear.
- **Editability + chat-with-AI + traceability**: Edit / Confirm / Request Review on every section; Ask AI drawer scoped to the section; source chips + AI reasoning visible.
- **Backward engineering**: the user edits a confirmed item and downstream re-flows. (Demonstrated here with the DataBridge withdrawal cascade — see §6.)
- **The Greg test (DoD)**: read it top to bottom cold. If it reads as the team's plan for *who we team with and why*, it passes. If it reads as a partner CRM, it fails.

### Three-source method (apply per section)
Synthesize, do not pick one: **(1) real content** ← `opp-001-teaming.json`; **(2) interactions** ← the X-ray demo surface (kanban drag, stage moves, document-gen affordances); **(3) the envelope** ← the TMI-001/CSA-001 agent contract (confidence, ai_reasoning, sources, version_history, recommendations, conflicts) supplied pre-written in §4 below.

---

## 1. Shell — reuse the approved Strategy chrome exactly

- Same top header, stage tab bar, Capture subnav (Teaming is the active subtab), and opportunity header: **Enterprise Cloud Migration and Modernization Services · DHS-2026-CLOUD-0042 · EAGLE II SB · 8(a) · pWin 35% · $45.0M · Award 2026-07-15 · ON_TRACK**.
- Same master-detail layout: left **section index** (now 4 items, not 10) with confidence chip + feeds-to label per item; right **detail panel** with the FAIR bands + envelope.
- Same plan header strip: overall confidence chip + "N / 4 confirmed" + "Drafted by **Teaming Intelligence Agent** · v3 · 2026-02-10" + All / Needs Attention / Confirmed triage + Regenerate.
- Same action row per section: **Confirm · Request Review · Edit · Ask AI** + feeds-to chips. Same Ask AI drawer (scoped, suggested questions). Same source-chip + AI-reasoning bands. Same Version History footer.

### Section index (4 sections)
| # | Section | Confidence | Feeds → |
|---|---|---|---|
| 1 | Teaming Strategy | 80% | Solutioning, Pricing |
| 2 | Capability Gaps | 72% | Solutioning, Staffing |
| 3 | Partner Pipeline | 58% | Staffing, Data Calls |
| 4 | Workshare & Small Business | 85% | Pricing, Proposal |

Overall: **71% confidence · 1 / 4 confirmed** (DataBridge is the only Committed partner; strategy approach confirmed; pipeline + gaps still in motion).

---

## 2. Content per section — bind 1:1 from `opp-001-teaming.json`

**Anti-flattening rule (hard):** render *every* field of each object. Do not summarize a multi-sentence `rationale`, `gapDescription`, `strengthForTeam`, or `scope[]` into one line. If the JSON has 5 `teamValues`, show 5. If a partner has 3 `keyPersonnel`, show 3.

### Section 1 — Teaming Strategy
- 📋 **Facts:** approach = **Prime Contractor**; prime = **TechForward Solutions**, role, workshare **55%**, certifications [8(a), SDVOSB, FedRAMP High ATO]; 3 subcontractors with role + workshare (DataBridge 20%, GovFlow 15%, MainframeNext 10%); **SB Target 35%**.
- 🔍 **Analysis:** full `rationale` (verbatim) + full `sbTargetBasis` (the 33% DHS OSDBU floor logic) + prime `keyContributions[7]` rendered as a list.
- 🧠 **Intelligence:** the 5 `teamValues` (partner-selection criteria) rendered in full.
- ✅ **Recommendations:** TS-R1/R2/R3 (see §4 envelope).

### Section 2 — Capability Gaps
- 📋 **Facts:** 3 gap cards — **CG-01** Enterprise-Scale Data Migration & ETL (HIGH · FILLING · DataBridge), **CG-02** DHS-Specific ServiceNow Integration (MEDIUM · FILLING · GovFlow), **CG-03** Mainframe Application Modernization (MEDIUM · IDENTIFYING · MainframeNext). Each card: capability, severity pill, status pill, `filledBy`.
- 🔍 **Analysis:** per gap — full `gapDescription`, `impactIfUnfilled`, `requiredCapabilities[]`, `recommendedPartner` + `alternatePartners[]`.
- 🧠 **Intelligence:** which gap is critical-path (CG-01, the incumbent's most visible gap and primary discriminator), and the 3.5%-of-portfolio framing on CG-03.
- ✅ **Recommendations:** CG-R1/R2/R3.

### Section 3 — Partner Pipeline  ← the kanban (see §3 for the board spec)
- 📋 **Facts:** the **7-stage kanban board** with the 5 partner cards placed by stage (see §3).
- 🔍 **Analysis:** per partner (in a detail drawer or expanded card) — `coreCapability`, `relevantExperience`, `workshare` + `estimatedValue`, `keyPersonnel[]` (name/role/clearance/years), `pastPerformance[]` (contract/value/CPARS/agency), NDA + TA status with dates.
- 🧠 **Intelligence:** per partner — `risks[]` (with severity + mitigation), `strengthForTeam`, `competitorInterest`. The 🔒 framing applies to competitor and OCI notes.
- ✅ **Recommendations:** PP-R1/R2/R3/R4.

### Section 4 — Workshare & Small Business
- 📋 **Facts:** workshare allocation table — Prime + 3 subs: **workshare % · estimated $ · FTE · scope[]**; total **100% · $45.0M · 33 FTE**.
- 🔍 **Analysis:** the `sbSummary` — **sbGoal 35% vs sbActual 100%**, the socioeconomic breakdown (8(a) 90% · SDVOSB 55% · WOSB 10% · HUBZone 15% · SDB 20%), and the dual-credit `notes`.
- 🧠 **Intelligence:** how the 100% SB team maximizes DHS socioeconomic goal achievement; evaluator framing.
- ✅ **Recommendations:** WS-R1/R2.

---

## 3. The Partner Pipeline kanban (Section 3, Facts band)

A horizontal board with **7 stage columns**, left to right:
`Identified → Contacted → NDA_Signed → Evaluating → TA_Signed → Committed → Declined`

Place the 5 real partners as cards:

| Card | Stage column | Card shows |
|---|---|---|
| **TP-01 DataBridge Analytics** | **Committed** | Data Migration & ETL · 20% · $9.0M · NDA ✓ · TA in legal review (est. 2026-02-15) · 🔒 CACI/Vertex also contacted |
| **TP-02 GovFlow Technologies** | **Evaluating** | ServiceNow & ITSM · 15% · $6.75M · NDA ✓ · term sheet (est. 2026-02-20) |
| **TP-03 MainframeNext Inc.** | **Contacted** | Mainframe Modernization · 10% · $4.5M · NDA in legal review (est. 2026-02-12) |
| **TP-04 Coalfire Federal** | **Contacted** + ⚠ On Hold | FedRAMP 3PAO · 0% advisory · 🔒 **OCI review — possible Peraton 3PAO** |
| **TP-05 Nightwing Analytics** | **Identified** | Cloud FinOps · 0% · limited-data treatment (see §5) |

Card interaction: each card is draggable across columns (visual only in the prototype) and opens the partner detail (the Analysis + Intelligence content above). A thin progress rail under the board shows committed-vs-target workshare: **committed 20% of 45% sub-target** (only DataBridge committed so far).

---

## 4. The intelligence envelope (bind verbatim — do not invent)

```json
{
  "overall_confidence": 71,
  "generated_by": "Teaming Intelligence Agent · v3 · 2026-02-10",
  "sections": {
    "teamingStrategy": {
      "confidence": 80,
      "ai_reasoning": "Prime is the correct posture: TechForward's active 8(a), FedRAMP High ATO, and DHS Exceptional CPARS clear the largest barriers, and the three subcontractors close discrete gaps without touching the SSE/cloud discriminators TechForward owns. The 55/20/15/10 split keeps the prime majority while the 35% SB target clears the 33% DHS OSDBU floor with margin.",
      "sources": [
        {"label": "CSA-001 Strategy — Section 3 cascade"},
        {"label": "SAM.gov — entity registrations & set-aside"},
        {"label": "DHS OSDBU subcontracting guidance"}
      ],
      "version_history": [{"version": 1, "changed_at": "2026-02-10", "changed_by": "agent", "change_summary": "Generated from CSA-001 team strategy cascade"}],
      "recommendations": [
        {"id": "TS-R1", "text": "Confirm Prime Contractor approach — 8(a) + FedRAMP High ATO + DHS past performance", "status": "accepted"},
        {"id": "TS-R2", "text": "Confirm 35% SB subcontracting target — exceeds the 33% DHS OSDBU floor", "status": "accepted"},
        {"id": "TS-R3", "text": "Confirm the 3-subcontractor structure: DataBridge 20% / GovFlow 15% / MainframeNext 10%", "status": "proposed"}
      ],
      "conflicts": []
    },
    "capabilityGaps": {
      "confidence": 72,
      "ai_reasoning": "The three gaps map cleanly to the 340+ application inventory: data migration at ~2x TechForward's prior scale (CG-01, HIGH), DHS-specific ServiceNow workflows (CG-02), and 12 z/OS mainframe apps TechForward has no past performance for (CG-03). CG-01 and CG-02 are filling; CG-03 is still identifying because MainframeNext's NDA is unsigned, which holds section confidence below the strategy section.",
      "sources": [
        {"label": "Draft PWS / RFP analysis"},
        {"label": "CPB-001 — own-capability baseline"},
        {"label": "USAspending — subaward history"}
      ],
      "version_history": [{"version": 1, "changed_at": "2026-02-10", "changed_by": "agent", "change_summary": "Gap analysis from PWS task areas"}],
      "recommendations": [
        {"id": "CG-R1", "text": "Fill CG-01 (Data Migration & ETL) with DataBridge — incumbent sub knowledge of all legacy schemas", "status": "proposed"},
        {"id": "CG-R2", "text": "Fill CG-02 (ServiceNow) with GovFlow — Very Good DHS CPARS on the exact platform", "status": "proposed"},
        {"id": "CG-R3", "text": "Source CG-03 (Mainframe) with MainframeNext; hold Astadia Federal as alternate", "status": "proposed"}
      ],
      "conflicts": []
    },
    "partnerPipeline": {
      "confidence": 58,
      "ai_reasoning": "One of five partners is Committed (DataBridge, verbal — TA in legal review), two are mid-pipeline (GovFlow evaluating, MainframeNext contacted), one is on OCI hold (Coalfire), and one is newly identified (Nightwing). No teaming agreement is signed yet and CACI/Vertex is competing for DataBridge and GovFlow, which is why this section needs attention despite a strong target structure.",
      "sources": [
        {"label": "ENT-001 — partner profiles"},
        {"label": "USAspending — partner contract history"},
        {"label": "SAM.gov — UEI / CAGE / certifications"},
        {"label": "DHS OSDBU matchmaking event"},
        {"label": "Competitive intel — CMP-001"}
      ],
      "version_history": [{"version": 1, "changed_at": "2026-02-10", "changed_by": "agent", "change_summary": "Pipeline seeded from strategy + entity recommendations"}],
      "recommendations": [
        {"id": "PP-R1", "text": "Accelerate DataBridge TA to signature before CACI/Vertex — verbal commit, TA in legal review (est. 2026-02-15)", "status": "proposed"},
        {"id": "PP-R2", "text": "Advance GovFlow from term sheet to TA (est. 2026-02-20); lock before competitor approach", "status": "proposed"},
        {"id": "PP-R3", "text": "Resolve Coalfire OCI review before any commitment — if confirmed as Peraton's 3PAO, decline", "status": "accepted"},
        {"id": "PP-R4", "text": "Defer Nightwing (FinOps) unless capture review flags FinOps as a gap — TechForward has internal FinOps capability", "status": "proposed"}
      ],
      "conflicts": [
        {"type": "oci_risk", "message": "Coalfire Federal may be Peraton's current FedRAMP 3PAO — a potential Organizational Conflict of Interest. OCI review is in progress; if confirmed, Coalfire cannot participate. Leidos has already approached Coalfire for its NexGen team."}
      ]
    },
    "workshareSmallBusiness": {
      "confidence": 85,
      "ai_reasoning": "The allocation sums to 100% / $45.0M across prime and three subs, and the entire team is small business, so 100% of workshare counts toward DHS goals against a 35% target. Dual-credit categories (TechForward counts toward both 8(a) and SDVOSB) maximize socioeconomic goal achievement — a clean, evaluator-friendly story.",
      "sources": [
        {"label": "Workshare allocation engine"},
        {"label": "SAM.gov — socioeconomic certifications"}
      ],
      "version_history": [{"version": 1, "changed_at": "2026-02-10", "changed_by": "agent", "change_summary": "Computed from committed + proposed workshare"}],
      "recommendations": [
        {"id": "WS-R1", "text": "Confirm 55/20/15/10 workshare allocation ($24.75M / $9.0M / $6.75M / $4.5M)", "status": "proposed"},
        {"id": "WS-R2", "text": "Confirm 100% SB team strategy; document dual-credit categories for DHS socioeconomic goals", "status": "accepted"}
      ],
      "conflicts": []
    }
  }
}
```

---

## 5. States to render

1. **Conflict callout (§3 Partner Pipeline):** amber warning under the AI Reasoning band with `conflicts[0].message` verbatim (Coalfire OCI). Coalfire's card also carries a ⚠ On Hold badge.
2. **Limited-data treatment (§3, Nightwing card):** TP-05 has no NDA, no TA, no key personnel, no past performance. Render its card in a muted/limited state with the line **"Limited data — run ANALYZE workflow for better intelligence"** and no fabricated detail. (This surfaces the CSA-001 degradation rule at card level without forcing a false section score.)
3. **Confirmed vs draft:** §1 strategy confirmable; DataBridge Committed; everything else neutral/proposed.

---

## 6. Backward-engineering demo (consistent with the Strategy demo)

In Strategy we rejected DataBridge ("partner no longer bidding"). Carry that edit through Teaming as a **"Change detected"** state (toggle, same as Strategy):

- **TP-01 DataBridge card** → moves to **Declined**: struck title, reason line **"Withdrawn — confirmed no longer bidding (2026-02-12)"**.
- **CG-01 gap** → status reverts **FILLING → IDENTIFYING**; card now surfaces the alternates **MigrationPro Federal, Attain Federal**.
- **Workshare & SB (§4)** → a **20% / $9.0M hole** opens; total drops to **80%**; SB breakdown recalculates (8(a) and SDB shares fall); a "below plan" flag appears on the workshare rail.
- **New recommendation** auto-appears in §2: **"Promote MigrationPro Federal (alternate) to fill CG-01 — TA outreach required."**
- **Section confidences** drop: Partner Pipeline → ~46 (now shows the yellow **"limited data — run ANALYZE"** banner), Capability Gaps → ~55.
- **Toast** at the top of the detail panel: **"Change detected — CG-01 reopened; downstream flagged for regeneration: Staffing, Pricing, Workshare."**
- **Section index** shows amber dots on §2, §3, §4.

---

## 7. Done checklist (the Greg test)
- [ ] 4 sections, each with the full FAIR storyline; every JSON field rendered (anti-flattening), no summarized multi-sentence fields.
- [ ] Every data value traces to `opp-001-teaming.json` — nothing invented; header/facts agree ($45.0M, 35% SB, Prime).
- [ ] Envelope on all 4: confidence chip (header + index) · 🤖 AI Reasoning · 📎 source chips · ✅ Recommendations (accept/reject/edit) · Version History · Edit button.
- [ ] Plan header: 71% overall · 1/4 confirmed · "Drafted by Teaming Intelligence Agent · v3 · 2026-02-10".
- [ ] §3 kanban: 7 stage columns, 5 partner cards placed per the table, draggable, with the committed-vs-target rail.
- [ ] §3 conflict callout (Coalfire OCI) + Nightwing limited-data card.
- [ ] §4 workshare table (100% / $45.0M / 33 FTE) + SB summary (35% goal vs 100% actual + socioeconomic breakdown).
- [ ] "Change detected" toggle drives the full DataBridge-withdrawal cascade in §6, consistent with the Strategy demo.
- [ ] Ask AI drawer scoped per section; same chrome as the approved Strategy tab.
