# Decision Record — DR-2026-06-11b · Derived Pricing & Past Performance Data for opp-001

**Status:** Adopted (working) — pending Greg ratification · **Owner:** Valerian · **Tier:** C (derived mock; `_provenance` in each file)

## Context
No `opp-001-pricing.json` or `opp-001-pastperformance.json` exists in Zulu (confirmed via Drive search). To build the Pricing and Past Performance tabs against the DHS pursuit (rather than a different scenario), both were derived from approved opp-001 data, same method as the Solutioning derivation (DR-2026-06-11).

## Pricing (`opp-001-pricing.json`)
- **Derived from:** strategy.json `pricingStrategy` (PTW $42.0M, LPTA floor $38M, 22% margin, competitive rates), teaming.json `workshareAllocation` ($45.0M ceiling; subs $9.0M/$6.75M/$4.5M), staffing.json LCAT labor (the ROM live-link).
- **Centerpiece:** the price-to-win vs build-up **hourglass** Greg asked for — top-down PTW $42.0M, bottom-up build-up $44.2M, $2.2M gap, proposed $42.8M with documented closing levers.
- **Reconciliation made:** 33 FTE at the strategy's "$185/hr" for 5 years exceeds the $45M ceiling. Resolved by treating $185/hr as the **senior-labor competitive rate** (vs incumbent $195/hr) and deriving a **full-program blended rate ~$131/hr** from the ceiling. Both are labeled in PR-1. Cost elements sum to $44.2M.
- **Cascade:** PR-4 (Subcontractor Costs) is the DataBridge anchor — withdrawal strikes the $9.0M line and forces a CG-01 re-source; confidence 64→46.

## Past Performance (`opp-001-pastperformance.json`)
- **Derived from:** datacalls.json `DC-001` package (3 CPARS references + capability statement), strategy.json references, partner references from teaming.json (GovFlow $3.1M; DataBridge USCIS $4.2M).
- **Hard rule applied:** every CPARS rating is labeled **"estimated — public data inference"** (`cparsBasis` field + top-level `cparsDisclaimer`). Direct CPARS access is government-restricted; never claimed.
- **Reconciliation made — VA vs Army:** strategy.json WT-01 attributes the 180-app / CloudPathfinder migration to **VA**; CG-01 and the DC-001 package attribute it to **Army**. The DC-001 data-call package is the authoritative past-performance collection, so Past Performance uses **Army** (PP-02). **Open item for Greg:** Solutioning sol-1's `proof` line currently says "VA Migration" and should reconcile to Army, OR Greg rules the other way and PP-02 changes. Flagged in both files' `_provenance`.
- **Cascade:** PP-05 (DataBridge USCIS reference) is the anchor — withdrawal removes the partner reference; reference count 5→4.

## Labeling rule (non-negotiable, both files)
Present to Greg as "how PRC-001 / PPF-001 output would look for this pursuit, populated from approved capture intelligence." Never as live agent output. `_provenance` travels with each file.

## Pending
- [ ] Greg: ratify both derivations; **rule on the VA-vs-Army attribution** (affects Past Performance PP-02 and Solutioning sol-1).
- [ ] Greg: confirm the pricing posture (proposed $42.8M, dual best-value/LPTA model).
- [ ] Add both to the Decisions-for-Greg list.
- [ ] If a real pricing/PP capture later exists in vendor backlog, it supersedes these.
