import { Buffer as Buff } from "buffer";
import gs from "generate-schema";
import { useCallback } from "react";
import ConversionWrapper from "../components/ConversionWrapper";

window.Buffer = window.Buffer || Buff;
const DEFAULT = `
{
  "id": 1,
  "name": "Confience Osonwa"
}
`;

export default function JsonToMongoose() {
  const transformer = useCallback(async ({ value }: { value: string }) => {
    return JSON.stringify(gs.mongoose(JSON.parse(value)), null, 2);
  }, []);

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
