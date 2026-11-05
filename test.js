// Headless structural tests. Run: node test.js
var data = require("./data.js");
var fs = require("fs");

var failures = 0;

function assert(cond, label) {
  if (!cond) {
    failures++;
    console.log("FAIL " + label);
  } else {
    console.log("PASS " + label);
  }
}

// ───────────────────────────────── builds

assert(data.BUILDS.length === 4, "exactly 4 builds (got " + data.BUILDS.length + ")");

var focuses = {};
data.BUILDS.forEach(function (b) {
  assert(typeof b.focus === "string" && b.focus.length > 0, b.id + " has a non-empty focus");
  assert(typeof b.weapon === "string" && b.weapon.length > 0, b.id + " has a non-empty weapon");
  assert(Array.isArray(b.accessories) && b.accessories.length > 0, b.id + " has at least one accessory");
  assert(!focuses[b.focus], b.focus + " focus is not a duplicate");
  focuses[b.focus] = true;
});

["Critical Damage", "Defense", "Magic", "Damage Output"].forEach(function (f) {
  assert(!!focuses[f], "focus \"" + f + "\" is present among the four builds");
});

// filter-by-focus known case: the Magic build is the only one with Silent Mask/Silent Robe
var magicBuild = data.BUILDS.filter(function (b) { return b.focus === "Magic"; });
assert(magicBuild.length === 1, "filtering by focus \"Magic\" returns exactly 1 build");
assert(magicBuild[0].helmet === "Silent Mask", "Magic build's helmet is Silent Mask (known case)");

// ───────────────────────────────── damage mechanics

assert(data.DAMAGE_MECHANICS.findings.length > 0, "damage mechanics has at least one finding");
assert(data.DAMAGE_MECHANICS.author === "saturnv5", "damage mechanics author is saturnv5");
assert(data.DAMAGE_SOURCE_LABEL.toLowerCase().indexOf("unconfirmed") !== -1,
  "damage source label discloses unconfirmed status");
assert(data.DAMAGE_SOURCE_LABEL.toLowerCase().indexOf("single-sourced") !== -1,
  "damage source label discloses single-sourced status");

var formulaFinding = data.DAMAGE_MECHANICS.findings.filter(function (f) {
  return f.heading.toLowerCase().indexOf("formula") !== -1;
});
assert(formulaFinding.length === 1, "exactly one finding states the full formula");
assert(formulaFinding[0].text.indexOf("min(ATK, DEF)") !== -1, "full formula text is present verbatim");

assert(typeof data.DAMAGE_MECHANICS.critRatio.text === "string" &&
  data.DAMAGE_MECHANICS.critRatio.text.indexOf("1:2") !== -1,
  "crit ratio recommendation (1:2 to 1:3) is present");

// ───────────────────────────────── DOM-surface checks

var html = fs.readFileSync(__dirname + "/index.html", "utf8");
assert(html.indexOf("data.js") !== -1, "index.html references data.js");
assert(html.indexOf("focusFilter") !== -1, "index.html has a focus filter control");
assert(html.indexOf("staleNotice") !== -1, "index.html renders the stale-source disclosure callout");

console.log("");
console.log(failures === 0 ? "ALL PASS" : failures + " FAILURE(S)");
process.exit(failures === 0 ? 0 : 1);
