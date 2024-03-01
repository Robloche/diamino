import AudioButton from "../AudioButton";
import { BUSTED_DELAY } from "../../helpers/constants";
import Die from "../Die";
import { GameState } from "../../helpers/types";
import { GameStateContext } from "../../providers/GameStateProvider";
import Image from "next/image";
import React from "react";
import clsx from "clsx";
import dieIcon from "../../assets/die.svg";
import forbiddenIcon from "../../assets/forbidden.svg";
import leftArrowIcon from "../../assets/left-arrow.svg";
import { motion } from "framer-motion";
import styles from "./DiceTrack.module.css";

const DiceTrack = () => {
  const {
    chosenValue,
    diceSum,
    endBustedTurn,
    gameState,
    hasDiamond,
    inPlayDice,
    keepDice,
    keptDice,
    throwDice,
  } = React.useContext(GameStateContext);

  if (gameState === GameState.GameOver) {
    return null;
  }

  const handleOnAnimationEnd = () => {
    setTimeout(endBustedTurn, BUSTED_DELAY);
  };

  const isKeepDiceEnabled = chosenValue > -1;
  const isThrowDiceEnabled =
    gameState === GameState.PlayingStart ||
    (gameState === GameState.PlayingActionChoice && inPlayDice.length > 0);

  const bustedElt =
    gameState === GameState.PlayingBusted ? (
      <div className={styles.busted} onAnimationEnd={handleOnAnimationEnd}>
        <span>BUSTED!</span>
      </div>
    ) : null;

  return (
    <div className={styles.diceTrack}>
      <div className={styles.keptArea}>
        {keptDice.map((die) => (
          <motion.div key={die.id} layoutId={die.id}>
            <Die die={die} isKept={true} />
          </motion.div>
        ))}
        <div
          className={clsx(
            styles.hasDiamond,
            (hasDiamond || keptDice.length === 0) && styles.hidden,
          )}
        >
          💎
          <Image alt="Missing icon" src={forbiddenIcon} />
        </div>
      </div>
      <div className={styles.separator} />
      <div className={styles.playArea}>
        {gameState !== GameState.Initializing &&
          inPlayDice.map((die) => (
            <motion.div key={die.id} layoutId={die.id}>
              <Die die={die} isDisabled={isThrowDiceEnabled} />
            </motion.div>
          ))}
        <div className={styles.buttonWrapper}>
          <AudioButton
            className={clsx("action", styles.diceAction, styles.throwDice)}
            disabled={!isThrowDiceEnabled}
            onClick={throwDice}
          >
            <Image alt="Die icon" className={styles.icon} src={dieIcon} />
          </AudioButton>
        </div>
      </div>
      <div className={styles.gameNameWrapper}>
        <div className={styles.gameName}>💎 DIAMINO 💎</div>
      </div>
      <div className={styles.totalValue}>{diceSum}</div>
      <AudioButton
        className={clsx("action", styles.diceAction, styles.keepDice)}
        disabled={!isKeepDiceEnabled}
        onClick={keepDice}
      >
        <Image
          alt="Keep die icon"
          className={clsx(styles.icon, styles.arrow)}
          src={leftArrowIcon}
        />
        <Image
          alt="Die icon"
          className={clsx(styles.icon, styles.die)}
          src={dieIcon}
        />
      </AudioButton>
      {bustedElt}
    </div>
  );
};

export default DiceTrack;
