import { Settings } from "../types";
import useMessage from "./useMessage";

const DEFAULT_SETTINGS: Settings = {
  currentTheme: "dark",
  panels: "2",
  fontFamily: "monospace, sans-serif",
  fontSize: 12,
  fontWeight: "normal",
  tool: "json_to_typescript",
};

const useSettings = () => {
  //TODO: get updated settings from message api
  const updatedSettings = useMessage("theme"); //useSyncExternalStore(subscribe, getSnapShot);
  let currentSettings = (window as any).viewSettings || DEFAULT_SETTINGS;
  if (updatedSettings) {
    try {
      currentSettings = JSON.parse(updatedSettings);
    } catch (_) {}
  }
  return currentSettings as Settings;
};

export default useSettings;
