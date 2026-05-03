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

  suite('cURL converters', () => {
    const simpleCurl = 'curl https://example.com';

    test('curl_to_python includes requests and URL', () => {
      const result = transformers.curl_to_python(simpleCurl);
      assert.ok(result.includes('requests'));
      assert.ok(result.includes('example.com'));
    });

    test('curl_to_node_axios references axios', () => {
      const result = transformers.curl_to_node_axios(simpleCurl);
      assert.ok(result.toLowerCase().includes('axios'));
    });

    test('curl_to_node references fetch', () => {
      const result = transformers.curl_to_node(simpleCurl);
      assert.ok(result.includes('fetch'));
    });

    test('curl_to_go includes net/http', () => {
      const result = transformers.curl_to_go(simpleCurl);
      assert.ok(result.includes('http'));
      assert.ok(result.includes('example.com'));
    });

    test('curl_to_java includes HttpRequest', () => {
      const result = transformers.curl_to_java(simpleCurl);
      assert.ok(result.includes('HttpRequest'));
    });

    test('empty curl input throws', () => {
      assert.throws(() => transformers.curl_to_python('   '));
    });
  });

  suite('CSV / JSON round-trip helpers', () => {
    test('csv_to_json parses header and rows', () => {
      const result = transformers.csv_to_json('a,b\n1,2');
      const parsed = JSON.parse(result);
      assert.strictEqual(parsed.length, 1);
      assert.strictEqual(parsed[0].a, 1);
      assert.strictEqual(parsed[0].b, 2);
    });

    test('json_to_csv produces header line', () => {
      const result = transformers.json_to_csv(
        JSON.stringify([{ x: 'hello', y: 1 }]),
      );
      assert.ok(result.includes('x'));
      assert.ok(result.includes('hello'));
    });

    test('json_to_csv accepts a single object', () => {
      const result = transformers.json_to_csv(JSON.stringify({ id: 9, ok: true }));
      assert.ok(result.includes('id'));
      assert.ok(result.includes('9'));
    });

    test('csv_to_json throws on empty input', () => {
      assert.throws(() => transformers.csv_to_json('   '));
    });

    test('json_to_csv throws on invalid JSON', () => {
      assert.throws(() => transformers.json_to_csv('not json'));
    });
  });

  suite('JSON / YAML to env', () => {
    test('json_to_env produces KEY=value lines', () => {
      const result = transformers.json_to_env('{"FOO": "bar", "BAZ": 1}');
      assert.ok(result.includes('FOO'));
      assert.ok(result.includes('bar'));
    });

    test('yaml_to_env produces KEY=value lines', () => {
      const result = transformers.yaml_to_env('FOO: bar\nBAZ: 1');
      assert.ok(result.includes('FOO'));
      assert.ok(result.includes('bar'));
    });

    test('json_to_env throws on invalid JSON', () => {
      assert.throws(() => transformers.json_to_env('not json'));
    });

    test('yaml_to_env throws on invalid YAML', () => {
      assert.throws(() => transformers.yaml_to_env('\t\t['));
    });
  });

  suite('HTML to React (TSX)', () => {
    test('wraps parsed markup in a default export component', () => {
      const result = transformers.html_to_react(
        '<div class="x"><span>hi</span></div>',
      );
      assert.ok(result.includes('export default function ConvertedFromHtml'));
      assert.ok(result.includes('className="x"'));
      assert.ok(result.includes('<span>hi</span>'));
    });

    test('empty HTML input throws', () => {
      assert.throws(() => transformers.html_to_react('   '));
    });
  });

  suite('CSS to Tailwind', () => {
    test('translates simple declarations', () => {
      const result = transformers.css_to_tailwind(`body {
  width: 100%;
  margin: 0 !important;
}`);
      assert.ok(result.includes('body'));
      assert.ok(result.includes('w-full'));
      assert.ok(result.includes('!m-0'));
    });

    test('empty CSS input throws', () => {
      assert.throws(() => transformers.css_to_tailwind(''));
    });
  });
});

