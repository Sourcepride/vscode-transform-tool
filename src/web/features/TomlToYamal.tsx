import toml from "@iarna/toml";
import { useCallback } from "react";
import yaml from "yaml";
import ConversionWrapper from "../components/ConversionWrapper";

const DEFAULT = `
userId = 1
id = 1
title = "Uchechi"
completed = false

[company]
id = 12
name = "Osonwa Enterprise"
`;
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
      defaultValue={DEFAULT.trim()}
    />
  );
}
