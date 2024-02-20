import Diamino from "../Diamino";
import { GameStateContext } from "../../providers/GameStateProvider";
import React from "react";
import styles from "./Diaminoes.module.css";

const Diaminoes = () => {
  const { diaminoes } = React.useContext(GameStateContext);

  return (
    <div className={styles.diaminoes}>
      {diaminoes.map((diamino, i) => (
        <Diamino diamino={diamino} key={i} />
      ))}
    </div>
  );
};

export default Diaminoes;
