import * as WebRequest from "web-request";
import * as toml from "toml";

export class ExampleLoader {
  // Location of the example file
  // TODO: when this stabilizes, vendor it into the project so we don't have an online dependency
  static readonly TJSON_EXAMPLES_URL = "https://raw.githubusercontent.com/tjson/tjson-spec/master/draft-tjson-examples.txt";

  // Delimiter used to separate examples
  static readonly EXAMPLES_DELIMITER = /^-----\s*\n/m;

  constructor(
    readonly uri = ExampleLoader.TJSON_EXAMPLES_URL
  ) { }

  public async load(callback: (ex: Example[]) => void) {
    let response = await WebRequest.get(this.uri, { throwResponseError: true });
    let examples = response.content.
      replace(/^#.*?\n/gm, "").
      split(ExampleLoader.EXAMPLES_DELIMITER);

    let leadingSpace = examples.shift();
    if (leadingSpace === undefined || !/^\s*$/.test(leadingSpace)) {
      throw new Error("unexpected data before leading '-----'");
    }

    let trailingSpace = examples.pop();
    if (trailingSpace === undefined || !/^\s*$/.test(trailingSpace)) {
      throw new Error("unexpected data before trailing '-----'");
    }

    let result = examples.map((example, index) => {
      let exampleParts = example.split(/\n\s*\n/m);
      let headerToml = exampleParts.shift();
      let body = exampleParts.shift();

      if (headerToml === undefined || body == undefined) {
        throw new Error(`error parsing whitespace in example ${index}`);
      }

      let header = toml.parse(headerToml);
      let name = header["name"];
      let description = header["description"];

      if (name === undefined || description === undefined) {
        throw new Error(`missing mandatory fields in header of example ${index}`);
      }

      let success;

      switch (header["result"]) {
        case "success":
          success = true;
          break;
        case "error":
          success = false;
          break;
        default:
          throw new Error(`bad 'result' value on example ${index}: ${header["result"]}`);
      }

      return new Example(name, description, success, body);
    });

    callback(result);
  }
}

export class Example {
  constructor(
    readonly name: string,
    readonly description: string,
    readonly success: boolean,
    readonly body: string
  ) { }
}
