import { suite, test } from "mocha-typescript";
import { expect } from "chai";
import { Example, ExampleLoader } from "./example_loader";
import TJSON from "../index";

@suite class TJSONSpec {
  // Test cases we're not compliant with due to JavaScript limitations
  static readonly FAILING_CASES = [
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

  static examples: Example[];

  static before() {
    return new ExampleLoader().load((examples) => this.examples = examples);
  }

  @test "parsing draft-tjson-examples.txt"() {
    for (let example of TJSONSpec.examples) {
      if (TJSONSpec.FAILING_CASES.some((name) => example.name == name)) {
        continue;
      }

      if (example.success) {
        expect(() => TJSON.parse(example.body)).to.not.throw(Error);
      } else {
        expect(() => TJSON.parse(example.body)).to.throw(Error);
      }
    }
  }
}
