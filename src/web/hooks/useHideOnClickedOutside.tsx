import { useEffect, useRef } from "react";

export default function useHideOnClickedOutside<T>(handlerLogic: T) {
  const modalRef = useRef<HTMLInputElement>(null);

  const handler = (event: MouseEvent) => {
    const element = event.target as HTMLElement;
    if (modalRef.current !== null)
      if (!modalRef.current.contains(element)) {
        if (typeof handlerLogic === "function") handlerLogic(element);
      }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return modalRef;
}
