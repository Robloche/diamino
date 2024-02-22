import Diamino from "../Diamino";
import { GameStateContext } from "../../providers/GameStateProvider";
import React from "react";
import styles from "./Diaminoes.module.css";
import clsx from "clsx";

const Diaminoes = () => {
  const { diaminoes, diceSum } = React.useContext(GameStateContext);

  const pickableIndex = diaminoes.findLastIndex(
    ({ number }) => number <= diceSum,
  );

  const ghostDiamino =
    diceSum > 0 && pickableIndex === -1 ? (
      <div className={styles.ghost}>{diceSum}</div>
    ) : null;

  //console.log(`diceSum: ${diceSum} | pickableIndex: ${pickableIndex}`);

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
