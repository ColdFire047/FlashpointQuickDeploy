import { SCENARIOS, SCENARIO_BY_ID, WEAPON_MARKERS } from "./scenarios.js";
import {
  assignWeaponMarkers,
  canRestoreSetup,
  coordinateKey,
  countCoordinates,
  generateItems,
  keepLegalItems,
  pickScenario,
} from "./setup.js";

const SESSION_KEY = "flashpoint-quick-setup";

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
  updateStatus: document.querySelector("#update-status"),
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

function respawnEdgeClass(x, y) {
  if (y === 8) return "edge-top";
  if (y === 1) return "edge-bottom";
  if (x === 1) return "edge-left";
  if (x === 8) return "edge-right";
  return "edge-centre";
}

function objectiveDescription(type) {
  const descriptions = {
    "flag-blue": "blue flag",
    "flag-red": "red flag",
    oddball: "Oddball",
    seed: "Power Seed",
    "station-blue": "blue Power Seed station",
    "station-red": "red Power Seed station",
  };
  return descriptions[type] ?? "objective";
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
      const cellDetails = [];
      cell.className = "cell";
      cell.setAttribute("role", "gridcell");

      if (hasCoordinate(scenario.deployment.blue, x, y)) {
        cell.classList.add("deployment-blue");
        cellDetails.push("blue deployment");
      }
      if (hasCoordinate(scenario.deployment.red, x, y)) {
        cell.classList.add("deployment-red");
        cellDetails.push("red deployment");
      }
      if (zoneByCoordinate.has(key)) {
        cell.classList.add("zone-cell");
        cellDetails.push(`Hill ${zoneByCoordinate.get(key)}`);
      }
      if (hasCoordinate(scenario.weapons, x, y)) {
        cell.classList.add("weapon-spawn");
        cellDetails.push("weapon spawn");
      }

      for (const team of ["blue", "red"]) {
        if (hasCoordinate(scenario.respawns[team], x, y)) {
          const respawn = document.createElement("span");
          respawn.className = `respawn-edge ${team} ${respawnEdgeClass(x, y)}`;
          if (hasCoordinate(scenario.deployment[team], x, y)) respawn.classList.add("on-team-deployment");
          respawn.setAttribute("aria-hidden", "true");
          cellDetails.push(`${team} respawn`);
          cell.append(respawn);
        }
      }

      const markers = document.createElement("div");
      markers.className = "cell-markers";

      const objective = objectiveByCoordinate.get(key);
      if (objective) {
        const objectiveClass = objective.type.startsWith("station")
          ? `marker-station ${objective.type}`
          : `marker-objective ${objective.type}`;
        markers.append(marker(objective.label, objectiveClass, objective.type));
        cellDetails.push(objectiveDescription(objective.type));
      }

      const zoneLabel = zoneAnchorByCoordinate.get(key);
      if (zoneLabel) markers.append(marker(zoneLabel, "marker-zone", `Hill ${zoneLabel}`));

      const itemCount = itemCounts.get(key);
      if (itemCount) {
        const itemDescription = `${itemCount} item${itemCount > 1 ? "s" : ""}`;
        markers.append(marker(itemCount > 1 ? `×${itemCount}` : "×", "marker-item", itemDescription));
        cellDetails.push(itemDescription);
      }

      cell.append(markers);
      cell.setAttribute("aria-label", [`Cube ${key}`, ...cellDetails].join("; "));
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
    const coordinate = document.createElement("span");
    coordinate.className = "coordinate";
    coordinate.textContent = `${x},${y}`;
    coordinateCell.append(coordinate);
    markerFragment.append(markerCell);
    weaponFragment.append(coordinateCell);
  });

  elements.weaponMarkerRanges.replaceChildren(markerFragment);
  elements.weaponCoordinates.replaceChildren(weaponFragment);
}

function announce(message) {
  if (!message) return;
  elements.updateStatus.textContent = "";
  requestAnimationFrame(() => {
    elements.updateStatus.textContent = message;
  });
}

function render(statusMessage = "") {
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

  saveSession();
  announce(statusMessage);
}

function saveSession() {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      scenarioId: state.scenario.id,
      items: state.items,
      weaponMarkers: state.weaponMarkers,
    }));
  } catch {
    // Storage can be disabled without affecting the generator itself.
  }
}

function restoreSession() {
  try {
    const snapshot = JSON.parse(sessionStorage.getItem(SESSION_KEY));
    const scenario = SCENARIO_BY_ID.get(snapshot?.scenarioId);

    if (!canRestoreSetup(snapshot, scenario)) {
      sessionStorage.removeItem(SESSION_KEY);
      return;
    }

    state.scenario = scenario;
    state.items = snapshot.items.map((item) => ({ ...item }));
    state.weaponMarkers = snapshot.weaponMarkers.map((weapon) => ({ ...weapon }));
    render(`${scenario.name} setup restored.`);
  } catch {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // Storage can be disabled without affecting the generator itself.
    }
  }
}

function startScenario(scenario, { keepItems = false } = {}) {
  state.scenario = scenario;
  state.items = keepItems && state.items.length
    ? keepLegalItems(state.items, scenario)
    : generateItems(scenario);
  state.weaponMarkers = assignWeaponMarkers(scenario);
  render(`${scenario.name} setup generated.`);
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
  render("Item locations rerolled.");
});
elements.rerollWeapons.addEventListener("click", () => {
  state.weaponMarkers = assignWeaponMarkers(state.scenario);
  render("Weapon marker assignments reshuffled.");
});

buildModeButtons();
restoreSession();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js"));
}
