import { suite, test } from "mocha-typescript";
import { expect } from "chai";

import BooleanType from "../../src/types/boolean";

@suite class BooleanValueTest {
  @test "passes through boolean values"() {
    expect((new BooleanType).decode(true)).to.eq(true);
    expect((new BooleanType).decode(false)).to.eq(false);
  }

  @test "throw Error on null"() {
    expect(() => (new BooleanType).decode(null)).to.throw(Error);
  }

  @test "throws Error on non-boolean values"() {
    expect(() => (new BooleanType).decode("true")).to.throw(Error);
  }
}
