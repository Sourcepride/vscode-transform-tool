import { transformers } from "@/src/transformers";
import ConversionWrapper from "../components/ConversionWrapper";

const DEFAULT = "{chima: [1,2,3]}";


export default function JsObjectToTypescript() {
  const name = "JS Object to Typescript";

  const transformer = ({value}:{value: string})=> Promise.resolve(transformers["js_object_to_typescript"](value));

  return (
    <ConversionWrapper
      transformer={transformer}
      title={name}
      language="javascript"
      resultTitle="TypeScript"
      resultLanguage={"typescript"}
      defaultValue={DEFAULT.trim()}
    />
  );
}
