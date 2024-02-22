export const GameState = Object.freeze({
  Initializing: 0, // Game not started
  PlayingStart: 1, // Player turn starts
  PlayingDiceChoice: 2, // Player must choose a die value
  PlayingActionChoice: 3, // Player must throw the dice or pick a diamino (if possible)
  //PlayingDiaminoPicked: 4, // Player turn ended when they picked a diamino
  PlayingBusted: 4, // Player turn ended because they busted
  GameOver: 5,
});

export const DiaminoState = Object.freeze({
  Normal: "normal",
  Pickable: "pickable",
  Stealable: "stealable",
  Turned: "turned",
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
