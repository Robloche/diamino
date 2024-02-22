import AudioButton from "../AudioButton";
import Modal from "../Modal";
import React from "react";
import { SettingsContext } from "../../providers/SettingsProvider";
import styles from "./Settings.module.css";

const Settings = ({ onCloseSettings, onSaveSettings, settings }) => {
  const [sound, setSound] = React.useState(settings.sound);
  const [stealHint, setStealHint] = React.useState(settings.stealHint);

  const { defaultSettings } = React.useContext(SettingsContext);

  const soundId = React.useId();
  const stealHintId = React.useId();

  const soundOnChange = React.useCallback((event) => {
    setSound(event.target.checked);
  }, []);

  const stealHintOnChange = React.useCallback((event) => {
    setStealHint(event.target.checked);
  }, []);

  const resetOnClick = React.useCallback(() => {
    setSound(defaultSettings.sound);
    setStealHint(defaultSettings.stealHint);
  }, [defaultSettings.sound, defaultSettings.stealHint]);

  const saveOnClick = React.useCallback(() => {
    onSaveSettings({ sound, stealHint });
  }, [sound, stealHint]);

  return (
    <Modal label="Settings" onClose={onCloseSettings}>
      <div className={styles.content}>
        <label htmlFor={soundId} className={styles.label}>
          Enable sound:
        </label>
        <input
          checked={sound}
          id={soundId}
          onChange={soundOnChange}
          type="checkbox"
        />
        <label htmlFor={stealHintId}>Show stealable diaminoes:</label>
        <input
          checked={stealHint}
          id={stealHintId}
          onChange={stealHintOnChange}
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
        Save & Close
      </AudioButton>
    </Modal>
  );
};

export default Settings;
