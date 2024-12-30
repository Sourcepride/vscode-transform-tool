import gs from "generate-schema";
import { useCallback } from "react";
import ConversionWrapper from "../components/ConversionWrapper";

export default function JsonToMysql() {
  const transformer = useCallback(({ value }: { value: string }) => {
    const v = gs.mysql(JSON.parse(value));
    console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", v);
    return v;
  }, []);

  return (
    <ConversionWrapper
      transformer={transformer}
      title="JSON to Sql"
      language="json"
      resultTitle="MySQL Schema"
      resultLanguage={"sql"}
    />
  );
}
