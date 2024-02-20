import { GameStateContext } from "../../providers/GameStateProvider";
import React from "react";
import clsx from "clsx";
import styles from "./Die.module.css";
import { DieState } from "../../helpers/types";

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

const Die = ({ die }) => {
  const { chooseValue, chosenValue, resetDie } =
    React.useContext(GameStateContext);
  const { id, state, value } = die;

  const handleOnClick = React.useCallback(() => {
    if (chosenValue !== -1 && value !== chosenValue) {
      // Player can only deselect chosen dice
      return;
    }

    if (state === DieState.Normal) {
      chooseValue(id, value);
    } else {
      resetDie(id);
    }
  }, [chooseValue, chosenValue, resetDie, value, state]);

  return (
    <button
      className={clsx(styles.die, styles[state.toLowerCase()])}
      onClick={handleOnClick}
    >
      {renderElement(value)}
      {state === DieState.Chosen && <div className={styles.chosenOverlay} />}
    </button>
  );
};

export default Die;
