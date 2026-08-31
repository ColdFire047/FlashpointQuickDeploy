import { SCENARIOS, WEAPON_MARKERS } from "./scenarios.js";

export const coordinateKey = ({ x, y }) => `${x},${y}`;

export function shuffle(values, random = Math.random) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function deploymentKeys(scenario) {
  return new Set([
    ...scenario.deployment.blue,
    ...scenario.deployment.red,
  ].map(coordinateKey));
}

export function randomLegalItem(scenario, random = Math.random) {
  const blocked = deploymentKeys(scenario);
  let coordinate;

  do {
    coordinate = {
      x: Math.floor(random() * 8) + 1,
      y: Math.floor(random() * 8) + 1,
    };
  } while (blocked.has(coordinateKey(coordinate)));

  return coordinate;
}

export function generateItems(scenario, count = 8, random = Math.random) {
  return Array.from({ length: count }, () => randomLegalItem(scenario, random));
}

export function keepLegalItems(items, scenario, random = Math.random) {
  const blocked = deploymentKeys(scenario);
  return items.map((item) => (
    blocked.has(coordinateKey(item)) ? randomLegalItem(scenario, random) : { ...item }
  ));
}

export function assignWeaponMarkers(scenario, random = Math.random) {
  const markers = shuffle(WEAPON_MARKERS, random);
  return scenario.weapons.map((coordinate, index) => ({
    ...coordinate,
    marker: markers[index],
  }));
}

export function pickScenario(currentId = null, random = Math.random) {
  const choices = SCENARIOS.filter((scenario) => scenario.id !== currentId);
  return choices[Math.floor(random() * choices.length)];
}

export function countCoordinates(coordinates) {
  const counts = new Map();
  for (const coordinate of coordinates) {
    const key = coordinateKey(coordinate);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}
