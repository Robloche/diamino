import { GameState } from "../../helpers/types";
import { GameStateContext } from "../../providers/GameStateProvider";
import Player from "../Player";
import React from "react";
import clsx from 'clsx';
import styles from "./Players.module.css";

const Players = () => {
  const { gameState, players } = React.useContext(GameStateContext);

  return (
    <div
      className={clsx(
        styles.players,
        gameState === GameState.GameOver && styles.gameOver,
      )}
    >
      {players.map((player, i) => (
        <Player id={i} key={i} player={player} />
      ))}
    </div>
  );
};

export default Players;
