import { transformers } from "@/src/transformers";
import ConversionWrapper from "../components/ConversionWrapper";

const DEFAULT = "{hello: {nice: '123'}}";

export default function JsObjectToJson() {
 const transformer = ({value}:{value: string})=> Promise.resolve(transformers["js_object_to_json"](value));

  return (
    <ConversionWrapper
      transformer={transformer}
      title="JS Object to Json"
      language="javascript"
      defaultValue={DEFAULT.trim()}
      resultTitle="JSON"
      resultLanguage={"json"}
    />
  );
}
