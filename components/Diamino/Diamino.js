import AudioButton from "../AudioButton";
import { DiaminoState } from "../../helpers/types";
import { GameStateContext } from "../../providers/GameStateProvider";
import React from "react";
import clsx from "clsx";
import styles from "./Diamino.module.css";

const Diamino = ({ diamino, isPickable = false, isStealable = false }) => {
  const { hasDiamond, pickDiamino, stealDiamino } =
    React.useContext(GameStateContext);
  const { number, points, state } = diamino;

  const handleOnClick = React.useCallback(() => {
    if (!hasDiamond) {
      return;
    }

    if (isPickable) {
      // Pick diamino and end turn
      pickDiamino(diamino);
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
        hasDiamond && styles.hasDiamond,
      )}
      onClick={handleOnClick}
    >
      <div className={styles.number}>{number}</div>
      <div className={styles.points}>
        {diamonds.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
    </AudioButton>
  );
};

export default Diamino;
