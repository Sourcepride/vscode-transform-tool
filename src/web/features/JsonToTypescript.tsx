import JsonToTS from "json-to-ts";
import { useCallback } from "react";
import ConversionWrapper from "../components/ConversionWrapper";

type JsonToTypescriptProps = {};
const JsonToTypescript: React.FC<JsonToTypescriptProps> = ({}) => {
  const transformer = useCallback(async ({ value }: { value: string }) => {
    let stringResult = "";
    JsonToTS(JSON.parse(value)).forEach((typeInterface) => {
      stringResult += `${typeInterface} \n`;
    });
    // TODO:FEATURE use settings to convert interphase to type
    return stringResult;
  }, []);

  return (
    <ConversionWrapper
      transformer={transformer}
      title="JSON to typescript"
      language="json"
      resultTitle="TypeScript"
      resultLanguage={"typescript"}
    />
  );
};

export default JsonToTypescript;
