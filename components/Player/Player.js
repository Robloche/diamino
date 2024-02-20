import React from "react";
import { getPlayerScore } from "../../helpers/player";
import styles from "./Player.module.css";

const Player = ({ player }) => {
  const { diaminoes, name } = player;

  console.log(player);

  return (
    <div className={styles.player}>
      <div className={styles.name}>{name}</div>
      <div className={styles.score}>{getPlayerScore(diaminoes)}</div>
    </div>
  );
};

export default Player;
