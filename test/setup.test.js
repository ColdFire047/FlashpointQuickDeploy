import test from "node:test";
import assert from "node:assert/strict";

import { SCENARIOS, WEAPON_MARKERS } from "../src/scenarios.js";
import {
  assignWeaponMarkers,
  canRestoreSetup,
  coordinateKey,
  deploymentKeys,
  generateItems,
  keepLegalItems,
  pickObjectiveOutcome,
  pickScenario,
} from "../src/setup.js";

const uniqueKeys = (coordinates) => new Set(coordinates.map(coordinateKey));

test("every scenario contains valid board coordinates and four weapon drops", () => {
  for (const scenario of SCENARIOS) {
    const coordinates = [
      ...scenario.deployment.blue,
      ...scenario.deployment.red,
      ...scenario.weapons,
      ...scenario.respawns.blue,
      ...scenario.respawns.red,
      ...scenario.objectives,
      ...scenario.zones.flatMap((zone) => zone.cells),
      ...(scenario.objectiveSetup?.outcomes.flatMap((outcome) => outcome.objectives) ?? []),
    ];

    assert.equal(scenario.weapons.length, 4, `${scenario.name} should have four weapon drops`);
    assert.ok(scenario.ruleset.length > 0, `${scenario.name} should identify its ruleset`);
    assert.ok(scenario.scoring.length > 0, `${scenario.name} should explain how to score`);
    assert.ok(scenario.target.length > 0, `${scenario.name} should explain how to win`);
    assert.ok(scenario.rounds.length > 0, `${scenario.name} should explain its round limit`);
    coordinates.forEach(({ x, y }) => {
      assert.ok(x >= 1 && x <= 8, `${scenario.name} has an invalid x coordinate`);
      assert.ok(y >= 1 && y <= 8, `${scenario.name} has an invalid y coordinate`);
    });
  }
});

test("scenario identifiers, deployments and fixed weapon locations are unambiguous", () => {
  assert.equal(new Set(SCENARIOS.map(({ id }) => id)).size, SCENARIOS.length);

  for (const scenario of SCENARIOS) {
    const blueDeployment = uniqueKeys(scenario.deployment.blue);
    const redDeployment = uniqueKeys(scenario.deployment.red);
    const weapons = uniqueKeys(scenario.weapons);

    assert.equal(blueDeployment.size, scenario.deployment.blue.length, `${scenario.name} repeats a blue deployment cube`);
    assert.equal(redDeployment.size, scenario.deployment.red.length, `${scenario.name} repeats a red deployment cube`);
    assert.equal(weapons.size, scenario.weapons.length, `${scenario.name} repeats a weapon location`);
    blueDeployment.forEach((key) => assert.equal(redDeployment.has(key), false, `${scenario.name} overlaps deployment zones`));
  }
});

test("hill zones contain four unique cubes and their label anchor", () => {
  for (const scenario of SCENARIOS) {
    for (const zone of scenario.zones) {
      const zoneKeys = uniqueKeys(zone.cells);
      const left = Math.min(...zone.cells.map(({ x }) => x));
      const top = Math.max(...zone.cells.map(({ y }) => y));
      assert.equal(zoneKeys.size, 4, `${scenario.name} Hill ${zone.label} should be 2×2`);
      assert.equal(zoneKeys.has(coordinateKey(zone.anchor)), true, `${scenario.name} Hill ${zone.label} label is outside its zone`);
      assert.deepEqual(zone.anchor, { x: left, y: top }, `${scenario.name} Hill ${zone.label} anchor should be its top-left cube`);
    }
  }
});

test("hill rotation offers every other hill exactly once for each current hill", () => {
  const scenario = SCENARIOS.find(({ id }) => id === "king-of-the-hill");
  const hillLabels = scenario.zones.map(({ label }) => label);
  const rotation = scenario.hillRotation;

  assert.equal(hillLabels.includes(rotation.initial), true);
  assert.deepEqual(rotation.hills, hillLabels.filter((label) => label !== rotation.initial));
  assert.deepEqual(rotation.rolls, ["1–2", "3–4", "5–6", "7–8"]);
  assert.equal(rotation.rolls.length, rotation.hills.length);

  hillLabels.forEach((current) => {
    const nextHills = rotation.hills.map((label) => (label === current ? rotation.initial : label));
    assert.equal(nextHills.length, hillLabels.length - 1);
    assert.equal(new Set(nextHills).size, nextHills.length);
    assert.equal(nextHills.includes(current), false);
    assert.deepEqual([...nextHills].sort(), hillLabels.filter((label) => label !== current).sort());
  });
});

test("v1.5 scoring summaries retain the official targets and round caps", () => {
  const expected = {
    slayer: { scoring: /1 kill per enemy model killed.*VP keyword bonuses do not apply/, target: "4 / 8 / 12 kills", rounds: "No fixed limit" },
    "capture-the-flag": { scoring: /1 VP per enemy flag capture/, target: "3 VP", rounds: "8" },
    oddball: { scoring: /1 VP.*enemy activation.*1 VP.*Assault kill/, target: "11 VP", rounds: "6" },
    strongholds: { scoring: /VP shown.*uncontested objective/, target: "2× total VP in play", rounds: "6" },
    stockpile: { scoring: /1 VP per Power Seed currently deposited/, target: "5 VP", rounds: "8" },
    "king-of-the-hill": { scoring: /4 VP.*active hill/, target: "20 VP", rounds: "8" },
    "total-control": { scoring: /1 VP.*all three Control Zones/, target: "3 VP", rounds: "8" },
    attrition: { scoring: /No VP.*eliminate every enemy unit/, target: "Enemy elimination", rounds: "No fixed limit" },
    vip: { scoring: /1 VP.*enemy VIP/, target: "4 VP", rounds: "8" },
    assault: { scoring: /1 VP.*enemy activation.*Bomb/, target: "3 VP", rounds: "8" },
  };

  Object.entries(expected).forEach(([id, summary]) => {
    const scenario = SCENARIOS.find((entry) => entry.id === id);
    assert.match(scenario.scoring, summary.scoring);
    assert.equal(scenario.target, summary.target);
    assert.equal(scenario.rounds, summary.rounds);
  });
});

test("casual Slayer does not use Organised Play VP scoring", () => {
  const slayer = SCENARIOS.find(({ id }) => id === "slayer");

  assert.equal(slayer.ruleset, "Core");
  assert.doesNotMatch(slayer.scoring, /2 VP|HVT.*add|Spartan Killer.*add/);
});

test("every respawn location is on a board edge", () => {
  for (const scenario of SCENARIOS) {
    const respawns = [...scenario.respawns.blue, ...scenario.respawns.red];
    respawns.forEach(({ x, y }) => {
      assert.ok(x === 1 || x === 8 || y === 1 || y === 8, `${scenario.name} has an interior respawn`);
    });
  }
});

test("item generation never places an item in a deployment zone", () => {
  for (const scenario of SCENARIOS) {
    const blocked = deploymentKeys(scenario);
    for (let roll = 0; roll < 500; roll += 1) {
      const items = generateItems(scenario);
      items.forEach((item) => assert.equal(blocked.has(coordinateKey(item)), false));
      assert.equal(uniqueKeys(items).size, items.length);
    }
  }
});

test("item generation spreads all eight items across different cubes", () => {
  const slayer = SCENARIOS.find(({ id }) => id === "slayer");
  const items = generateItems(slayer, 8, () => 0);
  assert.equal(uniqueKeys(items).size, 8);
});

test("changing scenario keeps legal items and replaces illegal ones", () => {
  const captureTheFlag = SCENARIOS.find(({ id }) => id === "capture-the-flag");
  const items = [{ x: 1, y: 8 }, { x: 4, y: 4 }, { x: 4, y: 4 }];
  const result = keepLegalItems(items, captureTheFlag, () => 0.5);
  assert.notDeepEqual(result[0], items[0]);
  assert.deepEqual(result[1], items[1]);
  assert.equal(deploymentKeys(captureTheFlag).has(coordinateKey(result[0])), false);
  assert.equal(uniqueKeys(result).size, result.length);
});

test("scenario rerolls always choose a different scenario", () => {
  for (const scenario of SCENARIOS) {
    for (const random of [0, 0.2, 0.5, 0.999999]) {
      assert.notEqual(pickScenario(scenario.id, () => random).id, scenario.id);
    }
  }
});

test("weapon marker assignment uses every marker exactly once", () => {
  for (const scenario of SCENARIOS) {
    const assignments = assignWeaponMarkers(scenario);
    assert.deepEqual(assignments.map(({ marker }) => marker).sort(), [...WEAPON_MARKERS].sort());
  }
});

test("Total Control uses one D8 result for three valid active zones", () => {
  const scenario = SCENARIOS.find(({ id }) => id === "total-control");

  assert.deepEqual(scenario.objectiveSetup.outcomes.map(({ roll }) => roll), WEAPON_MARKERS);
  assert.equal(pickObjectiveOutcome(scenario, () => 0), 0);
  assert.equal(pickObjectiveOutcome(scenario, () => 0.999999), 3);

  scenario.objectiveSetup.outcomes.forEach((outcome) => {
    assert.deepEqual(outcome.objectives.map(({ label }) => label), ["A", "B", "C"]);
    assert.equal(uniqueKeys(outcome.objectives).size, 3);
  });

  assert.deepEqual(
    scenario.objectiveSetup.outcomes.map((outcome) => outcome.objectives.map(coordinateKey)),
    [
      ["1,7", "5,5", "6,2"],
      ["3,7", "4,4", "8,2"],
      ["6,7", "6,4", "1,2"],
      ["8,7", "3,5", "3,2"],
    ],
  );
});

test("new scenario layouts match the supplied setup maps", () => {
  const expected = {
    "total-control": {
      blueDeployment: ["1,1", "2,1", "7,1", "8,1"],
      redDeployment: ["1,8", "2,8", "7,8", "8,8"],
      weapons: ["4,6", "7,5", "2,4", "5,3"],
      blueRespawns: ["1,5", "8,5", "5,1"],
      redRespawns: ["4,8", "1,4", "8,4"],
    },
    attrition: {
      blueDeployment: ["7,8", "8,8", "8,7", "1,2", "1,1", "2,1"],
      redDeployment: ["1,8", "2,8", "1,7", "8,2", "7,1", "8,1"],
      weapons: ["3,6", "6,6", "3,3", "6,3"],
      blueRespawns: ["5,8", "4,1"],
      redRespawns: ["1,5", "8,4"],
    },
    vip: {
      blueDeployment: ["3,8", "4,8", "5,8", "6,8", "4,7", "5,7"],
      redDeployment: ["3,1", "4,1", "5,1", "6,1", "4,2", "5,2"],
      weapons: ["2,5", "5,5", "4,4", "7,4"],
      blueRespawns: ["5,8", "1,3", "8,2"],
      redRespawns: ["1,7", "8,6", "4,1"],
    },
    assault: {
      blueDeployment: ["3,8", "4,8", "5,8", "6,8", "3,7", "4,7", "5,7", "6,7"],
      redDeployment: ["3,1", "4,1", "5,1", "6,1", "3,2", "4,2", "5,2", "6,2"],
      weapons: ["2,5", "5,5", "4,4", "7,4"],
      blueRespawns: ["1,7", "8,6", "1,5"],
      redRespawns: ["8,4", "1,3", "8,2"],
    },
  };

  Object.entries(expected).forEach(([id, layout]) => {
    const scenario = SCENARIOS.find((entry) => entry.id === id);
    assert.deepEqual(scenario.deployment.blue.map(coordinateKey).sort(), layout.blueDeployment.sort());
    assert.deepEqual(scenario.deployment.red.map(coordinateKey).sort(), layout.redDeployment.sort());
    assert.deepEqual(scenario.weapons.map(coordinateKey).sort(), layout.weapons.sort());
    assert.deepEqual(scenario.respawns.blue.map(coordinateKey).sort(), layout.blueRespawns.sort());
    assert.deepEqual(scenario.respawns.red.map(coordinateKey).sort(), layout.redRespawns.sort());
  });

  const assault = SCENARIOS.find(({ id }) => id === "assault");
  assert.equal(assault.weaponMode, "tokens");
  assert.deepEqual(assault.objectives.map(coordinateKey).sort(), ["4,6", "5,3"]);
});

test("strongholds keeps the original opposing corner deployments", () => {
  const strongholds = SCENARIOS.find(({ id }) => id === "strongholds");

  assert.deepEqual(
    strongholds.deployment.red.map(coordinateKey).sort(),
    ["1,1", "2,1", "3,1", "4,1", "1,2", "1,3", "1,4"].sort(),
  );
  assert.deepEqual(
    strongholds.deployment.blue.map(coordinateKey).sort(),
    ["5,8", "6,8", "7,8", "8,8", "8,5", "8,6", "8,7"].sort(),
  );
});

test("a valid setup can be restored after an accidental refresh", () => {
  const scenario = SCENARIOS.find(({ id }) => id === "king-of-the-hill");
  const snapshot = {
    scenarioId: scenario.id,
    items: generateItems(scenario),
    weaponMarkers: assignWeaponMarkers(scenario),
  };

  assert.equal(canRestoreSetup(snapshot, scenario), true);
});

test("Total Control restores only a valid saved objective outcome", () => {
  const scenario = SCENARIOS.find(({ id }) => id === "total-control");
  const snapshot = {
    scenarioId: scenario.id,
    items: generateItems(scenario),
    weaponMarkers: assignWeaponMarkers(scenario),
    objectiveOutcomeIndex: 2,
  };

  assert.equal(canRestoreSetup(snapshot, scenario), true);
  assert.equal(canRestoreSetup({ ...snapshot, objectiveOutcomeIndex: -1 }, scenario), false);
  assert.equal(canRestoreSetup({ ...snapshot, objectiveOutcomeIndex: 4 }, scenario), false);
  assert.equal(canRestoreSetup({ ...snapshot, objectiveOutcomeIndex: null }, scenario), false);
});

test("corrupt or outdated saved setups are rejected", () => {
  const scenario = SCENARIOS.find(({ id }) => id === "slayer");
  const snapshot = {
    scenarioId: scenario.id,
    items: generateItems(scenario),
    weaponMarkers: assignWeaponMarkers(scenario),
  };

  assert.equal(canRestoreSetup({ ...snapshot, scenarioId: "unknown" }, scenario), false);
  assert.equal(canRestoreSetup({ ...snapshot, items: [{ x: 0, y: 9 }] }, scenario), false);
  assert.equal(canRestoreSetup({
    ...snapshot,
    items: snapshot.items.map(() => snapshot.items[0]),
  }, scenario), false);
  assert.equal(canRestoreSetup({
    ...snapshot,
    weaponMarkers: snapshot.weaponMarkers.map((weapon) => ({ ...weapon, marker: "1–2" })),
  }, scenario), false);
});
