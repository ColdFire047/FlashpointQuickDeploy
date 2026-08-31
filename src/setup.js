import { SCENARIOS, WEAPON_MARKERS } from "./scenarios.js";

export const coordinateKey = ({ x, y }) => `${x},${y}`;

export function isBoardCoordinate(coordinate) {
  return Boolean(
    coordinate
    && Number.isInteger(coordinate.x)
    && Number.isInteger(coordinate.y)
    && coordinate.x >= 1
    && coordinate.x <= 8
    && coordinate.y >= 1
    && coordinate.y <= 8,
  );
}

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

export function legalItemCoordinates(scenario) {
  const blocked = deploymentKeys(scenario);
  const coordinates = [];

  for (let y = 1; y <= 8; y += 1) {
    for (let x = 1; x <= 8; x += 1) {
      const coordinate = { x, y };
      if (!blocked.has(coordinateKey(coordinate))) coordinates.push(coordinate);
    }
  }

  return coordinates;
}

export function generateItems(scenario, count = 8, random = Math.random) {
  const legalCoordinates = legalItemCoordinates(scenario);
  if (count > legalCoordinates.length) throw new RangeError("Not enough legal cubes for unique items");
  return shuffle(legalCoordinates, random).slice(0, count);
}

export function keepLegalItems(items, scenario, random = Math.random) {
  const blocked = deploymentKeys(scenario);
  const used = new Set();
  const retained = items.map((item) => {
    if (!isBoardCoordinate(item)) return null;
    const key = coordinateKey(item);
    if (blocked.has(key) || used.has(key)) return null;
    used.add(key);
    return { ...item };
  });
  const replacements = shuffle(
    legalItemCoordinates(scenario).filter((item) => !used.has(coordinateKey(item))),
    random,
  );
  let replacementIndex = 0;

  return retained.map((item) => item ?? replacements[replacementIndex++]);
}

export function assignWeaponMarkers(scenario, random = Math.random) {
  const markers = shuffle(WEAPON_MARKERS, random);
  return scenario.weapons.map((coordinate, index) => ({
    ...coordinate,
    marker: markers[index],
  }));
}

export function pickObjectiveOutcome(scenario, random = Math.random) {
  const outcomes = scenario.objectiveSetup?.outcomes;
  if (!outcomes?.length) return null;
  return Math.floor(random() * outcomes.length);
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

export function canRestoreSetup(snapshot, scenario) {
  if (!snapshot || snapshot.scenarioId !== scenario?.id) return false;
  if (!Array.isArray(snapshot.items) || snapshot.items.length !== 8) return false;
  if (!Array.isArray(snapshot.weaponMarkers) || snapshot.weaponMarkers.length !== WEAPON_MARKERS.length) return false;

  const blocked = deploymentKeys(scenario);
  const weaponLocations = new Set(scenario.weapons.map(coordinateKey));
  const savedWeaponLocations = new Set(snapshot.weaponMarkers.filter(isBoardCoordinate).map(coordinateKey));
  const savedMarkerRanges = new Set(snapshot.weaponMarkers.map(({ marker }) => marker));
  const objectiveOutcomeIsValid = scenario.objectiveSetup
    ? Number.isInteger(snapshot.objectiveOutcomeIndex)
      && snapshot.objectiveOutcomeIndex >= 0
      && snapshot.objectiveOutcomeIndex < scenario.objectiveSetup.outcomes.length
    : snapshot.objectiveOutcomeIndex == null;

  const itemsAreValid = snapshot.items.every((item) => (
    isBoardCoordinate(item) && !blocked.has(coordinateKey(item))
  ));
  const savedItemLocations = new Set(snapshot.items.filter(isBoardCoordinate).map(coordinateKey));
  const weaponsAreValid = snapshot.weaponMarkers.every((weapon) => (
    isBoardCoordinate(weapon)
    && weaponLocations.has(coordinateKey(weapon))
    && WEAPON_MARKERS.includes(weapon.marker)
  ));

  return itemsAreValid
    && savedItemLocations.size === snapshot.items.length
    && weaponsAreValid
    && savedWeaponLocations.size === scenario.weapons.length
    && savedMarkerRanges.size === WEAPON_MARKERS.length
    && objectiveOutcomeIsValid;
}
