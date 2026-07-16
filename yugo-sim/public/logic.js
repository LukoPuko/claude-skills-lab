// Solo game: no server-authoritative rules needed. Platform still requires a code
// module at the zip root, so this is the required no-op stub (build-game.md §1).
export const meta = { game: "yugo-simulator", minPlayers: 1, maxPlayers: 1 };
export function setup() { return {}; }
export function validateAction() { return { ok: true }; }
export function applyAction(state) { return state; }
export function isGameOver() { return { over: false }; }
export function viewFor(state) { return state; }
