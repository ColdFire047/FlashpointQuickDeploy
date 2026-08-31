import test from "node:test";
import assert from "node:assert/strict";

import { SCENARIOS, WEAPON_MARKERS } from "../src/scenarios.js";
import {
  assignWeaponMarkers,
  coordinateKey,
  deploymentKeys,
  generateItems,
  keepLegalItems,
} from "../src/setup.js";

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

test("item generation never places an item in a deployment zone", () => {
  for (const scenario of SCENARIOS) {
    const blocked = deploymentKeys(scenario);
    const items = generateItems(scenario, 500);
    items.forEach((item) => assert.equal(blocked.has(coordinateKey(item)), false));
  }
});

test("item generation permits multiple items in one cube", () => {
  const slayer = SCENARIOS.find(({ id }) => id === "slayer");
  const items = generateItems(slayer, 8, () => 0);
  assert.deepEqual(items, Array.from({ length: 8 }, () => ({ x: 1, y: 1 })));
});

test("changing scenario keeps legal items and replaces illegal ones", () => {
  const captureTheFlag = SCENARIOS.find(({ id }) => id === "capture-the-flag");
  const items = [{ x: 1, y: 8 }, { x: 4, y: 4 }];
  const result = keepLegalItems(items, captureTheFlag, () => 0.5);
  assert.notDeepEqual(result[0], items[0]);
  assert.deepEqual(result[1], items[1]);
  assert.equal(deploymentKeys(captureTheFlag).has(coordinateKey(result[0])), false);
});

test("weapon marker assignment uses every marker exactly once", () => {
  for (const scenario of SCENARIOS) {
    const assignments = assignWeaponMarkers(scenario);
    assert.deepEqual(assignments.map(({ marker }) => marker).sort(), [...WEAPON_MARKERS].sort());
  }
});
