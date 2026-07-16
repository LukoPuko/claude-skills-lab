# Yugo Simulator — design brief

**Experience formula:** the player feels the tense, comedic affection of keeping a beloved
piece-of-junk car alive, because the game constantly threatens the Yugo with potholes, heat
and rattling decay while dangling just enough cash and spare parts to limp a little farther.

**Profile:** real-time · continuous 2D side-view · one hero (the car) · vs system · procedural
endless road · endless/high-score outcome · solo · minute-to-minutes sessions · engagement =
execution + accumulation (distance & cash).

**Delivery context:** desktop + mobile browsers + gamepad. Keyboard bound to physical key
codes; touch zones + on-screen HOP button; gamepad via Gamepad API. All player-visible strings
in `strings.js`.

## Core loop
The world scrolls; the Yugo holds the left-center. Player manages three things at once:
- **Throttle** (accelerate/brake): faster = more distance & cash per second, but more engine
  heat and harder pothole impacts. Braking cools the engine and softens hits.
- **Hop**: a suspension bunny-hop to clear potholes, rocks and the occasional roadside cow.
- **Systems**: Engine Heat (seize at 100) and Integrity (fall apart at 0). Wrenches repair
  integrity and dump heat; cash is score.

## Uncertainty sources (L4)
Execution (timing the hop), rising difficulty (spawn rate & gap tightening with distance),
and the heat/integrity squeeze (push speed for score vs. survive).

## Verbs × resistance
- potholes/rocks → hop or brake · overheating → brake/coast or grab wrench · decay → wrench ·
  distance pressure → throttle. Every hazard has an answer; no single verb answers everything.

## Style formula (locked, embedded byte-identical in every asset incl. procedural)
chunky flat-vector cartoon with bold clean fills and soft cel-shading, rounded boxy
silhouettes with thick charcoal outlines, environment in dusty Balkan ochre road and hazy
blue-grey mountains, the Yugo hero in faded socialist mustard-tan that pops against a warm sky,
hazards like potholes smoke and warning lights in alarm red-orange, pickups like cash and
wrenches in bright coin-gold and cyan, warm nostalgic late-afternoon Yugoslav summer haze with
gentle grain, high contrast between car and background and clean readable silhouettes,
consistent side-view perspective across all assets

## Thresholds
- 60 fps target; fixed-timestep 60 Hz sim; seeded RNG.
- Heat: +rate scales with throttle; brake cools; wrench -35; seize at 100.
- Integrity: 100 start; pothole hit at speed -12..-28; wrench +30; cow hit heavy; 0 = game over.
- Difficulty: obstacle spawn interval shrinks and min gap tightens with distance (km).
