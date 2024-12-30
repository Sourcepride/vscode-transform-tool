import { useCallback } from "react";
import ConversionWrapper from "../components/ConversionWrapper";

const DEFAULT = "{hello: {nice: '123'}}";

export default function JsObjectToJson() {
  const transformer = useCallback(async ({ value }: { value: string }) => {
    return JSON.stringify(eval("(" + value + ")"), null, 2);
  }, []);

  return (
    <ConversionWrapper
      transformer={transformer}
      title="JS Object to Json"
      language="javascript"
      defaultValue={DEFAULT}
      resultTitle="JSON"
      resultLanguage={"json"}
    />
  );
}
