import { getWorker } from "@/src/utils/workerWrapper";
import { useRef, useState } from "react";
import PrettierWorker from "../../workers/prettier.worker?worker";
import { transformer } from "../types";
import EditorPanel from "./EditorPanel";
import ErrorMessage from "./ErrorMessage";
import Loading from "./Loading";

let prettierWorker: Worker;

type ConversionWrapperProps = {
  transformer: transformer;
  title: string;
  language: string;
  resultTitle: string;
  resultLanguage: string;
  splitScreen?: boolean;
  defaultValue?: string;
  defaultResult?: string;
};

const ConversionWrapper: React.FC<ConversionWrapperProps> = ({
  language,
  resultLanguage,
  // resultTitle,
  defaultResult: defaultResultValue,
  defaultValue,
  title,
  transformer,
  splitScreen = true,
}) => {
  const countRef = useRef(0);
  const [transformedResult, setTransformedResult] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [message, setMessage] = useState("");

  const changeHandler = async (value: string) => {
    try {
      setIsWorking(true);
      const result = await transformer({ value });
      prettierWorker =
        prettierWorker || (await getWorker(PrettierWorker, "prettierUri"));

      prettierWorker.postMessage({
        id: new Date().toISOString(),
        payload: { value: result, language: resultLanguage },
      });

      prettierWorker.onmessage = (event) => {
        setIsWorking(false);
        if (event.data?.payload) {
          setMessage("");
          setTransformedResult(event.data.payload);
        } else {
          setMessage(event.data?.err || "an error occurred could not format!");
        }
      };
    } catch (error) {
      setIsWorking(false);
      console.error(error);
      setMessage((error as Error).message);
    }
  };

  if (countRef.current < 1) {
    countRef.current = countRef.current + 1;
    changeHandler(defaultValue || "");
  }

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
