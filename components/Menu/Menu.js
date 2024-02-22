import AudioButton from "../AudioButton";
import Modal from "../Modal";
import React from "react";
import { produce } from "immer";
import styles from "./Menu.module.css";

const Menu = ({ onCloseMenu, initialPlayers }) => {
  const [players, setPlayers] = React.useState(initialPlayers);

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

  const canStart = players.filter(({ name }) => name !== "").length > 1;

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
