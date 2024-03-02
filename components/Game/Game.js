import AudioButton from "../AudioButton";
import Diaminoes from "../Diaminoes";
import DiceTrack from "../DiceTrack";
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
  const { bustPlayer, dbgSetDice, endGame, pickDiamino } =
    React.useContext(GameStateContext);

  // DEBUG
  React.useEffect(() => {
    window.dbg = {
      bustPlayer,
      endGame,
      pickDiamino,
      setDice: dbgSetDice,
    };
  }, [bustPlayer, endGame, pickDiamino, dbgSetDice]);
  // DEBUG

  const handleOpenSettings = () => openSettings(false);

  return (
    <div className={styles.game}>
      <Diaminoes />
      <AudioButton
        className={clsx("action icon", styles.settings)}
        onClick={handleOpenSettings}
      >
        <Image alt="Settings icon" src={settingsIcon} />
      </AudioButton>
      <DiceTrack />
      <Players />
    </div>
  );
};

export default Game;
