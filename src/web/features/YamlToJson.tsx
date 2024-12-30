import { useCallback } from "react";
import yaml from "yaml";
import ConversionWrapper from "../components/ConversionWrapper";

export default function YamlToJson() {
  const transformer = useCallback(async ({ value }: { value: string }) => {
    return JSON.stringify(yaml.parse(value));
  }, []);

  return (
    <ConversionWrapper
      transformer={transformer}
      title="YAML to Json"
      language="yaml"
      resultTitle="JSON"
      resultLanguage={"json"}
    />
  );
}
