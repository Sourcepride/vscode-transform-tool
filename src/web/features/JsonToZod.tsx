import { jsonToZod } from "json-to-zod";
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

export default function JsonToZod() {
  const name = "JSON to Zod Schema";

  const transformer = useCallback(async ({ value }: { value: string }) => {
    return jsonToZod(JSON.parse(value));
  }, []);

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
