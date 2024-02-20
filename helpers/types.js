export const GameState = Object.freeze({
  Initializing: 0,
  Playing: 1,
  Finished: 3,
});

export const DiaminoState = Object.freeze({
  Normal: "normal",
  Pickable: "pickable",
  Stealable: "stealable",
  Turned: "turned",
});

export const DieState = Object.freeze({
  Normal: "normal",
  Chosen: "chosen",
  Kept: "kept",
});

export const Sound = Object.freeze({
  Click: "click",
  Finished: "finished",
  FinishedHighScore: "finishedHighScore",
  Found: "found",
  Miss: "miss",
  Move: "move",
  TileTurn: "tileTurn",
});
