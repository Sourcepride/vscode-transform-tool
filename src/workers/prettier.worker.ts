import { prettify } from "@/src/utils/prettify";
import { BuiltInParserName } from "prettier";

interface Data {
  data: {
    payload: {
      value: string;
      language: BuiltInParserName;
    };
    id: string | number;
  };
}

const _self = self as any;

_self.onmessage = ({
  data: {
    payload: { value, language },
    id,
  },
}: Data) => {
  (async function () {
    try {
      const payload = await prettify(language, value);

      _self.postMessage({
        id,
        payload,
      });
    } catch (e) {
      _self.postMessage({
        id,
        err: (e as Error).message,
      });
    }
  })();
};
