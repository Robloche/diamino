import AudioButton from "../AudioButton";
import Modal from "../Modal";
import React from "react";
import { SettingsContext } from "../../providers/SettingsProvider";
import styles from "./Settings.module.css";
import {
  DIAMINOES_COUNT,
  DIAMINOES_NUMBER_START,
} from "../../helpers/constants";

const Settings = ({ onCloseSettings, onSaveSettings, settings }) => {
  const [diaminoMaxNumber, setDiaminoMaxNumber] = React.useState(
    settings.diaminoMaxNumber,
  );
  const [showScore, setShowScore] = React.useState(settings.showScore);
  const [sound, setSound] = React.useState(settings.sound);
  const [stealHint, setStealHint] = React.useState(settings.stealHint);

  const { defaultSettings, isInitializing } = React.useContext(SettingsContext);

  const diaminoMaxNumberId = React.useId();
  const showScoreId = React.useId();
  const soundId = React.useId();
  const stealHintId = React.useId();

  const diaminoMaxNumberOnChange = React.useCallback((event) => {
    setDiaminoMaxNumber(event.target.value);
  }, []);

  const showScoreOnChange = React.useCallback((event) => {
    setShowScore(event.target.checked);
  }, []);

  const stealHintOnChange = React.useCallback((event) => {
    setStealHint(event.target.checked);
  }, []);

  const soundOnChange = React.useCallback((event) => {
    setSound(event.target.checked);
  }, []);

  const resetOnClick = React.useCallback(() => {
    setDiaminoMaxNumber(defaultSettings.diaminoMaxNumber);
    setShowScore(defaultSettings.showScore);
    setStealHint(defaultSettings.stealHint);
    setSound(defaultSettings.sound);
  }, [
    defaultSettings.diaminoMaxNumber,
    defaultSettings.showScore,
    defaultSettings.sound,
    defaultSettings.stealHint,
  ]);

  const saveOnClick = React.useCallback(() => {
    onSaveSettings({ diaminoMaxNumber, showScore, sound, stealHint });
  }, [diaminoMaxNumber, showScore, sound, stealHint]);

  console.log(isInitializing);

  return (
    <Modal label="Settings" onClose={onCloseSettings}>
      <div className={styles.content}>
        <label htmlFor={diaminoMaxNumberId} className={styles.label}>
          Max diamino:
        </label>
        <input
          disabled={!isInitializing}
          id={diaminoMaxNumberId}
          max={40}
          min={21}
          onChange={diaminoMaxNumberOnChange}
          type="number"
          value={diaminoMaxNumber}
        />
        <label htmlFor={showScoreId} className={styles.label}>
          Show scores while playing:
        </label>
        <input
          checked={showScore}
          id={showScoreId}
          onChange={showScoreOnChange}
          type="checkbox"
        />
        <label htmlFor={stealHintId}>Show stealable diaminoes:</label>
        <input
          checked={stealHint}
          id={stealHintId}
          onChange={stealHintOnChange}
          type="checkbox"
        />
        <label htmlFor={soundId} className={styles.label}>
          Enable sound:
        </label>
        <input
          checked={sound}
          id={soundId}
          onChange={soundOnChange}
          type="checkbox"
        />
      </div>
      <div className={styles.dangerZone}>
        <div>Reset all settings</div>
        <AudioButton
          className={`action danger ${styles.resetBtn}`}
          onClick={resetOnClick}
        >
          Reset
        </AudioButton>
      </div>
      <AudioButton className={`action ${styles.saveBtn}`} onClick={saveOnClick}>
        SAVE & CLOSE
      </AudioButton>
    </Modal>
  );
};

export default Settings;
