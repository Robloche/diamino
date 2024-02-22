import { GameStateContext } from "../../providers/GameStateProvider";
import Player from "../Player";
import React from "react";
import styles from "./Players.module.css";

const Players = () => {
  const { players } = React.useContext(GameStateContext);

  return (
    <div className={styles.players}>
      {players.map((player, i) => (
        <Player id={i} key={i} player={player} />
      ))}
    </div>
  );
};

export default Players;
