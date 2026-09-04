export const KEYWORDS = [
  {
    name: "Ablative Armour (n)",
    aliases: "ablative armor",
    summary: "After Energy Shields, spend 1 Ablative Armour point to cancel each hit. Resolve any hits left over normally.",
  },
  {
    name: "Acrobatic",
    summary: "In scenarios that award VP for kills, this model is worth +1 VP when killed. This stacks with other kill bonuses.",
  },
  {
    name: "Active Camouflage",
    aliases: "active camo",
    summary: "While the model’s original Energy Shields are fully charged, enemies only have Line of Sight from the same or an adjacent cube and make ranged attacks at −2 dice. Otherwise, the model is Stealthy.",
  },
  {
    name: "Agile",
    summary: "After making a long Shoot action with a Sniper Scope, this model may immediately Advance 1 cube for free.",
  },
  {
    name: "Blast",
    summary: "Before resolving the attack’s other effects, deplete 1 Energy Shield from every model in a cube adjacent to the target cube.",
  },
  {
    name: "Comms Relay",
    summary: "While this model is on the board, its Fireteam gains one free Special Order token each round for a friendly non-Legend. Unused tokens expire at round end.",
  },
  {
    name: "Concussive",
    summary: "When the attacker wins a Shoot or Assault test, the target is also Pinned. A cube-targeting ranged attack applies this to every model in that cube.",
  },
  {
    name: "Continuous Fire",
    summary: "Gain Weight of Fire (2). After each Shoot action, roll a 3-die Survive (2) test; failure causes 1 Wound that ignores Energy Shields and Armour.",
  },
  {
    name: "Counter Intelligence",
    summary: "After all enemy Scout moves are complete, every friendly model with Counter Intelligence may Advance 1 cube.",
  },
  {
    name: "EMP",
    summary: "Immediately deplete every Energy Shield on all models in the target’s cube, or in the targeted cube.",
  },
  {
    name: "Energy Shield (n)",
    aliases: "energy shields",
    summary: "Each shield cancels 1 hit before Armour. At the start of each round, regenerate 1 shield up to the listed maximum.",
  },
  {
    name: "Energy Shield Barrier (n)",
    aliases: "barrier",
    summary: "Models in the cube share these shields against ranged attacks. Deplete the barrier before their own shields; remove it at 0. It does not regenerate.",
  },
  {
    name: "Energy Shield Depleter (ESD)",
    aliases: "ESD",
    summary: "After the attack hits, immediately deplete the listed number of shields before resolving hits. Deplete an Energy Shield Barrier first, when present.",
  },
  {
    name: "Evade",
    summary: "If a ranged attack does not kill, Pin or force this unpinned model, it may immediately Advance 1 cube. A Reckless model must finish nearer the shooter.",
  },
  {
    name: "Explosive",
    summary: "Target a visible cube and make an unmodified 3-die Ranged (1) test. A success hits; a failure scatters and may leave the board. Then resolve the effect keyword.",
  },
  {
    name: "Fast Transition",
    summary: "Shoot once with each of two carried ranged weapons. Declare both targets first and resolve separately. Extra Shoot actions apply to one weapon, and this cannot be used for a long Shoot.",
  },
  {
    name: "Fearless",
    summary: "This model cannot be Pinned. Other attack effects still apply normally.",
  },
  {
    name: "Firing Platform (n)",
    summary: "Add the listed number of dice to this model’s Shoot tests.",
  },
  {
    name: "Frag (n)",
    summary: "After locating the explosive or grenade, roll the listed number of dice on 4+ against each model’s 3-die Survive test. An attacker win causes Wounds equal to the difference, then Pins and Scatters the model.",
  },
  {
    name: "Grenade",
    summary: "Target a cube in range. Roll an unmodified 3-die Ranged test needing 1 success with Line of Sight or 2 when lobbed using top view. A miss scatters; walls and board edges can return it to the original cube.",
  },
  {
    name: "Guarded",
    summary: "Ranged attacks against this model do not gain extra dice for a Headshot.",
  },
  {
    name: "High Value Target (HVT)",
    aliases: "HVT 65 points",
    summary: "A model costing 65 points or more is a High Value Target. In scenarios awarding VP for kills, it is worth +1 VP when killed; this stacks with other kill bonuses.",
  },
  {
    name: "Honour Guard",
    aliases: "honor guard",
    summary: "Gain +1 die to Survive tests while in the same or an adjacent cube as another friendly Honour Guard.",
  },
  {
    name: "Horde",
    summary: "In addition to the normal friendly-model Fight bonus, gain +1 Fight die for every other friendly Horde model in the same cube.",
  },
  {
    name: "Hulking",
    summary: "Uses 2 model spaces in a cube and cannot pick up Items or Weapons. It ignores face-down tokens but can interact with Scenario Objects.",
  },
  {
    name: "Implosion (n)",
    summary: "After locating the hit, roll the listed number of dice on 4+ against each model’s unmodified 3-die Survive test. Only an attacker win causes Wounds equal to the difference.",
  },
  {
    name: "Imposing",
    summary: "Gain +1 die to Fight or Survive tests during an Assault.",
  },
  {
    name: "Incendiary (n)",
    summary: "Target a visible cube in range and roll the listed attack dice against each model’s unmodified 3-die Survive test. Resolve Wounds normally; if the attack roll has a success, every model receives a Fire token.",
  },
  {
    name: "Jump Pack",
    summary: "May cross full-cube walls on the same level for 1 movement, cross gaps and change levels without climbing. The model must finish somewhere it can stand and takes no falling damage or Pin.",
  },
  {
    name: "Knockback",
    summary: "After winning the Shoot or Fight test, move the target 1 adjacent, same-level cube directly away from the attacker. If they share a cube, the attacker chooses the direction.",
  },
  {
    name: "Lethal (n)",
    summary: "If any Wounds pass the target’s defences, add the listed number of extra Wounds to the attack’s total. Multiple Lethal effects are cumulative.",
  },
  {
    name: "Life Support",
    summary: "When this model is wounded but not killed, fully heal it automatically, then discard this One-Use ability. It cannot return a killed model.",
  },
  {
    name: "Long",
    summary: "A normal Shoot action with this weapon is long. A Rapid Fire weapon’s Blaze Away action remains short.",
  },
  {
    name: "Lunge",
    summary: "Make a Shoot action using the model’s Fight stat. Only Clear Shot and High Ground modifiers apply.",
  },
  {
    name: "Medic",
    summary: "As a free Auxiliary action, heal 1 Wound from a friendly model in the same cube.",
  },
  {
    name: "One-Use",
    aliases: "one use",
    summary: "This rule or item may be used once, then is discarded or unavailable for the rest of the game.",
  },
  {
    name: "Optics",
    summary: "Gain +1 die on Shoot tests and score Headshots on 7 or 8. Optics has no effect on Blaze Away.",
  },
  {
    name: "Rapid Fire",
    summary: "Choose a normal Shoot or Blaze Away. Blaze Away is a 4-die Ranged test against a 3-die Survive test: it causes no damage, but an attacker win depletes 1 shield and Pins the target.",
  },
  {
    name: "Scout",
    summary: "After deployment and before Round 1, Advance 1 cube for free. The first-turn player scouts first. Do not enter an enemy cube; tokens may be collected and Crouch may be retained.",
  },
  {
    name: "Smash (n)",
    summary: "Add the listed number of dice to this model’s Fight tests.",
  },
  {
    name: "Sniper Scope",
    summary: "Choose either a normal short Shoot with no bonus, or a long Shoot with +2 dice that scores Headshots on 7 or 8.",
  },
  {
    name: "Spartan Killer",
    summary: "In scenarios that award VP for kills, gain +1 VP when this model kills an enemy Spartan. This stacks with other kill bonuses.",
  },
  {
    name: "Stable",
    summary: "Ignore the weapon’s Long keyword when this model Advances and then Shoots during the same activation.",
  },
  {
    name: "Stealthy",
    summary: "Enemy models roll −1 die when making a Shoot test against this model.",
  },
  {
    name: "Sticky",
    summary: "With 3 or more successes on the ranged test, deplete all Energy Shields from one model in the target cube, even if that model is outside Line of Sight.",
  },
  {
    name: "Stoic",
    summary: "This model cannot be Pinned and cannot Crouch. Other attack effects still apply normally.",
  },
  {
    name: "Support",
    summary: "Adds 1 friendly-model space to its cube. Shoot actions at range 5+ are long. The model is worth 0 VP when killed unless carrying a Pickup Weapon, and no more than half a Fireteam may have Support.",
  },
  {
    name: "Support Weapon",
    summary: "The carrier cannot Sprint or throw grenades, has maximum Speed 1 and rolls no Fight dice in an Assault. Picking it up ends the model’s movement.",
  },
  {
    name: "Suppression",
    summary: "Resolve the attack normally, then Pin every friendly and enemy model in the target cube.",
  },
  {
    name: "Tactician (n)",
    summary: "While this model is on the board, add the listed number of Command Dice, starting rerolls and unused rerolls that may be carried into the next round. Multiple Tactician values stack.",
  },
  {
    name: "Two Use",
    aliases: "two-use",
    summary: "This rule or item may be used twice, on separate actions, before it is discarded or unavailable.",
  },
  {
    name: "Unstoppable",
    summary: "When movement triggers an Assault, this model gains +3 Fight dice instead of the usual +2.",
  },
  {
    name: "Weight of Fire (n)",
    summary: "Reroll up to the listed number of dice in a Ranged test. Multiple Weight of Fire values are cumulative.",
  },
];

const itemIcon = (filename) => `https://haloflashpoint.manticgames.com/uploads/rules/items/${filename}`;

export const PICKUP_ITEMS = [
  {
    name: "Active Camouflage",
    type: "Type II",
    fallback: "AC",
    icon: itemIcon("active%20camo.png"),
    aliases: "active camo stealth",
    summary: "Gain Active Camouflage until this model next Sprints, Fights or Shoots. One-Use.",
  },
  {
    name: "Drop Wall",
    type: "Type II",
    fallback: "DW",
    icon: itemIcon("drop%20wall.png"),
    aliases: "barrier shield",
    summary: "Place an Energy Shield Barrier (2) in the holder’s cube. One-Use.",
  },
  {
    name: "Explosive Ammo",
    type: "Type III",
    fallback: "EA",
    icon: itemIcon("explosive%20ammo.png"),
    aliases: "ammunition lethal",
    summary: "Add +1 die and Lethal (1) to one ranged test. It cannot combine with Explosive, Grenade or Lunge. One-Use.",
  },
  {
    name: "Fragmentation Grenade",
    type: "Type III",
    fallback: "FG",
    icon: itemIcon("frag.png"),
    aliases: "frag grenade",
    summary: "Range 3, AP 1, with Frag (5) and Grenade. One-Use.",
  },
  {
    name: "Grappleshot",
    type: "Type II",
    fallback: "GS",
    icon: itemIcon("grapplshot.png"),
    aliases: "grapple shot item pickup weapon token",
    summary: "Either Advance 1 cube for free in addition to other movement, or pick up an Item or Weapon Token in an adjacent cube within Line of Sight. One-Use.",
  },
  {
    name: "Hardlight Shield",
    type: "Type I",
    fallback: "HS",
    icon: itemIcon("hardlight%20shield.png"),
    aliases: "armour armor",
    summary: "Gain +1 Armour. Return this item when its carrier next receives a Wound token.",
  },
  {
    name: "Health Pack",
    type: "Type I",
    fallback: "HP",
    icon: itemIcon("health%20pack.png"),
    aliases: "heal healing life support",
    summary: "Grants Life Support and returns when that rule triggers, or use an Auxiliary action to heal all current damage and discard it.",
  },
  {
    name: "Overshield",
    type: "Type II",
    fallback: "OS",
    icon: itemIcon("overshield.png"),
    aliases: "energy shield",
    summary: "Gain +1 Energy Shield. This shield is depleted before the model’s own shields. One-Use.",
  },
  {
    name: "Plasma Grenade",
    type: "Type III",
    fallback: "PG",
    icon: itemIcon("plasma%20grenade.png"),
    aliases: "sticky grenade lethal",
    summary: "Range 3, AP 2, with Frag (4), Grenade, Lethal (1) and Sticky. One-Use.",
  },
  {
    name: "Quantum Translocator",
    type: "Type II",
    fallback: "QT",
    icon: itemIcon("quantum%20translocator.png"),
    aliases: "teleport return movement",
    summary: "Before an Advance or Sprint, place its token. Before the activation ends, the model may return to it from within 2 cubes if the route is clear; entering an enemy cube triggers an Assault without the movement bonus. One-Use.",
  },
  {
    name: "Shroud Screen",
    type: "Type II",
    fallback: "SS",
    icon: itemIcon("shroud%20screen.png"),
    aliases: "line of sight LOS",
    summary: "Place it in the holder’s cube or an adjacent visible cube. It blocks Line of Sight into, out of and through that cube for the rest of the round, though the cube may still be targeted. One-Use.",
  },
  {
    name: "Threat Sensor",
    type: "Type II",
    fallback: "TS",
    icon: itemIcon("threat%20sensor.png"),
    aliases: "line of sight LOS reveal",
    summary: "Choose a cube. For the rest of the round, friendly models always have Line of Sight to it, adjacent cubes and models in those cubes. One-Use.",
  },
  {
    name: "Thruster",
    type: "Type II",
    fallback: "TH",
    icon: itemIcon("thruster.png"),
    aliases: "speed advance sprint movement",
    summary: "Declare before moving to gain +1 Speed for one normal Advance or Sprint. One-Use.",
  },
  {
    name: "Intel",
    type: "Type I",
    fallback: "IN",
    icon: "https://haloflashpoint.manticgames.com/uploads/builder/items/intel.webp",
    aliases: "victory point VP",
    summary: "When revealed, the revealing team immediately gains 1 VP. One-Use.",
  },
  {
    name: "Repair Field",
    type: "Type II",
    fallback: "RF",
    icon: "",
    aliases: "heal healing wounds",
    summary: "Place it permanently in the holder’s cube. At the end of each round, every model in that cube heals 1 Wound.",
  },
];

function normalise(value) {
  return value
    .toLocaleLowerCase("en-GB")
    .normalize("NFKD")
    .replace(/[–—−]/g, "-")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function matchesReference(entry, query) {
  const terms = normalise(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return true;

  const searchable = normalise([
    entry.name,
    entry.type,
    entry.aliases,
    entry.summary,
  ].filter(Boolean).join(" "));

  return terms.every((term) => searchable.includes(term));
}
