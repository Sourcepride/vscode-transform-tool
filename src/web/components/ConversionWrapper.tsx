import { getWorker } from "@/src/utils/workerWrapper";
import { useState } from "react";
import PrettierWorker from "../../workers/prettier.worker?worker";
import { transformer } from "../types";
import EditorDivider from "./EditorDivider";
import EditorPanel from "./EditorPanel";

let prettierWorker: Worker;

type ConversionWrapperProps = {
  transformer: transformer;
  title: string;
  language: string;
  resultTitle: string;
  resultLanguage: string;
  splitScreen?: boolean;
};

const ConversionWrapper: React.FC<ConversionWrapperProps> = ({
  language,
  resultLanguage,
  resultTitle,
  title,
  transformer,
  splitScreen = true,
}) => {
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
        if (event.data?.payload) {
          setMessage("");
          setTransformedResult(event.data.payload);
        } else {
          setMessage(event.data?.err || "an error occurred could not format!");
        }
      };
    } catch (error) {
      console.error(error);
      setMessage((error as Error).message);
    }
    setIsWorking(false);
  };

  console.log(
    "||||||||||||||||||||||||||||||||||||||",
    transformedResult,
    "\n",
    message
  );

  return (
    <div className="w-full h-full">
      <section className={`w-full  grid-cols-2 ${splitScreen && "grid"}`}>
        {splitScreen && (
          <div className="w-full">
            <EditorPanel
              language={language}
              defaultValue="{}"
              editable
              changeHandler={changeHandler}
            />
            <EditorDivider />
          </div>
        )}
        <EditorPanel
          language={resultLanguage}
          defaultValue={transformedResult || "interface Root {}"}
          editable
          changeHandler={() => null}
        />
      </section>
    </div>
  );
};

export default ConversionWrapper;
