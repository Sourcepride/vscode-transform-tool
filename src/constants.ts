export const NAV = {
  Json: [
    "json_to_typescript",
    "json_to_zod",
    "json_to_graphql",
    "json_to_mysql",
    "json_to_mongoose",
  ] as const,
  Javascript: ["js_object_to_json", "js_object_to_typescript"] as const,
  Others: [
    "yaml_to_json",
    "yaml_to_toml",
    "toml_to_yamal",
    "toml_to_json",
  ] as const,
};

export const combinedToolsArray = Array.from(Object.values(NAV)).flat();



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
} satisfies  Record<string, string>;

export const TRANSFORMATION_INFO: Record<string, { expectedFormat: string; example: string; description: string }> = {
  json_to_typescript: {
    expectedFormat: "Valid JSON",
    example: '{"name": "John", "age": 30}',
    description: "This transformation expects valid JSON input. Make sure your input is properly formatted JSON."
  },
  json_to_zod: {
    expectedFormat: "Valid JSON",
    example: '{"name": "John", "age": 30}',
    description: "This transformation expects valid JSON input to generate a Zod schema."
  },
  json_to_graphql: {
    expectedFormat: "Valid JSON object",
    example: '{"user": {"name": "John", "age": 30}}',
    description: "This transformation expects a valid JSON object to generate GraphQL schema."
  },
  json_to_mysql: {
    expectedFormat: "Valid JSON",
    example: '{"id": 1, "name": "John"}',
    description: "This transformation expects valid JSON input to generate MySQL schema."
  },
  json_to_mongoose: {
    expectedFormat: "Valid JSON",
    example: '{"name": "John", "age": 30}',
    description: "This transformation expects valid JSON input to generate Mongoose schema."
  },
  js_object_to_json: {
    expectedFormat: "JavaScript object literal",
    example: "{name: 'John', age: 30}",
    description: "This transformation expects a JavaScript object literal (must be enclosed in {})."
  },
  js_object_to_typescript: {
    expectedFormat: "JavaScript object literal",
    example: "{name: 'John', age: 30}",
    description: "This transformation expects a JavaScript object literal to generate TypeScript interfaces."
  },
  yaml_to_json: {
    expectedFormat: "Valid YAML",
    example: "name: John\nage: 30",
    description: "This transformation expects valid YAML input."
  },
  yaml_to_toml: {
    expectedFormat: "Valid YAML",
    example: "name: John\nage: 30",
    description: "This transformation expects valid YAML input to convert to TOML."
  },
  toml_to_yamal: {
    expectedFormat: "Valid TOML",
    example: 'name = "John"\nage = 30',
    description: "This transformation expects valid TOML input to convert to YAML."
  },
  toml_to_json: {
    expectedFormat: "Valid TOML",
    example: 'name = "John"\nage = 30',
    description: "This transformation expects valid TOML input to convert to JSON."
  },
};


