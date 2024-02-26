import Diamino from "../Diamino";
import { GameStateContext } from "../../providers/GameStateProvider";
import React from "react";
import styles from "./Diaminoes.module.css";
import clsx from "clsx";
import { DiaminoState, GameState } from "../../helpers/types";

const Diaminoes = () => {
  const { diaminoes, diceSum, gameState } = React.useContext(GameStateContext);

  if (gameState === GameState.GameOver) {
    return null;
  }

  const pickableIndex = diaminoes.findLastIndex(
    ({ number, state }) => state === DiaminoState.Normal && number <= diceSum,
  );

  const ghostDiamino =
    diceSum > 0 && pickableIndex === -1 ? (
      <div className={styles.ghost}>{diceSum}</div>
    ) : null;

  return (
    <div className={styles.diaminoes}>
      {ghostDiamino}
      {diaminoes.map((diamino, i) => (
        <Diamino diamino={diamino} isPickable={pickableIndex === i} key={i} />
      ))}
    </div>
  );
};

export default Diaminoes;
