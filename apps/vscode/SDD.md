# Visual Studio Code UI Learning SDD

## Architecture

- Shared library: $SharedLibraryRoot
- App model: models\surface_map.yml
- Observations: observations
- Action contracts: ctions
- WAIBA phases: first impression, dynamics observation, action readiness

## Dynamic UI Model

Classify UI regions as static chrome, dynamic panels, workspace surfaces, transient UI, or unknown. Re-observe after every meaningful state change.