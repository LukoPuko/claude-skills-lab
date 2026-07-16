# 🚗 Yugo Simulator

An endless side-scrolling survival-drive built with the Higgsfield game pipeline. Keep a
legendary, falling-apart Zastava Yugo alive down an endless Balkan road: dodge potholes,
manage an engine that overheats and rattles, grab cash and spare wrenches, and see how far
you can limp before the old girl finally gives out.

**Play now:** the self-contained build in [`dist/yugo-simulator.html`](dist/yugo-simulator.html)
runs in any browser — just open it. (Published as a Claude Artifact for instant play.)

## Gameplay

- **Accelerate** for distance and cash — but the engine runs hotter the faster you go.
- **Hop** to clear potholes, rocks and the occasional roadside cow.
- **Brake** to cool the engine down.
- Grab **cash** (score) and **wrenches** (repair the body + dump engine heat).
- Two ways to die: the **engine seizes** (heat hits 100) or the **body falls apart**
  (integrity hits 0). Difficulty ramps with distance.

## Controls

| Action | Keyboard | Touch | Gamepad |
|---|---|---|---|
| Accelerate | ↑ / W | tap-hold upper screen | RT / D-pad up / left stick up |
| Brake | ↓ / S | tap-hold lower-left | LT / D-pad down / left stick down |
| Hop | Space | on-screen HOP button | A |
| Start / Restart | Space / Enter / R | tap | A / Start |
| Mute · Pause | M · P | — | — |

Add `?dev=1` to the URL for the FPS / entity-count overlay.

## Assets

Art direction and the four hero images (background, hero-car sprite, marketplace thumbnail,
app icon) were generated with **Higgsfield** (`nano_banana` family), all sharing one locked
style formula (see `design/plan.md`). Everything on the gameplay canvas — the car, road,
potholes, cow, cash, wrenches, particles, dashboard gauges — is drawn procedurally in the
same flat-vector Balkan-retro style, so the game is coherent and dependency-free. The
generated Balkan skyline loads as a backdrop in any open-internet browser and falls back to
procedural mountains otherwise. Engine hum and SFX are synthesized live with the Web Audio API.

## Layout

```
yugo-sim/
├── public/            # source served as-is (no build step)
│   ├── index.html     # the whole game (canvas engine)
│   ├── logic.js       # required platform stub (solo game)
│   └── strings.js     # all player-visible text (externalized)
├── dist/
│   ├── yugo-simulator.html      # self-contained single-file build (Artifact / open-anywhere)
│   └── yugo-simulator-game.zip  # packaged for the Higgsfield game platform
├── design/            # asset manifest + design brief
└── tools/             # build_artifact.py (derives the single-file build)
```

## Tech

Plain HTML5 `<canvas>`, no framework. Fixed-timestep 60 Hz simulation with a seeded RNG,
responsive canvas (DPR-capped), pause-on-blur, keyboard (physical key codes) + touch +
gamepad, and externalized strings for one-swap localization.
