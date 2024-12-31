import gs from "generate-schema";
import { useCallback } from "react";
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
  const transformer = useCallback(({ value }: { value: string }) => {
    return gs.mysql(JSON.parse(value));
  }, []);

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
