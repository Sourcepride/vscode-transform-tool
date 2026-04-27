import { transformers } from "@/src/transformers";
import ConversionWrapper from "../components/ConversionWrapper";

const DEFAULT = `
{
  "id": 1,
  "name": "Confience Osonwa",
  "teamMates": ["Marvi", "Goody"],
  "team": "Nigeria"
}
`;

export default function JsonToZod() {
  const name = "JSON to Zod Schema";

const transformer = ({value}:{value: string})=> Promise.resolve(transformers["json_to_zod"](value));

  return (
    <ConversionWrapper
      transformer={transformer}
      title={name}
      language="json"
      resultTitle="Zod Schema"
      resultLanguage={"typescript"}
      defaultValue={DEFAULT.trim()}
    />
  );
}
