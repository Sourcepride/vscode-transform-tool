import { jsonToEnv } from "@sourcepride/json-to-env";
import { yamlToEnv } from "@sourcepride/yaml-to-env";
import gs from "generate-schema";
import JsonToTS from "json-to-ts";
import { jsonToZod } from "json-to-zod";
import JSON5 from "json5";
import { parse as tomlParse, stringify as tomlStringify } from "smol-toml";
import yaml from "yaml";
import { Parser as Json2CsvParser } from "@json2csv/plainjs";
import {
  toGo,
  toJava,
  toNode,
  toNodeAxios,
  toPython,
} from "curlconverter";
import convertCsvToJson from "convert-csv-to-json";
import { CssToTailwindTranslator } from "css-to-tailwind-translator";
import * as HtmlToReact from "html-to-react";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LANGUAGE_MAP } from "./constants";

convertCsvToJson.supportQuotedField(true);
convertCsvToJson.formatValueByType(true);

const htmlToReactParser = HtmlToReact.Parser();

export type TransformInput = keyof typeof LANGUAGE_MAP;

const wrapCurlConverter = (
  convert: (curl: string) => string,
  input: string,
): string => {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Input cannot be empty. Paste a curl command.");
  }
  try {
    return convert(trimmed);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(
      `Could not parse curl command: ${msg}. Ensure the input starts with curl and uses supported HTTP options.`,
    );
  }
};

const safeParseJavaScriptObject = (input: string): unknown => {
  const trimmed = input.trim();
  try {
    return JSON5.parse(trimmed);
  } catch {
    throw new Error(
      "Input must be a JavaScript object literal (enclosed in {})",
    );
  }
};

const getGraphQLType = (value: any): string => {
  if (value === null) {
    return "String";
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[String]";
    }
    return `[${getGraphQLType(value[0])}]`;
  }
  if (typeof value === "object") {
    return "Object";
  }
  if (typeof value === "string") {
    return "String";
  }
  if (typeof value === "number") {
    return Number.isInteger(value) ? "Int" : "Float";
  }
  if (typeof value === "boolean") {
    return "Boolean";
  }
  return "String";
};

const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const generateGraphQLSchema = (
  obj: any,
  typeName: string = "RootType",
): string => {
  const types: string[] = [];
  const processedTypes = new Set<string>();

  const processObject = (data: any, _currentTypeName: string): string[] => {
    const fields: string[] = [];

    for (const [key, value] of Object.entries(data)) {
      if (value === null) {
        fields.push(`  ${key}: String`);
      } else if (Array.isArray(value)) {
        if (
          value.length > 0 &&
          typeof value[0] === "object" &&
          value[0] !== null
        ) {
          const nestedTypeName = capitalizeFirstLetter(key);
          if (!processedTypes.has(nestedTypeName)) {
            processedTypes.add(nestedTypeName);
            const nestedFields = processObject(value[0], nestedTypeName);
            types.push(
              `type ${nestedTypeName} {\n${nestedFields.join("\n")}\n}`,
            );
          }
          fields.push(`  ${key}: [${nestedTypeName}]`);
        } else {
          const elementType =
            value.length > 0 ? getGraphQLType(value[0]) : "String";
          fields.push(`  ${key}: [${elementType}]`);
        }
      } else if (typeof value === "object") {
        const nestedTypeName = capitalizeFirstLetter(key);
        if (!processedTypes.has(nestedTypeName)) {
          processedTypes.add(nestedTypeName);
          const nestedFields = processObject(value, nestedTypeName);
          types.push(`type ${nestedTypeName} {\n${nestedFields.join("\n")}\n}`);
        }
        fields.push(`  ${key}: ${nestedTypeName}`);
      } else {
        const fieldType = getGraphQLType(value);
        fields.push(`  ${key}: ${fieldType}`);
      }
    }

    return fields;
  };

  const rootFields = processObject(obj, typeName);
  const rootType = `type ${typeName} {\n${rootFields.join("\n")}\n}`;

  return [rootType, ...types].join("\n\n");
};

const jsonToGraphQLSchema = (jsonString: string): string => {
  const parsed = JSON.parse(jsonString);
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Input must be a JSON object");
  }
  return generateGraphQLSchema(parsed);
};

const htmlToReactTsx = (input: string): string => {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Input cannot be empty. Paste HTML markup.");
  }
  try {
    const reactTree = htmlToReactParser.parse(trimmed);
    const wrapped = React.createElement(React.Fragment, null, reactTree);
    let markup = renderToStaticMarkup(wrapped);
    markup = markup
      .replace(/\bclass=/g, "className=")
      .replace(/\bfor=/g, "htmlFor=");
    const indented = markup
      .split("\n")
      .map((line) => `      ${line}`)
      .join("\n");
    return `export default function ConvertedFromHtml() {
  return (
    <>
${indented}
    </>
  );
}
`;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`Could not parse HTML: ${msg}`);
  }
};

const cssToTailwindString = (input: string): string => {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Input cannot be empty. Paste CSS rules.");
  }
  const { code, data } = CssToTailwindTranslator(trimmed);
  if (code !== "OK") {
    throw new Error(
      "Could not translate CSS (syntax error or unsupported rules).",
    );
  }
  if (!data.length) {
    return "/* No Tailwind classes were produced. Try simple declarations (width, margin, colors, flex, etc.). */\n";
  }
  return (
    data
      .map(
        (row) =>
          `/* ${row.selectorName} */\n${row.resultVal.trim()}`,
      )
      .join("\n\n") + "\n"
  );
};

export const transformers: Record<TransformInput, (input: string) => string> = {
  json_to_typescript: (input: string) => {
    try {
      let result = "";
      JsonToTS(JSON.parse(input)).forEach((typeInterface: string) => {
        result += `${typeInterface}\n`;
      });
      return result;
    } catch (error) {
      throw new Error(
        `Invalid JSON input. Expected valid JSON like: {"name": "John", "age": 30}`,
      );
    }
  },

  json_to_zod: (input: string) => {
    try {
      return jsonToZod(JSON.parse(input));
    } catch (error) {
      throw new Error(
        `Invalid JSON input. Expected valid JSON like: {"name": "John", "age": 30}`,
      );
    }
  },

  json_to_graphql: (input: string) => {
    try {
      return jsonToGraphQLSchema(input);
    } catch (error) {
      throw new Error(
        `Invalid JSON input. Expected a valid JSON object like: {"user": {"name": "John"}}`,
      );
    }
  },

  json_to_mysql: (input: string) => {
    try {
      return gs.mysql(JSON.parse(input));
    } catch (error) {
      throw new Error(
        `Invalid JSON input. Expected valid JSON like: {"id": 1, "name": "John"}`,
      );
    }
  },

  json_to_mongoose: (input: string) => {
    try {
      return JSON.stringify(gs.mongoose(JSON.parse(input)), null, 2);
    } catch (error) {
      throw new Error(
        `Invalid JSON input. Expected valid JSON like: {"name": "John", "age": 30}`,
      );
    }
  },

  js_object_to_json: (input: string) => {
    const parsed = safeParseJavaScriptObject(input);
    return JSON.stringify(parsed, null, 2);
  },

  js_object_to_typescript: (input: string) => {
    const parsed = safeParseJavaScriptObject(input);
    const jsonString = JSON.stringify(parsed, null, 2);
    let result = "";
    JsonToTS(JSON.parse(jsonString)).forEach((typeInterface: string) => {
      result += `${typeInterface}\n`;
    });
    return result;
  },

  yaml_to_json: (input: string) => {
    try {
      return JSON.stringify(yaml.parse(input), null, 2);
    } catch (error) {
      throw new Error(
        `Invalid YAML input. Expected valid YAML like:\nname: John\nage: 30`,
      );
    }
  },

  yaml_to_toml: (input: string) => {
    try {
      return tomlStringify(yaml.parse(input));
    } catch (error) {
      throw new Error(
        `Invalid YAML input. Expected valid YAML like:\nname: John\nage: 30`,
      );
    }
  },

  toml_to_yamal: (input: string) => {
    try {
      return yaml.stringify(tomlParse(input));
    } catch (error) {
      throw new Error(
        `Invalid TOML input. Expected valid TOML like:\nname = "John"\nage = 30`,
      );
    }
  },

  toml_to_json: (input: string) => {
    try {
      return JSON.stringify(tomlParse(input), null, 2);
    } catch (error) {
      throw new Error(
        `Invalid TOML input. Expected valid TOML like:\nname = "John"\nage = 30`,
      );
    }
  },

  json_to_env: (input: string) => {
    try {
      return jsonToEnv(input);
    } catch {
      throw new Error(
        `Invalid JSON input. Expected a JSON object like: {"API_KEY": "abc", "PORT": 8080}`,
      );
    }
  },
  yaml_to_env: (input: string) => {
    try {
      return yamlToEnv(input);
    } catch {
      throw new Error(
        `Invalid YAML input. Expected YAML like:\nAPI_KEY: your-key\nPORT: 8080`,
      );
    }
  },

  curl_to_node_axios: (input: string) =>
    wrapCurlConverter(toNodeAxios, input),
  curl_to_node: (input: string) => wrapCurlConverter(toNode, input),
  curl_to_python: (input: string) => wrapCurlConverter(toPython, input),
  curl_to_go: (input: string) => wrapCurlConverter(toGo, input),
  curl_to_java: (input: string) => wrapCurlConverter(toJava, input),

  csv_to_json: (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) {
      throw new Error("Input cannot be empty. Paste CSV text with a header row.");
    }
    try {
      const rows = convertCsvToJson.csvStringToJson(trimmed);
      return JSON.stringify(rows, null, 2);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error(
        `Invalid CSV input. Expected RFC-4180-style CSV with a header row, e.g.:\nname,age\nAlice,30\n\n(${msg})`,
      );
    }
  },

  json_to_csv: (input: string) => {
    try {
      const parsed = JSON.parse(input);
      const rows = Array.isArray(parsed) ? parsed : [parsed];
      if (rows.length === 0) {
        return "";
      }
      const first = rows[0];
      if (typeof first !== "object" || first === null) {
        throw new Error(
          "JSON must be an array of objects, or a single object, to convert to CSV.",
        );
      }
      return new Json2CsvParser({ eol: "\n" }).parse(rows);
    } catch (e) {
      if (
        e instanceof Error &&
        e.message.includes("JSON must be an array of objects")
      ) {
        throw e;
      }
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error(
        `Invalid JSON for CSV export. Expected an array of objects like:\n[{"name":"Alice","age":30},{"name":"Bob","age":25}]\n\n(${msg})`,
      );
    }
  },

  html_to_react: (input: string) => htmlToReactTsx(input),

  css_to_tailwind: (input: string) => cssToTailwindString(input),
};
