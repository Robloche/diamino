import { DiaminoState, GameState } from "../../helpers/types";
import Diamino from "../Diamino";
import { GameStateContext } from "../../providers/GameStateProvider";
import React from "react";
import { motion } from "framer-motion";
import styles from "./Diaminoes.module.css";

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
          <Diamino diamino={diamino} isPickable={pickableIndex === i} />
        </motion.div>
      ))}
    </div>
  );
};

export default Diaminoes;
