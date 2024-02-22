import AudioButton from "../AudioButton";
import { GameState } from "../../helpers/types";
import { GameStateContext } from "../../providers/GameStateProvider";
import React from "react";
import clsx from "clsx";
import styles from "./Die.module.css";

const renderDiamond = () => {
  return <span className={styles.diamond}>💎</span>;
};

const renderPips = (score) => {
  return Array(score)
    .fill(null)
    .map((_, i) => <span className={styles.pip} key={i}></span>);
};

const renderColumns = (columns) => {
  return (
    <>
      {columns.map((c, i) => (
        <div className={styles.column} key={i}>
          {renderPips(c)}
        </div>
      ))}
    </>
  );
};

const renderElement = (score) => {
  return (
    <div className={styles[`face-${score}`]}>
      {score < 4
        ? renderPips(score)
        : score < 6
          ? renderColumns(score === 4 ? [2, 2] : [2, 1, 2])
          : renderDiamond()}
    </div>
  );
};

const Die = ({ die, isDisabled = false }) => {
  const {
    chooseValue,
    chosenValue,
    forbiddenValues,
    gameState,
    resetChosenValue,
  } = React.useContext(GameStateContext);
  const { value } = die;

  const handleOnClick = React.useCallback(() => {
    if (
      gameState === GameState.PlayingActionChoice ||
      (chosenValue !== -1 && value !== chosenValue) ||
      forbiddenValues.has(value)
    ) {
      // Player can only deselect chosen dice, and cannot pick a previously kept value
      return;
    }

    if (chosenValue === -1) {
      chooseValue(value);
    } else {
      resetChosenValue();
    }
  }, [
    chooseValue,
    chosenValue,
    forbiddenValues,
    gameState,
    resetChosenValue,
    value,
  ]);

  const isChosen = value === chosenValue;
  const isForbidden =
    gameState === GameState.PlayingActionChoice || forbiddenValues.has(value);

  console.log("Forbidden values:");
  console.log(forbiddenValues);

  console.log(`isForbidden: ${isForbidden}`);

  return (
    <AudioButton
      className={clsx(
        styles.die,
        isChosen && styles.chosen,
        isForbidden && styles.forbidden,
        isDisabled && styles.disabled,
      )}
      onClick={handleOnClick}
    >
      {renderElement(value)}
      {isChosen && <div className={styles.chosenOverlay} />}
    </AudioButton>
  );
};

export default Die;
