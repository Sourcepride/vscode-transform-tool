import { useSyncExternalStore } from "react";

const useHeightChange = () => {
  return useSyncExternalStore(subscribe, getSnapShot);
};

export default useHeightChange;

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback);

  return () => window.removeEventListener("resize", callback);
}

function getSnapShot() {
  return window.innerHeight;
}
