import AudioButton from "../AudioButton";
import { DiaminoState } from "../../helpers/types";
import { GameStateContext } from "../../providers/GameStateProvider";
import React from "react";
import clsx from "clsx";
import styles from "./Diamino.module.css";

const Diamino = ({ diamino }) => {
  const { diceSum, pickDiamino } = React.useContext(GameStateContext);
  const { number, points, state } = diamino;

  const handleOnClick = React.useCallback(() => {
    if (number === diceSum) {
      // Pick diamino and end turn
      pickDiamino(diamino);
    }
  }, [diamino, diceSum]);

  const diamonds = [];
  for (let i = 0; i < points; ++i) {
    diamonds.push("💎");
  }

  if (state === DiaminoState.Turned) {
    return <div className={clsx(styles.diamino, styles.turned)} />;
  }

  return (
    <AudioButton
      className={clsx(styles.diamino, number === diceSum && styles.pickable)}
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
