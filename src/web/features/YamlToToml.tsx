import { transformers } from "@/src/transformers";
import ConversionWrapper from "../components/ConversionWrapper";

const DEFAULT = `spaceX: "Elon"`;
export default function YamlToToml() {
 const transformer = ({value}:{value: string})=> Promise.resolve(transformers["yaml_to_toml"](value));
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
