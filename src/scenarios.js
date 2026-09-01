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
    victory: "First to the agreed kill limit: 4 / 8 / 12 for a short / medium / long game.",
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
    victory: "First to 3 captures, or most captures after Round 8.",
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
    victory: "First to 11 points, or most points after Round 6.",
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
    victory: "Reach twice the total VP value in play, or hold the highest score after Round 6.",
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
    victory: "First to bank 5 Power Seeds, or most banked after Round 8.",
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
    victory: "Each hill is worth 4 VP. First to 18 VP, or most after Round 8.",
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
      hills: ["B", "C", "D", "E"],
      rolls: ["1–2", "3–4", "5–6", "7–8"],
    },
    zones: [
      { label: "A", cells: cells([4, 4], [5, 4], [4, 5], [5, 5]), anchor: { x: 4, y: 5 } },
      { label: "B", cells: cells([7, 7], [8, 7], [7, 8], [8, 8]), anchor: { x: 7, y: 8 } },
      { label: "C", cells: cells([1, 7], [2, 7], [1, 8], [2, 8]), anchor: { x: 1, y: 8 } },
      { label: "D", cells: cells([7, 1], [8, 1], [7, 2], [8, 2]), anchor: { x: 7, y: 2 } },
      { label: "E", cells: cells([1, 1], [2, 1], [1, 2], [2, 2]), anchor: { x: 1, y: 2 } },
    ],
  },
  {
    id: "total-control",
    name: "Total Control",
    note: "Capture all three active Control Zones at the same time.",
    victory: "First to 3 points, or most points after Round 8.",
    deployment: {
      blue: [...row(1, 1, 2), ...row(1, 7, 8)],
      red: [...row(8, 1, 2), ...row(8, 7, 8)],
    },
    weapons: cells([4, 6], [7, 5], [2, 4], [5, 3]),
    respawns: {
      blue: cells([1, 5], [8, 5], [5, 1]),
      red: cells([4, 8], [1, 4], [8, 4]),
    },
    objectives: [],
    objectiveSetup: {
      heading: "Control Zone Setup",
      rollLabel: "D8",
      note: "One D8 roll sets all three positions. After a team scores, re-roll and reset every zone to Neutral.",
      outcomes: [
        {
          roll: "1–2",
          objectives: [
            objective(1, 7, "A", "control-neutral"),
            objective(5, 5, "B", "control-neutral"),
            objective(6, 2, "C", "control-neutral"),
          ],
        },
        {
          roll: "3–4",
          objectives: [
            objective(3, 7, "A", "control-neutral"),
            objective(4, 4, "B", "control-neutral"),
            objective(8, 2, "C", "control-neutral"),
          ],
        },
        {
          roll: "5–6",
          objectives: [
            objective(6, 7, "A", "control-neutral"),
            objective(6, 4, "B", "control-neutral"),
            objective(1, 2, "C", "control-neutral"),
          ],
        },
        {
          roll: "7–8",
          objectives: [
            objective(8, 7, "A", "control-neutral"),
            objective(3, 5, "B", "control-neutral"),
            objective(3, 2, "C", "control-neutral"),
          ],
        },
      ],
    },
    zones: [],
  },
  {
    id: "attrition",
    name: "Attrition",
    note: "Use limited respawns and eliminate every enemy model.",
    victory: "Be the only player with live models remaining.",
    deployment: {
      blue: cells([7, 8], [8, 8], [8, 7], [1, 2], [1, 1], [2, 1]),
      red: cells([1, 8], [2, 8], [1, 7], [8, 2], [7, 1], [8, 1]),
    },
    weapons: cells([3, 6], [6, 6], [3, 3], [6, 3]),
    respawns: {
      blue: cells([5, 8], [4, 1]),
      red: cells([1, 5], [8, 4]),
    },
    objectives: [],
    zones: [],
  },
  {
    id: "vip",
    name: "VIP",
    note: "Randomly nominate one VIP per team and protect them.",
    victory: "Score 1 point per enemy VIP killed; first to 4, or most after Round 8.",
    deployment: {
      blue: [...row(8, 3, 6), ...row(7, 4, 5)],
      red: [...row(1, 3, 6), ...row(2, 4, 5)],
    },
    weapons: cells([2, 5], [5, 5], [4, 4], [7, 4]),
    respawns: {
      blue: cells([5, 8], [1, 3], [8, 2]),
      red: cells([1, 7], [8, 6], [4, 1]),
    },
    objectives: [],
    zones: [],
  },
  {
    id: "assault",
    name: "Assault",
    note: "Carry your Bomb into the enemy deployment zone and arm it.",
    victory: "A Bomb in enemy deployment earns 1 Arm point after each enemy activation; first to 3 wins.",
    deployment: {
      blue: [...row(8, 3, 6), ...row(7, 3, 6)],
      red: [...row(1, 3, 6), ...row(2, 3, 6)],
    },
    weapons: cells([2, 5], [5, 5], [4, 4], [7, 4]),
    weaponMode: "tokens",
    respawns: {
      blue: cells([1, 7], [8, 6], [1, 5]),
      red: cells([8, 4], [1, 3], [8, 2]),
    },
    objectives: [
      objective(4, 6, "B", "bomb-blue"),
      objective(5, 3, "B", "bomb-red"),
    ],
    zones: [],
  },
];

export const SCENARIO_BY_ID = new Map(SCENARIOS.map((scenario) => [scenario.id, scenario]));
