import { SCENARIOS, SCENARIO_BY_ID, WEAPON_MARKERS } from "./scenarios.js";
import {
  assignWeaponMarkers,
  coordinateKey,
  countCoordinates,
  generateItems,
  keepLegalItems,
  pickScenario,
} from "./setup.js";

const state = {
  scenario: null,
  items: [],
  weaponMarkers: [],
};

const elements = {
  welcome: document.querySelector("#welcome"),
  setup: document.querySelector("#setup"),
  scenarioName: document.querySelector("#scenario-name"),
  scenarioNote: document.querySelector("#scenario-note"),
  board: document.querySelector("#board"),
  itemCoordinates: document.querySelector("#item-coordinates"),
  weaponMarkerRanges: document.querySelector("#weapon-marker-ranges"),
  weaponCoordinates: document.querySelector("#weapon-coordinates"),
  modeButtons: document.querySelector("#mode-buttons"),
  randomiseAll: document.querySelector("#randomise-all"),
  rerollScenario: document.querySelector("#reroll-scenario"),
  rerollItems: document.querySelector("#reroll-items"),
  rerollWeapons: document.querySelector("#reroll-weapons"),
};

function hasCoordinate(coordinates, x, y) {
  return coordinates.some((coordinate) => coordinate.x === x && coordinate.y === y);
}

function marker(label, className, title) {
  const element = document.createElement("span");
  element.className = `marker ${className}`;
  element.textContent = label;
  if (title) element.title = title;
  return element;
}

function renderBoard() {
  const { scenario, items } = state;
  const itemCounts = countCoordinates(items);
  const objectiveByCoordinate = new Map(scenario.objectives.map((entry) => [coordinateKey(entry), entry]));
  const zoneByCoordinate = new Map();
  const zoneAnchorByCoordinate = new Map();

  for (const zone of scenario.zones) {
    zone.cells.forEach((coordinate) => zoneByCoordinate.set(coordinateKey(coordinate), zone.label));
    zoneAnchorByCoordinate.set(coordinateKey(zone.anchor), zone.label);
  }

  const fragment = document.createDocumentFragment();

  for (let y = 8; y >= 1; y -= 1) {
    const yLabel = document.createElement("div");
    yLabel.className = "axis-label";
    yLabel.textContent = y;
    fragment.append(yLabel);

    for (let x = 1; x <= 8; x += 1) {
      const key = `${x},${y}`;
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-label", `Cube ${key}`);

      if (hasCoordinate(scenario.deployment.blue, x, y)) cell.classList.add("deployment-blue");
      if (hasCoordinate(scenario.deployment.red, x, y)) cell.classList.add("deployment-red");
      if (zoneByCoordinate.has(key)) cell.classList.add("zone-cell");

      const markers = document.createElement("div");
      markers.className = "cell-markers";

      const objective = objectiveByCoordinate.get(key);
      if (objective) {
        const objectiveClass = objective.type.startsWith("station") ? "marker-station" : `marker-objective ${objective.type}`;
        markers.append(marker(objective.label, objectiveClass, objective.type));
      }

      const zoneLabel = zoneAnchorByCoordinate.get(key);
      if (zoneLabel) markers.append(marker(zoneLabel, "marker-zone", `Hill ${zoneLabel}`));

      const itemCount = itemCounts.get(key);
      if (itemCount) markers.append(marker(itemCount > 1 ? `×${itemCount}` : "×", "marker-item", `${itemCount} item${itemCount > 1 ? "s" : ""}`));

      for (const team of ["blue", "red"]) {
        if (hasCoordinate(scenario.respawns[team], x, y)) {
          markers.append(marker("◆", `marker-respawn ${team}`, `${team} respawn`));
        }
      }

      cell.append(markers);
      fragment.append(cell);
    }
  }

  fragment.append(document.createElement("div"));
  for (let x = 1; x <= 8; x += 1) {
    const xLabel = document.createElement("div");
    xLabel.className = "axis-label";
    xLabel.textContent = x;
    fragment.append(xLabel);
  }

  elements.board.replaceChildren(fragment);
}

function renderCoordinates() {
  const itemFragment = document.createDocumentFragment();
  state.items.forEach(({ x, y }) => {
    const coordinate = document.createElement("span");
    coordinate.className = "coordinate";
    coordinate.textContent = `${x},${y}`;
    itemFragment.append(coordinate);
  });
  elements.itemCoordinates.replaceChildren(itemFragment);

  const markerFragment = document.createDocumentFragment();
  const weaponFragment = document.createDocumentFragment();
  const weaponsByMarker = new Map(state.weaponMarkers.map((weapon) => [weapon.marker, weapon]));

  WEAPON_MARKERS.forEach((markerRange) => {
    const { x, y } = weaponsByMarker.get(markerRange);
    const markerCell = document.createElement("th");
    const coordinateCell = document.createElement("td");

    markerCell.scope = "col";
    markerCell.textContent = markerRange;
    coordinateCell.textContent = `${x},${y}`;
    markerFragment.append(markerCell);
    weaponFragment.append(coordinateCell);
  });

  elements.weaponMarkerRanges.replaceChildren(markerFragment);
  elements.weaponCoordinates.replaceChildren(weaponFragment);
}

function render() {
  if (!state.scenario) return;
  elements.welcome.hidden = true;
  elements.setup.hidden = false;
  elements.scenarioName.textContent = state.scenario.name;
  elements.scenarioNote.textContent = state.scenario.note;
  renderBoard();
  renderCoordinates();

  elements.modeButtons.querySelectorAll("button").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.scenario === state.scenario.id));
  });
}

function startScenario(scenario, { keepItems = false } = {}) {
  state.scenario = scenario;
  state.items = keepItems && state.items.length
    ? keepLegalItems(state.items, scenario)
    : generateItems(scenario);
  state.weaponMarkers = assignWeaponMarkers(scenario);
  render();
}

function buildModeButtons() {
  const fragment = document.createDocumentFragment();
  SCENARIOS.forEach((scenario) => {
    const button = document.createElement("button");
    button.className = "button button-primary";
    button.type = "button";
    button.dataset.scenario = scenario.id;
    button.setAttribute("aria-pressed", "false");
    button.textContent = scenario.name;
    button.addEventListener("click", () => startScenario(SCENARIO_BY_ID.get(scenario.id)));
    fragment.append(button);
  });
  elements.modeButtons.append(fragment);
}

elements.randomiseAll.addEventListener("click", () => startScenario(pickScenario()));
elements.rerollScenario.addEventListener("click", () => startScenario(pickScenario(state.scenario.id), { keepItems: true }));
elements.rerollItems.addEventListener("click", () => {
  state.items = generateItems(state.scenario);
  render();
});
elements.rerollWeapons.addEventListener("click", () => {
  state.weaponMarkers = assignWeaponMarkers(state.scenario);
  render();
});

buildModeButtons();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js"));
}
