const cells = (...coordinates) => coordinates.map(([x, y]) => ({ x, y }));
const row = (y, from, to) => Array.from({ length: to - from + 1 }, (_, index) => ({ x: from + index, y }));
const column = (x, from, to) => Array.from({ length: to - from + 1 }, (_, index) => ({ x, y: from + index }));
const objective = (x, y, label, type = "objective") => ({ x, y, label, type });

export const WEAPON_MARKERS = ["1–2", "3–4", "5–6", "7–8"];

export const SCENARIOS = [
  {
    id: "slayer",
    name: "Slayer",
    note: "Slay the enemy team.",
    deployment: {
      blue: row(8, 1, 4),
      red: row(1, 5, 8),
    },
    weapons: cells([2, 5], [3, 3], [6, 6], [7, 4]),
    respawns: {
      blue: cells([1, 7], [4, 1], [8, 6]),
      red: cells([1, 3], [5, 8], [8, 2]),
    },
    objectives: [],
    zones: [],
  },
  {
    id: "capture-the-flag",
    name: "Capture the Flag",
    note: "Capture the enemy flag and return it to your side.",
    deployment: {
      blue: row(8, 1, 8),
      red: row(1, 1, 8),
    },
    weapons: cells([3, 4], [3, 6], [6, 3], [6, 5]),
    respawns: {
      blue: cells([1, 6], [8, 7]),
      red: cells([1, 2], [8, 3]),
    },
    objectives: [
      objective(4, 7, "⚑", "flag-blue"),
      objective(5, 2, "⚑", "flag-red"),
    ],
    zones: [],
  },
  {
    id: "oddball",
    name: "Oddball",
    note: "Find the skull and maintain possession for as long as possible.",
    deployment: {
      blue: cells([1, 8], [2, 8], [3, 8], [1, 7], [2, 7], [1, 6]),
      red: cells([6, 1], [7, 1], [8, 1], [7, 2], [8, 2], [8, 3]),
    },
    weapons: cells([3, 3], [3, 5], [5, 3], [6, 6]),
    respawns: {
      blue: cells([1, 5], [4, 8]),
      red: cells([5, 1], [8, 4]),
    },
    objectives: [objective(5, 5, "☠", "oddball")],
    zones: [],
  },
  {
    id: "strongholds",
    name: "Strongholds",
    note: "Control the three static objectives to score.",
    deployment: {
      red: [...row(1, 1, 4), ...column(1, 2, 4)],
      blue: [...row(8, 5, 8), ...column(8, 5, 7)],
    },
    weapons: cells([2, 6], [3, 7], [5, 3], [6, 4]),
    respawns: {
      blue: cells([6, 8], [8, 7]),
      red: cells([1, 3], [3, 1]),
    },
    objectives: [
      objective(1, 8, "O"),
      objective(4, 5, "O"),
      objective(7, 2, "O"),
    ],
    zones: [],
  },
  {
    id: "stockpile",
    name: "Stockpile",
    note: "Collect Power Seeds and deposit them at your team’s station.",
    deployment: {
      red: [...row(8, 1, 4), ...column(1, 5, 7)],
      blue: [...row(1, 5, 8), ...column(8, 2, 4)],
    },
    weapons: cells([5, 6], [3, 5], [6, 4], [4, 3]),
    respawns: {
      red: cells([5, 8], [1, 7]),
      blue: cells([8, 2], [4, 1]),
    },
    objectives: [
      ...Array.from({ length: 8 }, (_, index) => objective(index + 1, index + 1, "S", "seed")),
      objective(1, 4, "PS", "station-red"),
      objective(8, 5, "PS", "station-blue"),
    ],
    zones: [],
  },
  {
    id: "king-of-the-hill",
    name: "King of the Hill",
    note: "Capture the active 2×2 hill.",
    deployment: {
      blue: row(8, 3, 6),
      red: row(1, 3, 6),
    },
    weapons: cells([3, 6], [6, 6], [3, 3], [6, 3]),
    respawns: {
      blue: cells([6, 8], [1, 6], [8, 3], [3, 1]),
      red: cells([3, 8], [8, 6], [1, 3], [6, 1]),
    },
    objectives: [],
    hillRotation: {
      initial: "A",
      rolls: ["1–2", "3–4", "5–6", "7–8"],
      nextByCurrent: {
        A: ["B", "C", "D", "E"],
        B: ["A", "C", "D", "E"],
        C: ["A", "B", "D", "E"],
        D: ["A", "B", "C", "E"],
        E: ["A", "B", "C", "D"],
      },
    },
    zones: [
      { label: "A", cells: cells([4, 4], [5, 4], [4, 5], [5, 5]), anchor: { x: 4, y: 5 } },
      { label: "B", cells: cells([7, 7], [8, 7], [7, 8], [8, 8]), anchor: { x: 7, y: 8 } },
      { label: "C", cells: cells([1, 7], [2, 7], [1, 8], [2, 8]), anchor: { x: 1, y: 8 } },
      { label: "D", cells: cells([7, 1], [8, 1], [7, 2], [8, 2]), anchor: { x: 7, y: 2 } },
      { label: "E", cells: cells([1, 1], [2, 1], [1, 2], [2, 2]), anchor: { x: 1, y: 2 } },
    ],
  },
];

export const SCENARIO_BY_ID = new Map(SCENARIOS.map((scenario) => [scenario.id, scenario]));
