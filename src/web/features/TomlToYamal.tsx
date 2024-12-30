import toml from "@iarna/toml";
import { useCallback } from "react";
import yaml from "yaml";
import ConversionWrapper from "../components/ConversionWrapper";

export default function TomlToYaml() {
  const transformer = useCallback(
    ({ value }: { value: string }) =>
      Promise.resolve(yaml.stringify(toml.parse(value))),
    []
  );

  return (
    <ConversionWrapper
      transformer={transformer}
      title="TOML to YAML"
      language="toml"
      resultTitle="YAML"
      resultLanguage={"yaml"}
    />
  );
}
