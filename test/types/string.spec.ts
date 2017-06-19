import { suite, test } from "mocha-typescript";
import { expect } from "chai";

import StringType from "../../src/types/string";

@suite class StringTypeTest {
  @test "parses strings"() {
    let exampleString = "Hello, world!";
    expect((new StringType).decode(exampleString)).to.eq(exampleString);
  }
}
