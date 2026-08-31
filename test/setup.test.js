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
    ];

    assert.equal(scenario.weapons.length, 4, `${scenario.name} should have four weapon drops`);
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
