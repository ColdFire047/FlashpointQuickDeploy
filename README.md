# Flashpoint Quick Setup

A fast, mobile-friendly setup helper for core and selected standard-board games of Halo: Flashpoint. It chooses a scenario, generates the eight starting Item locations, shuffles the four numbered Weapon Drop markers and displays the complete setup on one board.

## Included scenarios

- Slayer
- Capture the Flag
- Oddball
- Strongholds
- Stockpile
- King of the Hill

Big Team Battle scenarios are intentionally excluded because they use a different 16×8 battlefield and setup rules. Additional Organised Play and Husky variants are not yet included; their layouts should be verified against the current official scenario packet before they are added.

## Rules handled by the generator

- Eight starting Items are generated independently.
- Both dice are effectively rerolled when an Item would land in either deployment zone.
- Multiple Items can occupy the same cube.
- The four Weapon Drop marker ranges are shuffled across the scenario's fixed weapon locations.
- Changing only the scenario keeps legal Item coordinates and rerolls any that become illegal in the new deployment zones.

## Development

No build tools or dependencies are required. Serve the repository with any static web server. To run the logic tests:

```sh
npm test
```

Scenario layouts live in `src/scenarios.js`; setup logic lives in `src/setup.js`; rendering and interaction live in `src/app.js`.

The local app shell is cached for offline use. The decorative Halo logo and circuit-board background are loaded from their existing external sources, so the generator remains functional offline but those two images may be absent.

## Sources

Core scenario layouts and Stockpile are based on the Halo: Flashpoint rulebook. King of the Hill uses the standard-board Organised Play scenario layout. Always use the latest official rules or scenario booklet for gameplay wording and victory conditions.
