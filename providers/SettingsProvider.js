import { DIAMINOES_COUNT, DIAMINOES_NUMBER_START } from "../helpers/constants";
import { loadSettings, storeSettings } from "../helpers/settings";
import React from "react";
import Settings from "../components/Settings";

export const SettingsContext = React.createContext();

const DEFAULT_SETTINGS = Object.freeze({
  diaminoMaxNumber: DIAMINOES_NUMBER_START + DIAMINOES_COUNT - 1,
  showScore: false,
  sound: true,
  stealHint: true,
});

const SettingsProvider = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isInitializing, setIsInitializing] = React.useState(false);
  const [settings, setSettings] = React.useState(() =>
    loadSettings(DEFAULT_SETTINGS),
  );

  const openSettings = React.useCallback((inMenu) => {
    setIsInitializing(inMenu);
    setIsOpen(true);
  }, []);

  const closeSettings = React.useCallback(() => setIsOpen(false), []);

  const saveSettings = React.useCallback(
    (newSettings) => {
      setIsOpen(false);
      setSettings(newSettings);
      storeSettings(newSettings);
    },
    [settings],
  );

  const value = React.useMemo(
    () => ({
      defaultSettings: DEFAULT_SETTINGS,
      isInitializing,
      openSettings,
      settings,
    }),
    [isInitializing, openSettings, settings],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
      {isOpen && (
        <Settings
          onCloseSettings={closeSettings}
          onSaveSettings={saveSettings}
          settings={settings}
        />
      )}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
