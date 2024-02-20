import { loadSettings, storeSettings } from "@/helpers/settings";
import { setRowColumnCssValues, setTileBackColorCssValue } from "@/helpers/css";
import React from "react";
import Settings from "@/components/Settings";

export const SettingsContext = React.createContext();

const DEFAULT_SETTINGS = Object.freeze({
  sound: true,
});

const SettingsProvider = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [settings, setSettings] = React.useState(() =>
    loadSettings(DEFAULT_SETTINGS),
  );

  const openSettings = React.useCallback(() => setIsOpen(true), []);

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
      openSettings,
      settings,
    }),
    [openSettings, settings],
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
