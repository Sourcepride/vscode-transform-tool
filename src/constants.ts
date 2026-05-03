export const NAV = {
  Json: [
    "json_to_typescript",
    "json_to_zod",
    "json_to_graphql",
    "json_to_mysql",
    "json_to_mongoose",
  ] as const,
  env: ["json_to_env", "yaml_to_env"] as const,
  Javascript: ["js_object_to_json", "js_object_to_typescript"] as const,

  cURL: [
    "curl_to_node_axios",
    "curl_to_node",
    "curl_to_python",
    "curl_to_go",
    "curl_to_java",
  ] as const,
  Csv: ["csv_to_json", "json_to_csv"] as const,
  Web: ["html_to_react", "css_to_tailwind"] as const,
  Others: [
    "yaml_to_json",
    "yaml_to_toml",
    "toml_to_yamal",
    "toml_to_json",
  ] as const,
};

export const combinedToolsArray = [
  ...NAV.Json,
  ...NAV.env,
  ...NAV.Javascript,
  ...NAV.Others,
  ...NAV.cURL,
  ...NAV.Csv,
  ...NAV.Web,
] as const;

export const LANGUAGE_MAP = {
  json_to_typescript: "typescript",
  json_to_zod: "typescript",
  json_to_graphql: "graphql",
  json_to_mysql: "sql",
  json_to_mongoose: "json",
  js_object_to_json: "json",
  js_object_to_typescript: "typescript",
  yaml_to_json: "json",
  yaml_to_toml: "toml",
  toml_to_yamal: "yaml",
  toml_to_json: "json",
  json_to_env: "bash",
  yaml_to_env: "bash",
  curl_to_node_axios: "typescript",
  curl_to_node: "typescript",
  curl_to_python: "python",
  curl_to_go: "go",
  curl_to_java: "java",
  csv_to_json: "json",
  json_to_csv: "plaintext",
  html_to_react: "typescript",
  css_to_tailwind: "plaintext",
} satisfies Record<string, string>;

export const TRANSFORMATION_INFO: Record<
  string,
  { expectedFormat: string; example: string; description: string }
> = {
  json_to_typescript: {
    expectedFormat: "Valid JSON",
    example: '{"name": "John", "age": 30}',
    description:
      "This transformation expects valid JSON input. Make sure your input is properly formatted JSON.",
  },
  json_to_zod: {
    expectedFormat: "Valid JSON",
    example: '{"name": "John", "age": 30}',
    description:
      "This transformation expects valid JSON input to generate a Zod schema.",
  },
  json_to_graphql: {
    expectedFormat: "Valid JSON object",
    example: '{"user": {"name": "John", "age": 30}}',
    description:
      "This transformation expects a valid JSON object to generate GraphQL schema.",
  },
  json_to_mysql: {
    expectedFormat: "Valid JSON",
    example: '{"id": 1, "name": "John"}',
    description:
      "This transformation expects valid JSON input to generate MySQL schema.",
  },
  json_to_mongoose: {
    expectedFormat: "Valid JSON",
    example: '{"name": "John", "age": 30}',
    description:
      "This transformation expects valid JSON input to generate Mongoose schema.",
  },
  js_object_to_json: {
    expectedFormat: "JavaScript object literal",
    example: "{name: 'John', age: 30}",
    description:
      "This transformation expects a JavaScript object literal (must be enclosed in {}).",
  },
  js_object_to_typescript: {
    expectedFormat: "JavaScript object literal",
    example: "{name: 'John', age: 30}",
    description:
      "This transformation expects a JavaScript object literal to generate TypeScript interfaces.",
  },
  yaml_to_json: {
    expectedFormat: "Valid YAML",
    example: "name: John\nage: 30",
    description: "This transformation expects valid YAML input.",
  },
  yaml_to_toml: {
    expectedFormat: "Valid YAML",
    example: "name: John\nage: 30",
    description:
      "This transformation expects valid YAML input to convert to TOML.",
  },
  toml_to_yamal: {
    expectedFormat: "Valid TOML",
    example: 'name = "John"\nage = 30',
    description:
      "This transformation expects valid TOML input to convert to YAML.",
  },
  toml_to_json: {
    expectedFormat: "Valid TOML",
    example: 'name = "John"\nage = 30',
    description:
      "This transformation expects valid TOML input to convert to JSON.",
  },
  json_to_env: {
    expectedFormat: "Valid JSON object",
    example: '{"NODE_ENV": "production", "PORT": 3000, "DEBUG": true}',
    description:
      "Converts a JSON object into shell environment variable assignments (KEY=value lines suitable for a .env file). Nested objects and arrays are stringified.",
  },
  yaml_to_env: {
    expectedFormat: "Valid YAML mapping",
    example: "NODE_ENV: production\nPORT: 3000",
    description:
      "Converts a YAML document (typically a flat or nested mapping) into shell environment variable assignments (KEY=value lines suitable for a .env file).",
  },
  curl_to_node_axios: {
    expectedFormat: "curl command (bash-style)",
    example:
      "curl -X POST https://api.example.com/v1 -H 'Content-Type: application/json' -d '{\"a\":1}'",
    description:
      "Converts a curl command to Node.js code using the axios HTTP client.",
  },
  curl_to_node: {
    expectedFormat: "curl command (bash-style)",
    example: "curl https://example.com",
    description:
      "Converts a curl command to Node.js (generated code typically uses node-fetch).",
  },
  curl_to_python: {
    expectedFormat: "curl command (bash-style)",
    example: "curl https://example.com -H 'Authorization: Bearer TOKEN'",
    description:
      "Converts a curl command to Python using the requests library.",
  },
  curl_to_go: {
    expectedFormat: "curl command (bash-style)",
    example: "curl -X PUT https://api.example.com/item/1 -d 'name=test'",
    description: "Converts a curl command to Go net/http client code.",
  },
  curl_to_java: {
    expectedFormat: "curl command (bash-style)",
    example: "curl -u user:pass https://example.com/api",
    description:
      "Converts a curl command to Java (java.net.http.HttpClient style).",
  },
  csv_to_json: {
    expectedFormat: "CSV text (header row + rows)",
    example: "name,age,city\nAlice,30,NYC\nBob,25,LA",
    description:
      "Parses CSV (RFC 4180, quoted fields supported) using convert-csv-to-json and formats the result as a JSON array of row objects.",
  },
  json_to_csv: {
    expectedFormat: "JSON array of objects (or one object)",
    example: '[{"name":"Alice","age":30},{"name":"Bob","age":25}]',
    description:
      "Converts JSON rows into CSV using @json2csv/plainjs (header row from object keys, RFC 4180 escaping).",
  },
  html_to_react: {
    expectedFormat: "HTML fragment or document snippet",
    example: '<div class="card"><h1>Title</h1><p>Hello</p></div>',
    description:
      "Parses HTML with html-to-react, renders a React element tree to static markup, then wraps it as a default-exported TSX component. Common HTML attributes are adjusted for JSX (class → className, for → htmlFor).",
  },
  css_to_tailwind: {
    expectedFormat: "CSS rules (selectors and declarations)",
    example: "body {\n  margin: 0;\n  width: 100%;\n}",
    description:
      "Maps CSS declarations to Tailwind utility classes using css-to-tailwind-translator. Output lists each selector with a comment and its translated class string.",
  },
};
