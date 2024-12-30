import { parse } from "@iarna/toml";
import { useCallback } from "react";
import ConversionWrapper from "../components/ConversionWrapper";

export default function TomlToJson() {
  const transformer = useCallback(
    ({ value }: { value: string }) =>
      Promise.resolve(JSON.stringify(parse(value))),
    []
  );

  return (
    <ConversionWrapper
      transformer={transformer}
      title="TOML to Json"
      language="toml"
      resultTitle="JSON"
      resultLanguage={"json"}
    />
  );
}
