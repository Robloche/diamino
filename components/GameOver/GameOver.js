import AudioButton from "../AudioButton";
import { GameStateContext } from "../../providers/GameStateProvider";
import Players from "../Players";
import React from "react";
import clsx from "clsx";
import styles from "./GameOver.module.css";

const GameOver = () => {
  const { startNewGame, startRematch } = React.useContext(GameStateContext);

  return (
    <div className={styles.gameOver}>
      <h1>💎Diamino💎</h1>
      <h2>FINAL RANKING</h2>
      <Players />
      <AudioButton className="action" onClick={startRematch}>
        REMATCH
      </AudioButton>
      <AudioButton className="action" onClick={startNewGame}>
        NEW GAME
      </AudioButton>
    </div>
  );
};

export default GameOver;
