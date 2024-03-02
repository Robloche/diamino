import {
  DIAMINOES_COUNT,
  DIAMINOES_NUMBER_START,
  DICE_COUNT,
} from "../helpers/constants";
import { DiaminoState, GameState } from "../helpers/types";
import Menu from "../components/Menu";
import React from "react";
import { getPlayerScore } from "../helpers/player";
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
    (diaminoNumber) => {
      // Remove diamino from diaminoes
      const index = diaminoes.findIndex(
        ({ number }) => number === diaminoNumber,
      );

      if (index === -1) {
        // Diamino not found
        return;
      }

      setDiaminoes(
        produce((draft) => {
          draft.splice(index, 1);
        }),
      );

      // Add diamino to player (at first position)
      const diamino = diaminoes[index];
      setPlayers(
        produce((draft) => {
          draft[playerIndexTurn].diaminoes.unshift(diamino);
        }),
      );

      // Next player
      advanceToNextPlayer();
    },
    [advanceToNextPlayer, diaminoes, playerIndexTurn],
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

  const endGame = React.useCallback((players = undefined) => {
    setGameState(GameState.GameOver);
    setPlayerIndexTurn(-1);

    // Compute scores
    setPlayers(
      produce((draft) => {
        if (typeof players !== "undefined") {
          // Used passed players to fully configure the game
          draft.length = 0;
          players.forEach(({ diaminoes, name }) =>
            draft.push({
              diaminoes: diaminoes.map((number) => ({
                number,
                points: Math.floor((number - DIAMINOES_NUMBER_START) / 4) + 1,
                state: DiaminoState.Normal,
              })),
              name,
            }),
          );
        }

        draft.forEach(
          (player) => (player.score = getPlayerScore(player.diaminoes)),
        );
        draft.sort((p1, p2) => p2.score - p1.score);
      }),
    );
  }, []);

  const startNewGame = React.useCallback(() => {
    // TODO: reset diaminoes + players + dice + open settings
    setGameState(GameState.Initializing);
  }, []);

  const startRematch = React.useCallback(() => {
    // TODO: reset diaminoes + players' diaminoes + dice + open settings
    setGameState(GameState.Initializing);
  }, []);

  // Check game over
  React.useEffect(() => {
    const liveDiaminoes = diaminoes.filter(
      (diamino) => diamino.state === DiaminoState.Normal,
    );

    if (liveDiaminoes.length === 0) {
      endGame();
    }
  }, [diaminoes, endGame]);

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
    (newKeptDice, newForbiddenValues, newDice) => {
      const localKeptDice = newKeptDice ?? keptDice;

      const diceSum = localKeptDice.reduce(
        (total, die) => total + (die.value < 6 ? die.value : 5),
        0,
      );

      const hasDiamond = localKeptDice.some(({ value }) => value === 6);

      const canGetDiamino =
        hasDiamond &&
        // Pickable
        (diaminoes.some(({ number, state }) => state === DiaminoState.Normal) ||
          // Stealable
          players.some(({ diaminoes }) => diaminoes[0]?.number === diceSum));

      if (newDice.length === 0 && !canGetDiamino) {
        // No die remains && no diamino is pickable && no diamino is stealable
        return true;
      }
      if (
        typeof newKeptDice === "undefined" &&
        newDice.every(({ value }) => forbiddenValues.has(value))
      ) {
        // All dice values are in forbiddenValues
        return true;
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
    const newKeptDice = [...keptDice];
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
    setKeptDice(newKeptDice);
    setInPlayDice(remainingDice);

    // Update forbidden values
    const newForbiddenValues = new Set(newKeptDice.map(({ value }) => value));
    setForbiddenValues(newForbiddenValues);

    // Check if player is busted
    const isBusted = isPlayerBusted(
      newKeptDice,
      newForbiddenValues,
      remainingDice,
    );
    if (isBusted) {
      bustPlayer();
      return;
    }

    // Reset chosen value
    setChosenValue(-1);

    setGameState(GameState.PlayingActionChoice);
  }, [bustPlayer, chosenValue, inPlayDice, isPlayerBusted, keptDice]);

  const chooseValue = (value) => setChosenValue(value);

  const resetChosenValue = (dieIndex) => setChosenValue(-1);

  const throwDice = React.useCallback(() => {
    // Throw remaining dice
    const newDice = inPlayDice.map(({ id }) => ({
      id,
      value: throwDie(),
    }));

    setInPlayDice(newDice);

    // Check if player is busted
    const isBusted = isPlayerBusted(undefined, undefined, newDice);
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

  const dbgSetDice = React.useCallback(
    (newInPlayValues = undefined, newKeptValues = undefined) => {
      const changeValues = (dice, newValues) => {
        dice.forEach((die, i) => {
          const newValue = newValues[i];
          if (typeof newValue === "number") {
            die.value = newValue;
          }
        });
      };

      if (typeof newInPlayValues !== "undefined") {
        setInPlayDice(produce((draft) => changeValues(draft, newInPlayValues)));
      }

      if (typeof newKeptValues !== "undefined") {
        setKeptDice(produce((draft) => changeValues(draft, newKeptValues)));
      }
    },
    [],
  );

  const value = React.useMemo(
    () => ({
      bustPlayer,
      chooseValue,
      chosenValue,
      dbgSetDice,
      diaminoes,
      diceSum,
      endBustedTurn,
      endGame,
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
      startNewGame,
      startRematch,
      stealDiamino,
      throwDice,
    }),
    [
      bustPlayer,
      chooseValue,
      chosenValue,
      dbgSetDice,
      diaminoes,
      endBustedTurn,
      endGame,
      forbiddenValues,
      gameState,
      inPlayDice,
      keepDice,
      keptDice,
      pickDiamino,
      playerIndexTurn,
      players,
      resetChosenValue,
      startNewGame,
      startRematch,
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
