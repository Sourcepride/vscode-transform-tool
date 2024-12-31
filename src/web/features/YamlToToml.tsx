import toml from "@iarna/toml";
import { useCallback } from "react";
import yaml from "yaml";
import ConversionWrapper from "../components/ConversionWrapper";

const DEFAULT = `spaceX: "Elon"`;
export default function YamlToToml() {
  const transformer = useCallback(async ({ value }: { value: string }) => {
    return toml.stringify(yaml.parse(value));
  }, []);

  return (
    <ConversionWrapper
      transformer={transformer}
      title="YAML to TOML"
      language="yaml"
      resultTitle="TOML"
      resultLanguage={"toml"}
      defaultValue={DEFAULT.trim()}
    />
  );
}
