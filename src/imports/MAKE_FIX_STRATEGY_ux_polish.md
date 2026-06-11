# Figma Make — UX Polish Pass · Strategy & Plan tab
## Apply usability fixes only. Do NOT touch data, content, FAIR structure, or states.

The Strategy tab is **content-complete and approved**: real opportunity data bound 1:1, the FAIR bands (Facts/Analysis/Intelligence/Recommendations) across all 10 sections, the intelligence envelope (confidence, AI reasoning, sources, version history), the §4 low-confidence banner, the §3 conflict callout, and the "Change detected" backward-engineering state. **Keep all of that exactly as it is.**

This pass is **strictly a UX/visual-hierarchy refinement**. Each fix below is grounded in a named principle. Apply them without changing any bound value, any section's text, the band order, or the cascade wiring.

### ⛔ Hard rules
1. Do not change any data value, label text, AI reasoning, source chip, recommendation text, or confidence number.
2. Do not remove any content. Where a fix says "collapse," the content stays in the DOM behind a disclosure control — it is hidden, not deleted.
3. Do not alter the FAIR band order, the Ask AI drawer, or the backward-engineering behavior.

---

## Fix 1 — Enlarge the accept / reject / edit targets
**Problem:** the three icon buttons in every Recommendations & Actions item are 22×22px, icon-only, 26px apart. **(Fitts's Law + WCAG target ≥44×44 + Nielsen #6 Recognition over Recall.)**
- Increase each button's hit area to **≥32×32px** (keep the 16px icon; grow the padding).
- Increase spacing between the three buttons to **≥8px**.
- Differentiate them clearly: accept = green check, reject = red ✕, edit = neutral pencil — and add a **tooltip label** on hover ("Accept" / "Reject" / "Edit").
- Make **Accept** the visually dominant of the three; reject and edit sit quieter.

## Fix 2 — Add in-section disclosure to cut scan cost (without losing depth)
**Problem:** each section stacks Facts + tables + lists + recommendations into one long scroll; the §3 detail panel is ~1518px tall. Depth is intentional (owner-requested) but unscannable. **(Hick's Law — detail on demand; Zeigarnik — progress cues; Tesler's Law.)**
- For any band that renders a **list or table of 4+ rows** (e.g., §5 Staffing 8 positions, §9 Risk Register 5 risks, §4 5 relationships, §10 6 categories), show the **first 3 rows** and collapse the rest behind a **"Show all N"** link that expands in place.
- Keep Facts, Analysis summary, Intelligence summary, and all Recommendations always-visible. Only the long enumerations collapse.
- Default state: collapsed.

## Fix 3 — Establish hierarchy inside the Facts band
**Problem:** the Facts band is a uniform label:value grid where every pair has equal weight; nothing guides the eye to the bid-critical facts. **(Refactoring UI — not all elements equal; use 2–3 text colors; de-emphasize competing elements.)**
- Emphasize the **2–3 decision-critical facts** per section with heavier weight + darker color. For §1: **Set-Aside (8(a))**, **Estimated Value ($45.0M)**, **Prime / Sub (Prime)**.
- De-emphasize the remaining label:value pairs: keep the **value** in primary text color, drop the **label** to secondary grey.
- Do not change any value or label text — only weight and color.

## Fix 4 — Disambiguate the two left rails
**Problem:** the global app Sidebar (240px) and the section index (252px) sit adjacent with similar treatment; they can read as one system. **(Gestalt Similarity → resolve with Law of Common Region.)**
- Give the section index a subtle **inset/card background** distinct from the app sidebar, and add a small **"SECTIONS"** header above item 1.
- Result: the section index reads as a panel belonging to the Strategy content, not as app navigation.

## Fix 5 — Make the action row a button pyramid
**Problem:** Confirm, Request Review, Edit, Ask AI render at similar weight; the primary action does not dominate. **(Refactoring UI — button hierarchy pyramid; Hick's Law.)**
- **Confirm** = solid primary (filled).
- **Request Review** = secondary (outline).
- **Edit** and **Ask AI** = tertiary (low-contrast / link or icon-with-label).
- Keep all four labels and icons; change only their visual weight.

## Fix 6 — Quiet the status pills
**Problem:** many ALL-CAPS pills (HIGH, NEGOTIATING, COMMITTED, TS/SCI, PARTNER) compete with substantive content for first fixation. **(Refactoring UI — de-emphasize competing elements; balance weight/contrast; letter-spacing on all-caps.)**
- Reduce pill loudness: lighter fills, smaller size, and **+0.04em letter-spacing** on the all-caps text.
- Reserve the single loudest treatment (saturated fill) for **attention states only** (e.g., ⚠ Needs Review, HIGH risk). Routine statuses (CONTACTED, IDENTIFIED, COMMITTED) use the quiet treatment.

## Fix 7 — Remove the scaffolding label from production chrome
**Problem:** the control named "Change detected demo" sits in the plan header and reads as a prototype artifact in a founder review. **(Nielsen #2 Match system/real world + #8 Minimalist.)**
- Rename it to a neutral control (e.g., **"Simulate edit"** or **"Preview cascade"**), or move it out of the app frame into a clearly-separate prototype toolbar.
- Do not change what it does — only its label/placement.

## Fix 8 — Verify and fix secondary-text contrast
**Problem:** small grey secondary text (feeds-to labels, "Last reviewed …", source chip text, ~16–17px) risks falling below the WCAG floor. **(WCAG 4.5:1 normal text.)**
- Check every grey secondary text token against its background. Any pair below **4.5:1** → darken the text (for example, from a ~#9E9E9E to **≥#767676** on white).
- Keep every confidence/status color paired with its number or label (already correct — preserve it).

---

## Done checklist
- [ ] Accept/reject/edit buttons ≥32×32px, ≥8px apart, with hover tooltips; Accept dominant.
- [ ] Lists/tables of 4+ rows collapsed to 3 with "Show all N"; Facts/summaries/recommendations stay visible.
- [ ] Facts band: 2–3 critical facts emphasized, remaining labels demoted to grey — no text changed.
- [ ] Section index has an inset background + "SECTIONS" header, visually distinct from app nav.
- [ ] Action row reads as a pyramid: Confirm solid → Request Review outline → Edit/Ask AI tertiary.
- [ ] Status pills quieted with letter-spacing; loud fill reserved for attention states only.
- [ ] "Change detected demo" renamed/relocated; behavior unchanged.
- [ ] All secondary grey text verified ≥4.5:1; darkened where needed.
- [ ] Untouched: every data value, label, AI reasoning, source, recommendation, confidence number, the FAIR order, the Ask AI drawer, the §4 banner, the §3 conflict, and the backward-engineering state.
