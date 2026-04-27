import { transformers } from "@/src/transformers";
import { Buffer as Buff } from "buffer";
import ConversionWrapper from "../components/ConversionWrapper";

window.Buffer = window.Buffer || Buff;
const DEFAULT = `
{
  "id": 1,
  "name": "Confience Osonwa"
}
`.trim();

export default function JsonToMongoose() {
  const transformer = ({value}:{value: string})=> Promise.resolve(transformers["json_to_mongoose"](value))
  return (
    <ConversionWrapper
      transformer={transformer}
      title="JSON to Mongose Schema"
      language="json"
      resultTitle="Mongoose Schema"
      resultLanguage={"json"}
      defaultValue={DEFAULT}
    />
  );
}
