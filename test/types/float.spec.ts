import { suite, test } from "mocha-typescript";
import { expect } from "chai";

import FloatType from "../../src/types/float";

@suite class FloatTypeTest {
  @test "passes through floating point values"() {
    expect((new FloatType).decode(42)).to.eq(42);
  }

  @test "throws Error on string values"() {
    expect(() => (new FloatType).decode("42")).to.throw(Error);
  }
}
