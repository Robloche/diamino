import AudioButton from "../AudioButton";
import Modal from "../Modal";
import {DIAMINOES_COUNT, DIAMINOES_NUMBER_START, PLAYER_COUNT_MAX, PLAYER_COUNT_MIN} from '../../helpers/constants';
import React from "react";
import { produce } from "immer";
import styles from "./Menu.module.css";
import {DiaminoState} from '../../helpers/types';

const Menu = ({ onCloseMenu }) => {
  const [players, setPlayers] = React.useState(() => {
    const players = [];
    for (let i = 0; i < PLAYER_COUNT_MAX; ++i) {
      players.push({
        diaminoes: [],
        name: "",
        //name: `Player ${i + 1}`,
      });
    }

    // DEBUG
    //players[0].name = "Player 1";
    // for (let index = 0; index < 6; ++index) {
    //   players[0].diaminoes.push({
    //     number: index + DIAMINOES_NUMBER_START,
    //     points: Math.floor(index / 4) + 1,
    //     state: DiaminoState.Normal,
    //   });
    // }
    //players[1].name = "Player 2";
    // for (let index = 0; index < 4; ++index) {
    //   players[1].diaminoes.push({
    //     number: index + DIAMINOES_NUMBER_START,
    //     points: Math.floor(index / 4) + 1,
    //     state: DiaminoState.Normal,
    //   });
    // }
    //DEBUG

    return players;
  });

  const handlePlayerNameOnChange = (event) => {
    const {
      target: { id, value },
    } = event;

    setPlayers(
      produce((draft) => {
        draft[id].name = value;
      }),
    );
  };

  const handleOnStart = React.useCallback(() => {
    onCloseMenu(players.filter(({ name }) => name !== ""));
  }, [onCloseMenu, players]);

  const canStart =
    players.filter(({ name }) => name !== "").length >= PLAYER_COUNT_MIN;

  return (
    <Modal canClose={false} label="Menu">
      <div className={styles.content}>
        <h1>💎 DIAMINO 💎</h1>
        <div className={styles.hint}>
          <div>Enter at least 2 names.</div>
          <div>Leave names empty to control the number of players.</div>
        </div>
        {players.map((player, i) => (
          <input
            autoComplete="off"
            id={i}
            key={i}
            onChange={handlePlayerNameOnChange}
            placeholder={`Enter a name for player ${i + 1}`}
            type="text"
            value={players[i].name}
          />
        ))}
        <AudioButton
          className="action"
          disabled={!canStart}
          onClick={handleOnStart}
        >
          START GAME
        </AudioButton>
      </div>
    </Modal>
  );
};

export default Menu;
