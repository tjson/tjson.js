import { suite, test } from "mocha-typescript";
import { expect } from "chai";
import { StringType } from "../../src/datatype/string";

@suite class StringTypeTest {
  @test "parses strings"() {
    let exampleString = "Hello, world!";
    expect((new StringType).convert(exampleString)).to.eq(exampleString);
  }
}
