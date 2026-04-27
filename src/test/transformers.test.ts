import * as assert from 'assert';
import { transformers } from '../transformers';

suite('Transformers Test Suite', () => {
  suite('JSON to TypeScript', () => {
    test('should convert simple JSON to TypeScript interface', () => {
      const input = '{"name": "John", "age": 30}';
      const result = transformers.json_to_typescript(input);
      
      assert.ok(result.includes('interface'));
      assert.ok(result.includes('name'));
      assert.ok(result.includes('age'));
      assert.ok(result.includes('string'));
      assert.ok(result.includes('number'));
    });

    test('should handle nested objects', () => {
      const input = '{"user": {"name": "John", "address": {"city": "NYC"}}}';
      const result = transformers.json_to_typescript(input);
      
      assert.ok(result.includes('interface'));
      assert.ok(result.includes('User'));
      assert.ok(result.includes('Address'));
    });

    test('should handle arrays', () => {
      const input = '{"items": [1, 2, 3]}';
      const result = transformers.json_to_typescript(input);
      
      assert.ok(result.includes('number[]'));
    });
  });

  suite('JSON to Zod', () => {
    test('should convert JSON to Zod schema', () => {
      const input = '{"name": "John", "age": 30}';
      const result = transformers.json_to_zod(input);
      
      assert.ok(result.includes('z.object'));
      assert.ok(result.includes('name'));
      assert.ok(result.includes('age'));
    });
  });

  suite('JSON to GraphQL', () => {
    test('should convert JSON to GraphQL schema', () => {
      const input = '{"name": "John", "age": 30}';
      const result = transformers.json_to_graphql(input);
      
      assert.ok(result.includes('type'));
      assert.ok(result.includes('name: String'));
      assert.ok(result.includes('age: Int'));
    });

    test('should handle nested objects in GraphQL', () => {
      const input = '{"user": {"name": "John"}}';
      const result = transformers.json_to_graphql(input);
      
      assert.ok(result.includes('type'));
      assert.ok(result.includes('User'));
    });
  });

  suite('JSON to MySQL', () => {
    test('should convert JSON to MySQL schema', () => {
      const input = '{"name": "John", "age": 30}';
      const result = transformers.json_to_mysql(input);
      
      assert.ok(result.length > 0);
      assert.ok(typeof result === 'string');
    });
  });

  suite('JSON to Mongoose', () => {
    test('should convert JSON to Mongoose schema', () => {
      const input = '{"name": "John", "age": 30}';
      const result = transformers.json_to_mongoose(input);
      
      assert.ok(result.includes('type'));
      assert.ok(result.includes('String') || result.includes('Number'));
    });
  });

  suite('JavaScript Object to JSON', () => {
    test('should convert JS object to JSON', () => {
      const input = "{name: 'John', age: 30}";
      const result = transformers.js_object_to_json(input);
      
      const parsed = JSON.parse(result);
      assert.strictEqual(parsed.name, 'John');
      assert.strictEqual(parsed.age, 30);
    });

    test('should handle nested JS objects', () => {
      const input = "{user: {name: 'John'}}";
      const result = transformers.js_object_to_json(input);
      
      const parsed = JSON.parse(result);
      assert.strictEqual(parsed.user.name, 'John');
    });

    test('should throw error for invalid input', () => {
      const input = "not an object";
      assert.throws(() => transformers.js_object_to_json(input));
    });

    test('should stringify JSON5 array literals to JSON', () => {
      const input = '[1, 2, 3]';
      const result = transformers.js_object_to_json(input);
      const parsed = JSON.parse(result);
      assert.deepStrictEqual(parsed, [1, 2, 3]);
    });
  });

  suite('JavaScript Object to TypeScript', () => {
    test('should convert JS object to TypeScript', () => {
      const input = "{name: 'John', age: 30}";
      const result = transformers.js_object_to_typescript(input);
      
      assert.ok(result.includes('interface'));
      assert.ok(result.includes('name'));
      assert.ok(result.includes('age'));
    });
  });

  suite('YAML to JSON', () => {
    test('should convert YAML to JSON', () => {
      const input = 'name: John\nage: 30';
      const result = transformers.yaml_to_json(input);
      
      const parsed = JSON.parse(result);
      assert.strictEqual(parsed.name, 'John');
      assert.strictEqual(parsed.age, 30);
    });

    test('should handle nested YAML', () => {
      const input = 'user:\n  name: John\n  age: 30';
      const result = transformers.yaml_to_json(input);
      
      const parsed = JSON.parse(result);
      assert.strictEqual(parsed.user.name, 'John');
      assert.strictEqual(parsed.user.age, 30);
    });
  });

  suite('YAML to TOML', () => {
    test('should convert YAML to TOML', () => {
      const input = 'name: John\nage: 30';
      const result = transformers.yaml_to_toml(input);

      assert.ok(result.includes('name'));
      assert.ok(result.includes('age'));
    });
  });

  suite('TOML to YAML', () => {
    test('should convert TOML to YAML', () => {
      const input = 'name = "John"\nage = 30';
      const result = transformers.toml_to_yamal(input);

      assert.ok(result.includes('name'));
      assert.ok(result.includes('John'));
      assert.ok(result.includes('age'));
      assert.ok(result.includes('30'));
    });

    test('should handle TOML tables', () => {
      const input = '[user]\nname = "John"\nage = 30';
      const result = transformers.toml_to_yamal(input);

      assert.ok(result.includes('user'));
      assert.ok(result.includes('name'));
    });
  });

  suite('TOML to JSON', () => {
    test('should convert TOML to JSON', () => {
      const input = 'name = "John"\nage = 30';
      const result = transformers.toml_to_json(input);

      const parsed = JSON.parse(result);
      assert.strictEqual(parsed.name, 'John');
      assert.strictEqual(parsed.age, 30);
    });

    test('should handle TOML tables in JSON conversion', () => {
      const input = '[user]\nname = "John"\nage = 30';
      const result = transformers.toml_to_json(input);

      const parsed = JSON.parse(result);
      assert.strictEqual(parsed.user.name, 'John');
      assert.strictEqual(parsed.user.age, 30);
    });

    test('should handle arrays in TOML', () => {
      const input = 'items = [1, 2, 3]';
      const result = transformers.toml_to_json(input);

      const parsed = JSON.parse(result);
      assert.deepStrictEqual(parsed.items, [1, 2, 3]);
    });
  });

  suite('Error Handling', () => {
    test('should throw error for invalid JSON', () => {
      const input = 'not valid json';
      assert.throws(() => transformers.json_to_typescript(input));
    });

    test('should handle YAML parsing', () => {
      const input = 'name: John';
      const result = transformers.yaml_to_json(input);
      assert.ok(result.length > 0);
    });

    test('should throw error for invalid TOML', () => {
      const input = '[[[[invalid]]]]';
      assert.throws(() => transformers.toml_to_json(input));
    });

    test('should throw error for invalid JS object', () => {
      const input = 'function() {}';
      assert.throws(() => transformers.js_object_to_json(input));
    });
  });
});

