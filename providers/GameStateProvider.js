import {
  DIAMINOES_COUNT,
  DICE_COUNT,
  PLAYER_COUNT_MAX,
} from "../helpers/constants";
import { DiaminoState, GameState } from "../helpers/types";
import Menu from "../components/Menu";
import React from "react";
import { getRandomInteger } from "../helpers/math";
import { produce } from "immer";

export const GameStateContext = React.createContext();

const throwDie = () => getRandomInteger(1, 6);

const resetDice = () => {
  const dice = [];
  for (let index = 0; index < DICE_COUNT; ++index) {
    dice.push({
      id: index,
      value: throwDie(),
    });
  }
  return dice;
};

const GameStateProvider = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [gameState, setGameState] = React.useState(GameState.Initializing);
  const [playerIndexTurn, setPlayerIndexTurn] = React.useState(-1);
  const [chosenValue, setChosenValue] = React.useState(-1);
  const [inPlayDice, setInPlayDice] = React.useState(() => resetDice());
  const [keptDice, setKeptDice] = React.useState([]);
  const [forbiddenValues, setForbiddenValues] = React.useState(new Set());

  const [players, setPlayers] = React.useState(() => {
    const players = [];
    for (let i = 0; i < PLAYER_COUNT_MAX; ++i) {
      players.push({
        diaminoes: [],
        //name: "",
        name: `Player ${i + 1}`,
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

  const openMenu = React.useCallback(() => setIsOpen(true), []);

  const closeMenu = React.useCallback((players) => {
    setPlayers(players);
    setIsOpen(false);
    setPlayerIndexTurn(0);
    setGameState(GameState.PlayingStart);
  }, []);

  const pickDiamino = React.useCallback(
    (diamino) => {
      // Remove diamino from diaminoes
      setDiaminoes(
        produce((draft) => {
          draft.splice(diamino.number - 21, 1);
        }),
      );
      // Add diamino to player (at first position)
      setPlayers(
        produce((draft) => {
          draft[playerIndexTurn].diaminoes.unshift(diamino);
        }),
      );

      // TODO: check game over
      setInPlayDice(resetDice());
      setKeptDice([]);
      setPlayerIndexTurn((current) => (current + 1) % players.length);
      setGameState(GameState.PlayingStart);
    },
    [playerIndexTurn, players],
  );

  const returnDiamino = React.useCallback((playerIndex) => {}, []);

  const stealDiamino = React.useCallback((thiefIndex, victimIndex) => {}, []);

  // Keep all dice of the chosen value
  const keepDice = React.useCallback(() => {
    const newKeptDice = [];
    const remainingDice = [];

    inPlayDice.forEach((die) => {
      if (die.value === chosenValue) {
        newKeptDice.push(die);
      } else {
        remainingDice.push(die);
      }
    });

    newKeptDice.sort((d1, d2) => d2.value - d1.value);

    // Move dice of chosen value to "kept" list
    setKeptDice(
      produce((draft) => {
        draft.push(...newKeptDice);
      }),
    );
    setInPlayDice(remainingDice);

    setForbiddenValues(
      produce((draft) => {
        newKeptDice.forEach(({ value }) => draft.add(value));
      }),
    );

    // Reset chosen value
    setChosenValue(-1);

    setGameState(GameState.PlayingActionChoice);
  }, [chosenValue, inPlayDice]);

  const chooseValue = (value) => setChosenValue(value);

  const resetChosenValue = (dieIndex) => setChosenValue(-1);

  const throwDice = React.useCallback(() => {
    const newDice = inPlayDice.map(({ id }) => ({
      id,
      value: throwDie(),
    }));

    setInPlayDice(newDice);

    /*
     * Player busted if:
     *  - diceSum < min(diaminoes)
     *  - diceSum !== every(player.diaminoes[0])
     *  - newDice.length === 0 || every value in newDice is in forbiddenValues
     */
    const isBusted =
      newDice.length === 0 ||
      newDice.every(({ value }) => forbiddenValues.has(value));

    console.log(`isBusted: ${isBusted}`);

    setGameState(() => {
      if (isBusted) {
        // Player busted
        return GameState.PlayingBusted;
      }

      // Player turn continues
      return GameState.PlayingDiceChoice;
    });
  }, [inPlayDice, forbiddenValues]);

  const diceSum = keptDice.reduce(
    (total, die) => total + (die.value < 6 ? die.value : 5),
    0,
  );

  const hasDiamond = keptDice.some(({ value }) => value === 6);

  const value = React.useMemo(
    () => ({
      chooseValue,
      chosenValue,
      diaminoes,
      inPlayDice,
      diceSum,
      forbiddenValues,
      gameState,
      hasDiamond,
      keepDice,
      keptDice,
      pickDiamino,
      playerIndexTurn,
      players,
      resetChosenValue,
      returnDiamino,
      stealDiamino,
      throwDice,
    }),
    [
      chooseValue,
      chosenValue,
      diaminoes,
      inPlayDice,
      forbiddenValues,
      gameState,
      keepDice,
      keptDice,
      pickDiamino,
      playerIndexTurn,
      players,
      resetChosenValue,
      returnDiamino,
      stealDiamino,
      throwDice,
    ],
  );

  return (
    <GameStateContext.Provider value={value}>
      {children}
      {isOpen && <Menu initialPlayers={players} onCloseMenu={closeMenu} />}
    </GameStateContext.Provider>
  );
};

export default GameStateProvider;
