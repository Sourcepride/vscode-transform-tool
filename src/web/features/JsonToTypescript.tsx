import { transformers } from "@/src/transformers";
import ConversionWrapper from "../components/ConversionWrapper";


const DEFAULT = `
{
  "name": "Okoro Patience",
  "department": "Science Laboratory Technology",
  "college": "Micheal Okpara University Of Agriculture"
}
`;

const JsonToTypescript= () => {
  
  const transformer = ({value}:{value: string})=> Promise.resolve(transformers["json_to_typescript"](value));

  return (
    <ConversionWrapper
      transformer={transformer}
      title="JSON to typescript"
      language="json"
      resultTitle="TypeScript"
      resultLanguage={"typescript"}
      defaultValue={DEFAULT.trim()}
    />
  );
};

export default JsonToTypescript;
