import { getWorker } from "@/src/utils/workerWrapper";
import { useRef, useState } from "react";
import PrettierWorker from "../../workers/prettier.worker?worker";
import useSettings from "../hooks/useSettings";
import { transformer } from "../types";
import EditorPanel from "./EditorPanel";
import ErrorMessage from "./ErrorMessage";
import Loading from "./Loading";

const FORMAT_TIMEOUT_MS = 60_000;

type ConversionWrapperProps = {
  transformer: transformer;
  title: string;
  language: string;
  resultTitle: string;
  resultLanguage: string;
  defaultValue?: string;
  defaultResult?: string;
};

const ConversionWrapper: React.FC<ConversionWrapperProps> = ({
  language,
  resultLanguage,
  defaultResult: defaultResultValue,
  defaultValue,
  title,
  transformer,
}) => {
  const countRef = useRef(0);
  const settings = useSettings();
  const [transformedResult, setTransformedResult] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [message, setMessage] = useState("");

  const workerRef = useRef<Worker | null>(null);
  const workerInitRef = useRef<Promise<Worker> | null>(null);
  const latestRequestIdRef = useRef(0);
  const formatTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearFormatTimeout = () => {
    if (formatTimeoutRef.current) {
      clearTimeout(formatTimeoutRef.current);
      formatTimeoutRef.current = null;
    }
  };

  const ensurePrettierWorker = async (): Promise<Worker> => {
    if (workerRef.current) {
      return workerRef.current;
    }
    if (!workerInitRef.current) {
      workerInitRef.current = (async () => {
        const w = await getWorker(PrettierWorker, "prettierUri");
        w.onmessage = (event: MessageEvent) => {
          clearFormatTimeout();
          const { id, payload, err } = (event.data || {}) as {
            id?: number;
            payload?: string;
            err?: string;
          };
          if (typeof id === "number" && id !== latestRequestIdRef.current) {
            return;
          }
          setIsWorking(false);
          if (payload !== undefined && payload !== null) {
            setMessage("");
            setTransformedResult(payload);
          } else {
            setMessage(err || "Could not format output.");
          }
        };
        w.onerror = (e) => {
          clearFormatTimeout();
          setIsWorking(false);
          setMessage(
            e.message || "Formatter worker failed (see console for details)."
          );
        };
        workerRef.current = w;
        return w;
      })();
    }
    return workerInitRef.current;
  };

  const changeHandler = async (value: string) => {
    const requestId = ++latestRequestIdRef.current;
    clearFormatTimeout();
    formatTimeoutRef.current = setTimeout(() => {
      if (requestId !== latestRequestIdRef.current) {
        return;
      }
      setIsWorking(false);
      setMessage("Formatting timed out; try a smaller snippet or again later.");
      formatTimeoutRef.current = null;
    }, FORMAT_TIMEOUT_MS);

    try {
      setIsWorking(true);
      setMessage("");
      const result = await transformer({ value });
      const lang = (resultLanguage || "").toLowerCase();

      if (lang === "python") {
        const { prettify } = await import("@/src/utils/prettify");
        const out = await prettify(resultLanguage, result);
        clearFormatTimeout();
        if (requestId !== latestRequestIdRef.current) {
          return;
        }
        setIsWorking(false);
        setMessage("");
        setTransformedResult(out);
        return;
      }

      const w = await ensurePrettierWorker();
      w.postMessage({
        id: requestId,
        payload: { value: result, language: resultLanguage },
      });
    } catch (error) {
      clearFormatTimeout();
      setIsWorking(false);
      console.error(error);
      setMessage((error as Error).message ?? String(error));
    }
  };

  if (countRef.current < 1) {
    countRef.current = countRef.current + 1;
    changeHandler(settings.initialContent || defaultValue || "");
  }

  const splitScreen = settings.panels === "2";

  return (
    <div className="w-full h-full">
      <section className={`w-full  grid-cols-2 ${splitScreen && "grid"}`}>
        {splitScreen && (
          <EditorPanel
            title={title}
            language={language}
            defaultValue={defaultValue || "{}"}
            editable
            changeHandler={changeHandler}
          />
        )}
        <>
          {isWorking && (
            <div className="w-full h-full grid place-items-center">
              <div>
                <Loading />
                <p className="py-2 italic font-medium">on it...</p>
              </div>
            </div>
          )}

          {
            <div className={`block ${isWorking && "hidden"}`}>
              <EditorPanel
                language={resultLanguage}
                defaultValue={
                  transformedResult || defaultResultValue || "interface Root {}"
                }
                editable
                changeHandler={() => null}
              />
            </div>
          }
        </>
        {message && <ErrorMessage message={message} />}
      </section>
    </div>
  );
};

export default ConversionWrapper;
