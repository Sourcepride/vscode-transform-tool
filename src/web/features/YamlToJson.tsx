import { transformers } from "@/src/transformers";
import ConversionWrapper from "../components/ConversionWrapper";

const DEFAULT = `okah: "corn"`;
export default function YamlToJson() {
  const transformer = ({value}:{value: string})=> Promise.resolve(transformers["yaml_to_json"](value));

  return (
    <ConversionWrapper
      transformer={transformer}
      title="YAML to Json"
      language="yaml"
      resultTitle="JSON"
      resultLanguage={"json"}
      defaultValue={DEFAULT.trim()}
    />
  );
}
