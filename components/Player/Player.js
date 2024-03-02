import Diamino from "../Diamino";
import { GameState } from "../../helpers/types";
import { GameStateContext } from "../../providers/GameStateProvider";
import React from "react";
import { SettingsContext } from "../../providers/SettingsProvider";
import clsx from "clsx";
import { getPlayerScore } from "../../helpers/player";
import { motion } from "framer-motion";
import styles from "./Player.module.css";

const Player = ({ id, player }) => {
  const { settings } = React.useContext(SettingsContext);
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

  // When game is over, diaminoes are expanded horizontally and revealed one by one
  const lastDisplayedIndex =
    gameState === GameState.GameOver ? expandedCount : diaminoes.length;

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
              {settings.showScore && (
                <>
                  <span className={styles.scoreSeparator}>/</span>
                  {getPlayerScore(diaminoes)}
                </>
              )}
            </>
          ) : (
            finalScore
          )}
        </div>
      </div>
      {/* Player's diaminoes */}
      <div
        className={clsx(
          gameState === GameState.GameOver
            ? styles.expandedDiaminoes
            : styles.stackedDiaminoes,
          topDiamino && styles.hidden,
        )}
      >
        {diaminoes
          .slice(0, lastDisplayedIndex)
          .reverse()
          .map((diamino) => (
            <motion.div
              key={diamino.number}
              layout="position"
              layoutId={diamino.number}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 100,
                // damping: 40 + coinIndex * 5,
              }}
            >
              <Diamino
                diamino={diamino}
                isStacked={gameState !== GameState.GameOver}
                isStealable={
                  playerIndexTurn !== id &&
                  hasDiamond &&
                  diamino.number === diceSum
                }
              />
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default Player;
