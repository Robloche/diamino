import AudioButton from "../AudioButton";
import Die from "../Die";
import { GameState } from "../../helpers/types";
import { GameStateContext } from "../../providers/GameStateProvider";
import Image from "next/image";
import React from "react";
import clsx from "clsx";
import dieIcon from "../../assets/die.svg";
import forbiddenIcon from "../../assets/forbidden.svg";
import leftArrowIcon from "../../assets/left-arrow.svg";
import styles from "./DiceTrack.module.css";

const DiceTrack = () => {
  const {
    chosenValue,
    diceSum,
    forbiddenValues,
    gameState,
    hasDiamond,
    inPlayDice,
    keepDice,
    keptDice,
    throwDice,
  } = React.useContext(GameStateContext);

  console.log(`gameState: ${gameState}`);

  const isKeepDiceEnabled = chosenValue > -1;
  const isThrowDiceEnabled =
    gameState === GameState.PlayingStart ||
    (gameState === GameState.PlayingActionChoice && inPlayDice.length > 0);

  const bustedElt =
    gameState === GameState.PlayingBusted ? (
      <div className={styles.busted}>BUSTED!</div>
    ) : null;

  return (
    <div className={styles.diceTrack}>
      <div className={styles.keptArea}>
        {keptDice.map((die, i) => (
          <Die die={die} key={i} />
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
          gameState !== GameState.PlayingStart &&
          inPlayDice.map((die, i) => (
            <Die die={die} isDisabled={isThrowDiceEnabled} key={i} />
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
        <span>
          <Image
            alt="Keep die icon"
            className={styles.icon}
            src={leftArrowIcon}
          />
          <Image alt="Die icon" className={styles.icon} src={dieIcon} />
        </span>
      </AudioButton>
      {bustedElt}
    </div>
  );
};

export default DiceTrack;
