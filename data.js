// Afterimage — Build & Damage Mechanics Reference
// Sources (fetched live 2026-11-05, see README.md for full citation + sourcing notes):
//   DAMAGE MECHANICS: Steam Community discussion, app 1701520, thread id 4140564315472489731
//                      posted by user "saturnv5", Jan 21 2024 — SINGLE SOURCE, UNCONFIRMED,
//                      the author's own reverse-engineered testing, not an official formula.
//   BUILDS:            thegamer.com/afterimage-best-builds-weapons-armor-guide/ — a guide site's
//                      named gear combos, no stated numeric rationale.
(function () {
  "use strict";

  var root = (typeof window !== "undefined") ? window : (typeof global !== "undefined" ? global : {});

  var FETCHED = "2026-11-05";

  var DAMAGE_SOURCE_LABEL = "single-sourced, unconfirmed, dated Jan 2024";

  var DAMAGE_MECHANICS = {
    author: "saturnv5",
    postDate: "Jan 21, 2024",
    sourceLabel: DAMAGE_SOURCE_LABEL,
    staleWarning:
      "This is one player's own reverse-engineered testing from Jan 2024, not a developer-" +
      "published formula. No second source confirming these numbers was found. The game has " +
      "likely patched since — treat every number below as potentially stale.",
    findings: [
      {
        heading: "Percentage modifiers scale ATK, not output damage",
        text:
          "All percentage-based modifiers — including \"Final Damage %\" and critical damage — " +
          "were found to affect the character's overall ATK stat rather than adding to the final " +
          "damage number directly. Multiple percentage modifiers of this kind stack multiplicatively " +
          "with each other, not additively."
      },
      {
        heading: "Enemy DEF reduces effective ATK, not a flat subtraction",
        text:
          "DEF does not subtract flatly from damage. For the portion of ATK up to the enemy's DEF " +
          "value, damage is reduced to one-third. Any ATK above the DEF value applies at full value. " +
          "This is why pushing ATK well past an enemy's DEF matters more than raw ATK alone."
      },
      {
        heading: "Damage Reduction (DR) and Resistance apply after the DEF step",
        text:
          "DR reduces the damage the enemy receives, applied after the DEF calculation above. " +
          "Resistance only reduces damage of the matching elemental/damage type, and stacks " +
          "multiplicatively with DR rather than replacing it."
      },
      {
        heading: "Full formula as stated by the source",
        text: "Actual damage = [min(ATK, DEF) / 3 + max(0, ATK - DEF)] × (1 + DR) × (1 - Res)",
        note:
          "The source clarified in a reply (when a commenter questioned the sign) that DR here " +
          "represents damage received, so \"1 + DR\" — not \"1 - DR\" — is correct as written."
      },
      {
        heading: "Worked example given by the source",
        text:
          "An ATK of 150 against a DEF of 200 yields 50 damage. A +50% crit modifier raises " +
          "effective ATK to roughly 225 against the same DEF 200, yielding about 92 damage — " +
          "illustrating why the ATK-above-DEF portion of the formula rewards pushing past the " +
          "enemy's DEF threshold rather than smaller incremental ATK gains below it."
      },
      {
        heading: "Elemental weakness exploitation",
        text:
          "The source suggests elemental damage bonuses can be exploited against enemies with low " +
          "or no resistance to that element, and that stacking this with ATK-boosting modifiers " +
          "produced builds doing roughly 3x the damage output of an unequipped character in the " +
          "author's own testing."
      }
    ],
    critRatio: {
      recommendation: "Roughly 1:2 to 1:3, critical chance to critical damage",
      text:
        "The source recommends keeping critical chance to critical damage in a ratio of about 1:2 " +
        "to 1:3 — i.e., for every point of crit chance, aim for roughly 2 to 3 points of crit damage " +
        "— rather than maximizing either stat in isolation."
    }
  };

  // Four named builds — TheGamer's article names four builds (Critical, Defense, Magic,
  // Damage), not three. The charter's Gate 2 summary mentioned three; the live re-fetch found a
  // fourth (Magic) that the charter's paraphrase omitted. Shipping all four per Principle XXII —
  // reproducing what the source actually says, not the orchestrator's transcription.
  var BUILDS = [
    {
      id: "critical",
      focus: "Critical Damage",
      weapon: "Sting (Dualblades)",
      subweapon: "Scythe of Abyss (Scythe)",
      spellbook: "Stormfall Staff",
      helmet: "Exotic Mask",
      armor: "Cloak of Secret",
      boots: "Silent Leggings",
      accessories: [
        "Adventurer's Pendant",
        "Bracelet of Bravery",
        "Calamity Ring (Critical Rate +4.5%, Final Damage +5%)"
      ],
      notes:
        "No explicit rationale given beyond the gear's own listed stats — Sting carries " +
        "Critical Damage +7%, the Scythe of Abyss carries Critical Rate +3.5%."
    },
    {
      id: "defense",
      focus: "Defense",
      weapon: "Waterflow (Greatsword)",
      subweapon: "Pale Dance (Whip)",
      spellbook: "Stormfall Staff",
      helmet: "Exotic Mask",
      armor: "Cloak of Secret",
      boots: "Silent Leggings",
      accessories: [
        "Heresy Hood",
        "Amethyst Ring",
        "Parasitic Seed (Damage Received -10%)"
      ],
      notes:
        "No explicit rationale given in the source. The Parasitic Seed's damage-received " +
        "reduction and the shared defensive armor pieces suggest a survivability focus, but the " +
        "article does not say so directly."
    },
    {
      id: "magic",
      focus: "Magic",
      weapon: "Venomad (Whip)",
      subweapon: "Pale Dance (Whip)",
      spellbook: "Stormfall Staff",
      helmet: "Silent Mask",
      armor: "Silent Robe",
      boots: "Silent Leggings",
      accessories: [
        "Mask of a Maniac Mage (MP Cost -2.5%)",
        "Amethyst Ring",
        "Amethyst Necklace (MP Recovery +4%)"
      ],
      notes:
        "No explicit rationale given in the source. This is the only one of the four builds that " +
        "swaps out the Exotic Mask / Cloak of Secret pairing used by the other three. The MP-cost " +
        "and MP-recovery accessories suggest a spellcasting focus, but the article does not state " +
        "this directly."
    },
    {
      id: "damage",
      focus: "Damage Output",
      weapon: "Scythe of Abyss (Scythe)",
      subweapon: "Muramasa (Blade)",
      spellbook: "Stormfall Staff",
      helmet: "Exotic Mask",
      armor: "Cloak of Secret",
      boots: "Silent Leggings",
      accessories: [
        "Bracelet of Bravery",
        "Necklace of Bravery (Normal Attack Damage +1.5%)",
        "Adventurer's Pendant"
      ],
      notes:
        "No explicit rationale given. The article notes these builds \"aren't the end all be all\" " +
        "and encourages experimenting with gear rather than treating any build as a fixed answer."
    }
  ];

  var SOURCES = [
    {
      name: "Steam Community — Afterimage discussions, damage formula analysis by saturnv5 (Jan 21, 2024, re-fetched " + FETCHED + ")",
      url: "https://steamcommunity.com/app/1701520/discussions/0/4140564315472489731"
    },
    {
      name: "TheGamer — Afterimage: Best Builds, Weapons, And Armor Guide (re-fetched " + FETCHED + ")",
      url: "https://www.thegamer.com/afterimage-best-builds-weapons-armor-guide/"
    }
  ];

  root.AFTERIMAGE_DATA = {
    FETCHED: FETCHED,
    DAMAGE_MECHANICS: DAMAGE_MECHANICS,
    DAMAGE_SOURCE_LABEL: DAMAGE_SOURCE_LABEL,
    BUILDS: BUILDS,
    SOURCES: SOURCES
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = root.AFTERIMAGE_DATA;
  }
})();
