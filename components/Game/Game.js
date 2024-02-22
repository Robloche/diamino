import AudioButton from "../AudioButton";
import Diaminoes from "../Diaminoes";
import DiceTrack from "../DiceTrack";
import GameStateProvider from "../../providers/GameStateProvider";
import Image from "next/image";
import Players from "../Players";
import React from "react";
import { SettingsContext } from "../../providers/SettingsProvider";
import clsx from 'clsx';
import settingsIcon from "../../assets/settings.svg";
import styles from "./Game.module.css";

const Game = () => {
  const { openSettings } = React.useContext(SettingsContext);

  return (
    <GameStateProvider>
      <div className={styles.game}>
        <Diaminoes />
        <AudioButton
          className={clsx("action", styles.settings)}
          onClick={openSettings}
        >
          <Image alt="Settings icon" src={settingsIcon} />
        </AudioButton>
        <DiceTrack />
        <Players />
      </div>
    </GameStateProvider>
  );
};

export default Game;
