import AudioButton from "../AudioButton";
import { DiaminoState } from "../../helpers/types";
import { GameStateContext } from "../../providers/GameStateProvider";
import React from "react";
import clsx from "clsx";
import styles from "./Diamino.module.css";
import { SettingsContext } from "../../providers/SettingsProvider";

const Diamino = ({
  diamino,
  isPickable = false,
  isStacked = false,
  isStealable = false,
}) => {
  const { settings } = React.useContext(SettingsContext);
  const { hasDiamond, pickDiamino, stealDiamino } =
    React.useContext(GameStateContext);
  const { number, points, state } = diamino;

  const handleOnClick = React.useCallback(() => {
    if (!hasDiamond) {
      return;
    }

    if (isPickable) {
      // Pick diamino and end turn
      pickDiamino(diamino.number);
      return;
    }

    if (isStealable) {
      // Steal the top diamino from a player
      stealDiamino(diamino);
    }
  }, [diamino, hasDiamond, isPickable, isStealable, pickDiamino, stealDiamino]);

  const diamonds = [];
  for (let i = 0; i < points; ++i) {
    diamonds.push("💎");
  }

  if (state === DiaminoState.Turned) {
    return <div className={clsx(styles.diamino, styles.turned)} />;
  }

  return (
    <AudioButton
      className={clsx(
        styles.diamino,
        isPickable && styles.pickable,
        isStealable && styles.stealable,
        isStealable && hasDiamond && settings.stealHint && styles.hint,
        hasDiamond && styles.hasDiamond,
        isStacked && styles.stacked,
      )}
      onClick={handleOnClick}
    >
      <div className={styles.number}>{number}</div>
      <div className={clsx(styles.points, points >= 5 && styles.fivePlus)}>
        {diamonds.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
    </AudioButton>
  );
};

export default Diamino;
