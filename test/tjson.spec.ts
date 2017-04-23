import { suite, test } from "mocha-typescript";
import { expect } from "chai";
import { Example, ExampleLoader } from "./example_loader";
import TJSON from "../src/tjson";

@suite class TJSONSpec {
  // Examples we don't decode correctly (i.e. due to JavaScript limitations)
  static readonly SKIPPED_DECODE_CASES = [
    // JSON.parse ignores repeated member names
    // TODO: write our own JSON parser? o_O
    "Invalid Object with Repeated Member Names",
    "Invalid Object with Repeated Member Names and Values",

    // Deep equality in JavaScript is hard
    "Invalid set of duplicate objects",
    "Invalid set containing duplicate arrays",

    // Pending https://tc39.github.io/proposal-integer/
    "Signed Integer Range Test",
    "Unsigned Integer Range Test"
  ];

  // Examples we don't encode correctly (i.e. due to JavaScript limitations)
  static readonly SKIPPED_ENCODE_CASES = [
    // Pending https://tc39.github.io/proposal-integer/
    "Array of integers",
    "Array of objects",
    "Multidimensional array of integers",
    "Set of integers",
    "Set of objects",
    "Set containing arrays of integers",
    "Signed Integer",
    "Unsigned Integer",

    // Examples that encode as Base64 by default
    "Base16 Binary Data",
    "Base32 Binary Data",
    "Base64url Binary Data"
  ];

  static examples: Example[];

  static before() {
    return new ExampleLoader().load(examples => this.examples = examples);
  }

  @test "parsing draft-tjson-examples.txt"() {
    for (let example of TJSONSpec.examples) {
      if (TJSONSpec.SKIPPED_DECODE_CASES.some(name => example.name == name)) {
        continue;
      }

      if (example.success) {
        expect(() => TJSON.parse(example.body)).to.not.throw(Error);
      } else {
        expect(() => TJSON.parse(example.body)).to.throw(Error);
      }
    }
  }

  @test "serializing draft-tjson-examples.txt"() {
    for (let example of TJSONSpec.examples) {
      if (TJSONSpec.SKIPPED_DECODE_CASES.some(name => example.name == name)) {
        continue;
      }

      if (TJSONSpec.SKIPPED_ENCODE_CASES.some(name => example.name == name)) {
        continue;
      }

      if (!example.success) {
        continue;
      }

      let deserialized = TJSON.parse(example.body);
      expect(TJSON.stringify(deserialized)).to.eq(example.body.replace(": ", ":"));
    }
  }
}
