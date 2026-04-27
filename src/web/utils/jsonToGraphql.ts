type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject {
  [key: string]: JsonValue;
}
type JsonArray = JsonValue[];

const getGraphQLType = (value: JsonValue): string => {
  if (value === null) return 'String';
  if (Array.isArray(value)) {
    if (value.length === 0) return '[String]';
    return `[${getGraphQLType(value[0])}]`;
  }
  if (typeof value === 'object') {
    return 'Object';
  }
  if (typeof value === 'string') return 'String';
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'Int' : 'Float';
  }
  if (typeof value === 'boolean') return 'Boolean';
  return 'String';
};

const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const generateGraphQLSchema = (
  obj: JsonObject,
  typeName: string = 'RootType'
): string => {
  const types: string[] = [];
  const processedTypes = new Set<string>();

  const processObject = (
    data: JsonObject,
    _currentTypeName: string
  ): string[] => {
    const fields: string[] = [];

    for (const [key, value] of Object.entries(data)) {
      if (value === null) {
        fields.push(`  ${key}: String`);
      } else if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
          const nestedTypeName = capitalizeFirstLetter(key);
          if (!processedTypes.has(nestedTypeName)) {
            processedTypes.add(nestedTypeName);
            const nestedFields = processObject(value[0] as JsonObject, nestedTypeName);
            types.push(`type ${nestedTypeName} {\n${nestedFields.join('\n')}\n}`);
          }
          fields.push(`  ${key}: [${nestedTypeName}]`);
        } else {
          const elementType = value.length > 0 ? getGraphQLType(value[0]) : 'String';
          fields.push(`  ${key}: [${elementType}]`);
        }
      } else if (typeof value === 'object') {
        const nestedTypeName = capitalizeFirstLetter(key);
        if (!processedTypes.has(nestedTypeName)) {
          processedTypes.add(nestedTypeName);
          const nestedFields = processObject(value as JsonObject, nestedTypeName);
          types.push(`type ${nestedTypeName} {\n${nestedFields.join('\n')}\n}`);
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
  const rootType = `type ${typeName} {\n${rootFields.join('\n')}\n}`;

  return [rootType, ...types].join('\n\n');
};

export const jsonToGraphQLSchema = (jsonString: string): string => {
  try {
    const parsed = JSON.parse(jsonString);
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Input must be a JSON object');
    }
    return generateGraphQLSchema(parsed as JsonObject);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON: ' + error.message);
    }
    throw error;
  }
};

