import Die from "../Die";
import { DieState } from "../../helpers/types";
import { GameStateContext } from "../../providers/GameStateProvider";
import React from "react";
import styles from "./DiceTrack.module.css";

const DiceTrack = () => {
  const { dice } = React.useContext(GameStateContext);

  const keptDice = dice.filter((die) => die.state === DieState.Kept);
  const playArea = dice.filter((die) => die.state !== DieState.Kept);

  console.log(dice);

  return (
    <div className={styles.diceTrack}>
      <div className={styles.keptArea}>
        {keptDice.map((die, i) => (
          <Die die={die} key={i} />
        ))}
      </div>
      <div className={styles.playArea}>
        {playArea.map((die, i) => (
          <Die die={die} key={i} />
        ))}
      </div>
      <div className={styles.gameNameWrapper}>
        <div className={styles.gameName}>💎 DIAMINO 💎</div>
      </div>
    </div>
  );
};

export default DiceTrack;
