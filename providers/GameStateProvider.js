import {
  DIAMINOES_COUNT,
  DICE_COUNT,
  PLAYER_COUNT_MAX,
} from "../helpers/constants";
import { DiaminoState, DieState, GameState } from "../helpers/types";
import React from "react";
import { produce } from "immer";
import { getRandomInteger } from "../helpers/math";

export const GameStateContext = React.createContext();

const GameStateProvider = ({ children }) => {
  const [gameState, setGameState] = React.useState(GameState.Initializing);
  const [playerIndexTurn, setPlayerIndexTurn] = React.useState(-1);
  const [chosenValue, setChosenValue] = React.useState(-1);

  const [players, setPlayers] = React.useState(() => {
    const players = [];
    for (let i = 0; i < PLAYER_COUNT_MAX; ++i) {
      players.push({
        diaminoes: [],
        name: `Player ${i}`,
      });
    }
    return players;
  });

  const [diaminoes, setDiaminoes] = React.useState(() => {
    const diaminoes = [];
    for (let index = 0; index < DIAMINOES_COUNT; ++index) {
      diaminoes.push({
        number: index + 21,
        points: Math.floor(index / 4) + 1,
        state: DiaminoState.Normal,
      });
    }
    return diaminoes;
  });

  const [dice, setDice] = React.useState(() => {
    const dice = [];
    for (let index = 0; index < DICE_COUNT; ++index) {
      dice.push({
        id: index,
        state: DieState.Normal,
        value: getRandomInteger(1, 6),
      });
    }
    return dice;
  });

  const pickDiamino = React.useCallback((playerIndex, score) => {}, []);

  const returnDiamino = React.useCallback((playerIndex) => {}, []);

  const stealDiamino = React.useCallback((thiefIndex, victimIndex) => {}, []);

  const updateDieState = (dieIndex, state) => {
    setDice(
      produce((draft) => {
        draft[dieIndex].state = state;
      }),
    );
  };

  const chooseValue = (dieIndex, value) => {
    updateDieState(dieIndex, DieState.Chosen);
    setChosenValue(value);
  };

  const keepDie = (dieIndex) => updateDieState(dieIndex, DieState.Kept);
  const resetDie = (dieIndex) => updateDieState(dieIndex, DieState.Normal);

  const value = React.useMemo(
    () => ({
      chooseValue,
      chosenValue,
      diaminoes,
      dice,
      gameState,
      keepDie,
      pickDiamino,
      players,
      resetDie,
      returnDiamino,
      stealDiamino,
    }),
    [
      chooseValue,
      chosenValue,
      diaminoes,
      dice,
      gameState,
      keepDie,
      pickDiamino,
      players,
      resetDie,
      returnDiamino,
      stealDiamino,
    ],
  );

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};

export default GameStateProvider;
