import { prettifyCore } from "@/src/utils/prettifyCore";

const _self = self as unknown as DedicatedWorkerGlobalScope;

_self.onmessage = (ev: MessageEvent) => {
  const raw = ev.data as {
    id?: number;
    payload?: { value: string; language: string };
  };
  const id = raw?.id;

  (async () => {
    try {
      const payload = raw?.payload;
      if (
        !payload ||
        typeof payload.value !== "string" ||
        typeof payload.language !== "string"
      ) {
        _self.postMessage({
          id,
          err: "Invalid formatter request (missing value or language).",
        });
        return;
      }
      const out = await prettifyCore(payload.language, payload.value);
      _self.postMessage({ id, payload: out });
    } catch (e) {
      _self.postMessage({
        id,
        err: e instanceof Error ? e.message : String(e),
      });
    }
  })();
};
