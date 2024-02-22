import {
  DIAMINOES_COUNT,
  DIAMINOES_NUMBER_START,
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

  const [players, setPlayers] = React.useState([]);

  const [diaminoes, setDiaminoes] = React.useState(() => {
    const diaminoes = [];
    for (let index = 0; index < DIAMINOES_COUNT; ++index) {
      diaminoes.push({
        number: index + DIAMINOES_NUMBER_START,
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

  const advanceToNextPlayer = React.useCallback(() => {
    setPlayerIndexTurn((current) => (current + 1) % players.length);
    setInPlayDice(resetDice());
    setChosenValue(-1);
    setKeptDice([]);
    setForbiddenValues(new Set());
    setGameState(GameState.PlayingStart);
  }, [players]);

  const pickDiamino = React.useCallback(
    (diamino) => {
      // Remove diamino from diaminoes
      setDiaminoes(
        produce((draft) => {
          const index = draft.findIndex(
            ({ number }) => number === diamino.number,
          );
          draft.splice(index, 1);
        }),
      );

      // Add diamino to player (at first position)
      setPlayers(
        produce((draft) => {
          draft[playerIndexTurn].diaminoes.unshift(diamino);
        }),
      );

      // Next player
      advanceToNextPlayer();
    },
    [advanceToNextPlayer, playerIndexTurn],
  );

  const stealDiamino = React.useCallback(
    (diamino) => {
      setPlayers(
        produce((draft) => {
          // Remove diamino from player's diaminoes
          const stolenPlayer = draft.find(
            (player) => player.diaminoes[0]?.number === diamino.number,
          );
          stolenPlayer.diaminoes.shift();

          // Add diamino to player (at first position)
          draft[playerIndexTurn].diaminoes.unshift(diamino);
        }),
      );

      // Next player
      advanceToNextPlayer();
    },
    [advanceToNextPlayer, playerIndexTurn],
  );

  // Check game over
  React.useEffect(() => {
    const liveDiaminoes = diaminoes.filter(
      (diamino) => diamino.state === DiaminoState.Normal,
    );

    if (liveDiaminoes.length === 0) {
      setGameState(GameState.GameOver);
      // TODO: do stuff (highlight winner, play sound, hide buttons, etc.)
    }
  }, [diaminoes]);

  /*
   * Player busted if:
   *  - after having kept a die:
   *    # no die remains && no diamino is pickable && no diamino is stealable
   *    # forbiddenValues contains all 6 values && no diamino is pickable && no diamino is stealable
   *  - after having thrown the dice:
   *    # all dice values are in forbiddenValues
   *
   * no diamino is pickable:  !hasDiamond || diceSum < min(diaminoes)
   * no diamino is stealable: !hasDiamond || diceSum !== every(player.diaminoes[0])
   */
  const isPlayerBusted = React.useCallback(
    (newForbiddenValues, newDice) => {
      const diceSum = keptDice.reduce(
        (total, die) => total + (die.value < 6 ? die.value : 5),
        0,
      );

      const hasDiamond = keptDice.some(({ value }) => value === 6);

      const canGetDiamino =
        hasDiamond &&
        // Pickable
        (diaminoes.some(({ number, state }) => state === DiaminoState.Normal) ||
          // Stealable
          players.some(({ diaminoes }) => diaminoes[0]?.number === diceSum));

      if (newDice) {
        if (newDice.length === 0 && !canGetDiamino) {
          // No die remains && no diamino is pickable && no diamino is stealable
          return true;
        }
        if (newDice.every(({ value }) => forbiddenValues.has(value))) {
          // All dice values are in forbiddenValues
          return true;
        }
      }

      // ForbiddenValues contains all 6 values && no diamino is pickable && no diamino is stealable
      return (
        typeof newForbiddenValues !== "undefined" &&
        newForbiddenValues.size === 6 &&
        !canGetDiamino
      );
    },
    [diaminoes, keptDice, players],
  );

  const bustPlayer = React.useCallback(() => {
    setGameState(GameState.PlayingBusted);

    const playerTopDiamino = players[playerIndexTurn].diaminoes[0];

    if (playerTopDiamino) {
      // Return player's top diamino
      setPlayers(
        produce((draft) => {
          draft[playerIndexTurn].diaminoes.shift();
        }),
      );
    }

    setDiaminoes(
      produce((draft) => {
        if (playerTopDiamino) {
          // Player returns the diamino from the top of their stack
          const index = draft.findLastIndex(
            ({ number }) => number <= playerTopDiamino.number,
          );
          draft.splice(index + 1, 0, playerTopDiamino);
        }

        // Flip  highest diamino if it's not the returned one
        const highestDiamino = draft.findLast(
          (diamino) => diamino.state === DiaminoState.Normal,
        );
        if (
          typeof playerTopDiamino === "undefined" ||
          highestDiamino.number > playerTopDiamino.number
        ) {
          highestDiamino.state = DiaminoState.Turned;
        }
      }),
    );
  }, [playerIndexTurn, players]);

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

    const newForbiddenValues = new Set(forbiddenValues);
    newKeptDice.forEach(({ value }) => newForbiddenValues.add(value));
    setForbiddenValues(newForbiddenValues);

    const isBusted = isPlayerBusted(newForbiddenValues, undefined);
    if (isBusted) {
      bustPlayer();
      return;
    }

    // Reset chosen value
    setChosenValue(-1);

    setGameState(GameState.PlayingActionChoice);
  }, [bustPlayer, chosenValue, forbiddenValues, inPlayDice, isPlayerBusted]);

  const chooseValue = (value) => setChosenValue(value);

  const resetChosenValue = (dieIndex) => setChosenValue(-1);

  const throwDice = React.useCallback(() => {
    const newDice = inPlayDice.map(({ id }) => ({
      id,
      value: throwDie(),
    }));

    setInPlayDice(newDice);

    const isBusted = isPlayerBusted(undefined, newDice);
    if (isBusted) {
      bustPlayer();
      return;
    }

    setGameState(() => {
      if (isBusted) {
        // Player busted
        return GameState.PlayingBusted;
      }

      // Player turn continues
      return GameState.PlayingDiceChoice;
    });
  }, [inPlayDice, forbiddenValues, isPlayerBusted]);

  const endBustedTurn = React.useCallback(() => {
    setGameState(GameState.PlayingStart);
    advanceToNextPlayer();
  }, [advanceToNextPlayer]);

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
      diceSum,
      endBustedTurn,
      forbiddenValues,
      gameState,
      hasDiamond,
      inPlayDice,
      keepDice,
      keptDice,
      pickDiamino,
      playerIndexTurn,
      players,
      resetChosenValue,
      stealDiamino,
      throwDice,
    }),
    [
      chooseValue,
      chosenValue,
      diaminoes,
      endBustedTurn,
      forbiddenValues,
      gameState,
      inPlayDice,
      keepDice,
      keptDice,
      pickDiamino,
      playerIndexTurn,
      players,
      resetChosenValue,
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
