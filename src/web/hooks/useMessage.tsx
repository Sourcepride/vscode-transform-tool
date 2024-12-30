import { useEffect, useState } from "react";

function getSnapShot(command: string, callback: (val: any) => void) {
  return (event: MessageEvent<any>) => {
    const message = event.data; // The JSON data our extension sent

    if (message?.command === command) {
      return callback(message?.payload);
    }
  };
}

const useMessage = (targetCommand: string) => {
  const [state, setState] = useState(undefined);

  useEffect(() => {
    const callback = getSnapShot(targetCommand, setState);
    window.addEventListener("message", callback);
    return () => window.removeEventListener("message", callback);
  }, [targetCommand]);

  return state;
};

export default useMessage;
