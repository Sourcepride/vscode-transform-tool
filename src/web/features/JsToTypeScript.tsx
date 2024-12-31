import JsonToTS from "json-to-ts";
import { useCallback } from "react";
import ConversionWrapper from "../components/ConversionWrapper";

const DEFAULT = "{chima: [1,2,3]}";
export default function JsObjectToTypescript() {
  const name = "JS Object to Typescript";

  const transformer = useCallback(async ({ value }: { value: string }) => {
    const result = JSON.stringify(eval("(" + value + ")"), null, 2);

    let stringResult = "";
    JsonToTS(JSON.parse(result)).forEach((typeInterface) => {
      stringResult += `${typeInterface} \n`;
    });
    // TODO:FEATURE use settings to convert interphase to type
    return stringResult;
  }, []);

  return (
    <ConversionWrapper
      transformer={transformer}
      title={name}
      language="javascript"
      resultTitle="TypeScript"
      resultLanguage={"typescript"}
      defaultValue={DEFAULT.trim()}
    />
  );
}
