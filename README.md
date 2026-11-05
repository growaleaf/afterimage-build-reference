# Afterimage — Build & Damage Mechanics Reference

A static reference page for *Afterimage* (Aurogon Shanghai, 2024, Steam appid 1701520) — built so
a player ~30 hours in who just noticed their crit-damage accessory isn't moving their numbers the
way they expected can see, in one place, both the one reverse-engineered damage formula that
exists anywhere and the named build archetypes from a guide site, each honestly labeled by how
solid its source actually is.

Open `index.html` in a browser. No build step, no server, no framework — vanilla HTML/CSS/JS.

## Contents

1. **Damage Mechanics Explainer** — the saturnv5 Steam Community post's findings: how percentage
   modifiers scale ATK rather than output damage, the DEF/DR/Resistance formula, a worked example,
   and the recommended critical-chance : critical-damage ratio. Labeled single-sourced,
   unconfirmed, dated Jan 2024.
2. **Build Browser** — four named build archetypes (Critical Damage, Defense, Magic, Damage
   Output) from TheGamer's guide, each with its weapon/subweapon/spellbook/armor/accessory combo,
   filterable by focus.

## Sourcing — re-fetched live this session, not reused from the charter's transcription

- **Damage mechanics**: `steamcommunity.com/app/1701520/discussions/0/4140564315472489731`,
  re-fetched 2026-11-05 (HTTP 200). Confirmed the post is by user saturnv5, dated Jan 21, 2024, and
  is about this game — the page names in-game content ("Trial of Soul," "Judgement Cut") even
  though it doesn't happen to use the Rakana/Yvaine/Renaryn nouns named in the charter's
  name-collision warning. The re-fetch found more detail than the charter's paraphrase: a full
  stated formula (`Actual damage = [min(ATK, DEF) / 3 + max(0, ATK - DEF)] × (1 + DR) × (1 - Res)`),
  a worked numeric example, an elemental-weakness note, and a comment-thread clarification on the
  DR sign — all reproduced here from the live post, not invented.
- **Builds**: `thegamer.com/afterimage-best-builds-weapons-armor-guide/`, re-fetched 2026-11-05
  (HTTP 200). Confirmed the article is about this game — it names the Engardin region, boss Loss
  the Galefeather, and game-specific gear (Sting, Scythe of Abyss, Stormfall Staff, Cloak of
  Secret). **Disclosed discrepancy from the charter:** the charter's Gate 2 summary said "three
  build names"; the live re-fetch found **four** named builds (Critical Damage, Defense, Magic,
  Damage Output) — the charter's paraphrase omitted the Magic build. Per Principle XXII (fetch
  live, don't reuse the orchestrator's transcription unchecked), all four are shipped here, not
  three.

**Disclosed limit — damage formula:** this is one player's own reverse-engineered testing from
Jan 2024, not a developer-published formula. No second source confirming these numbers was found
during this session's search. It is labeled `single-sourced, unconfirmed, dated Jan 2024` on the
page itself, with an explicit warning that the game has likely patched since and the numbers may
be stale — not presented as settled fact.

**Disclosed limit — build rationale:** TheGamer's article does not explain *why* each gear combo
works beyond the gear's own listed stats (e.g., Sting's Critical Damage +7%). That absence of
rationale is preserved and shown per-build rather than invented.

## Rails respected

- Only `steamcommunity.com` and `thegamer.com` fetched (both in-rail domains); no Fandom domain
  touched.
- No registry writes, no git commit, no deployment — left to the orchestrator per rails.
- No account access, no game files extracted, no cheats — every fact is reproduced from text
  already published on public forum/guide sites.

## Verification run

```
$ node test.js
ALL PASS (32/32: exactly 4 builds with full gear lists and non-duplicate focuses, all four named
focuses present, filter-by-focus known case — "Magic" returns exactly 1 build with helmet "Silent
Mask" — damage mechanics findings present with the saturnv5 author and the unconfirmed/
single-sourced disclosure label, the full formula text present verbatim, the crit-ratio
recommendation present, and the DOM surface renders the focus filter and stale-source callout.)

$ python3 Tools/slop_lint.py Orchard/FACTORY/output/afterimage-build-reference/
slop_lint: clean — 0 findings
```

Served locally with `python3 -m http.server` and curled: `index.html` and `data.js` both returned
HTTP 200; `saturnv5`, `Silent Mask`, and the full formula string `min(ATK, DEF)` all confirmed
present in the served bytes.
