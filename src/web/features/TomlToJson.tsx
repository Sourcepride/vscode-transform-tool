import { transformers } from "@/src/transformers";
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

export default function TomlToJson() {
  const transformer = ({value}:{value: string})=> Promise.resolve(transformers["toml_to_json"](value));

  return (
    <ConversionWrapper
      transformer={transformer}
      title="TOML to Json"
      language="toml"
      resultTitle="JSON"
      resultLanguage={"json"}
      defaultValue={DEFAULT.trim()}
    />
  );
}
