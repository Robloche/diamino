import Diamino from "../Diamino";
import { GameStateContext } from "../../providers/GameStateProvider";
import React from "react";
import clsx from "clsx";
import { getPlayerScore } from "../../helpers/player";
import styles from "./Player.module.css";

const Player = ({ id, player }) => {
  const { playerIndexTurn } = React.useContext(GameStateContext);
  const { diaminoes, name } = player;

  const topDiamino = diaminoes[0];

  return (
    <div
      className={clsx(styles.player, playerIndexTurn === id && styles.playing)}
    >
      <div className={styles.name}>{name}</div>
      <div className={styles.score}>{getPlayerScore(diaminoes)}</div>
      <div
        className={clsx(styles.stackedDiaminoes, topDiamino && styles.hidden)}
      >
        {topDiamino && <Diamino diamino={topDiamino} />}
      </div>
    </div>
  );
};

export default Player;
