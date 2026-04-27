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

export default function JsonToMysql() {
  const transformer = ({value}:{value: string})=> Promise.resolve(transformers["json_to_mysql"](value));

  return (
    <ConversionWrapper
      transformer={transformer}
      title="JSON to Sql"
      language="json"
      resultTitle="MySQL Schema"
      resultLanguage={"sql"}
      defaultValue={DEFAULT.trim()}
    />
  );
}
