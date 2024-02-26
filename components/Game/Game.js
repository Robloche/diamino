import AudioButton from "../AudioButton";
import Diaminoes from "../Diaminoes";
import DiceTrack from "../DiceTrack";
import { GameState } from "../../helpers/types";
import { GameStateContext } from "../../providers/GameStateProvider";
import Image from "next/image";
import Players from "../Players";
import React from "react";
import { SettingsContext } from "../../providers/SettingsProvider";
import clsx from "clsx";
import settingsIcon from "../../assets/settings.svg";
import styles from "./Game.module.css";

const Game = () => {
  const { openSettings } = React.useContext(SettingsContext);
  const { gameState } = React.useContext(GameStateContext);

  return (
    <div className={styles.game}>
      <Diaminoes />
      <AudioButton
        className={clsx(
          "action",
          styles.settings,
          gameState === GameState.GameOver && styles.hidden,
        )}
        onClick={openSettings}
      >
        <Image alt="Settings icon" src={settingsIcon} />
      </AudioButton>
      <DiceTrack />
      <Players />
    </div>
  );
};

export default Game;
