import Diamino from "../Diamino";
import { GameStateContext } from "../../providers/GameStateProvider";
import React from "react";
import clsx from "clsx";
import { getPlayerScore } from "../../helpers/player";
import styles from "./Player.module.css";
import { GameState } from "../../helpers/types";

const Player = ({ id, player }) => {
  const { diceSum, gameState, hasDiamond, playerIndexTurn } =
    React.useContext(GameStateContext);
  const [finalScore, setFinalScore] = React.useState(0);
  const { diaminoes, name } = player;
  const [expandedCount, setExpandedCount] = React.useState(0);

  const topDiamino = diaminoes[0];

  React.useEffect(() => {
    if (gameState !== GameState.GameOver || expandedCount >= diaminoes.length) {
      return;
    }

    // Display top diamino and start a timer before displaying the next one (if any)
    setTimeout(() => setExpandedCount(expandedCount + 1), 1_000);
  }, [diaminoes, expandedCount, gameState]);

  React.useEffect(() => {
    if (expandedCount < 1) {
      return;
    }
    setFinalScore((current) => current + diaminoes[expandedCount - 1].points);
  }, [expandedCount]);

  const renderDiaminoesElt = () => {
    if (gameState === GameState.GameOver) {
      // Display all expanded diaminoes (they are revealed one by one)
      return diaminoes
        .slice(0, expandedCount)
        .map((diamino) => <Diamino diamino={diamino} key={diamino.number} />);
    }

    // Display only top diamino, if any
    if (!topDiamino) {
      return null;
    }

    return (
      <Diamino
        diamino={topDiamino}
        isStealable={hasDiamond && topDiamino?.number === diceSum}
      />
    );
  };

  return (
    <div
      className={clsx(
        styles.player,
        playerIndexTurn === id && styles.playing,
        gameState === GameState.GameOver && styles.gameOver,
      )}
    >
      <div className={styles.header}>
        <div className={styles.name}>{name}</div>
        <div className={styles.score}>
          {gameState !== GameState.GameOver ? (
            <>
              {player.diaminoes.length}
              <span className={styles.scoreSeparator}>/</span>
              {getPlayerScore(diaminoes)}
            </>
          ) : (
            finalScore
          )}
        </div>
      </div>
      <div
        className={clsx(
          gameState === GameState.GameOver
            ? styles.expandedDiaminoes
            : styles.stackedDiaminoes,
          topDiamino && styles.hidden,
        )}
      >
        {renderDiaminoesElt()}
      </div>
    </div>
  );
};

export default Player;
