import Diaminoes from "../Diaminoes";
import DiceTrack from "../DiceTrack";
import Players from "../Players";
import React from "react";
import styles from "./Game.module.css";
import GameStateProvider from "../../providers/GameStateProvider";
import ClientOnly from "../ClientOnly";

const Game = () => {
  return (
    <GameStateProvider>
      <div className={styles.game}>
        <Diaminoes />
        <ClientOnly>
          <DiceTrack />
        </ClientOnly>
        <Players />
      </div>
    </GameStateProvider>
  );
};

export default Game;
