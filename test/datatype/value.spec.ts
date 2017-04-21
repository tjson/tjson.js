import { suite, test } from "mocha-typescript";
import { expect } from "chai";
import { ValueType } from "../../src/datatype/value";

@suite class BooleanValueTest {
  @test "passes through boolean values"() {
    expect((new ValueType).convert(true)).to.eq(true);
    expect((new ValueType).convert(false)).to.eq(false);
  }

  @test "throw Error on null"() {
    expect(() => (new ValueType).convert(null)).to.throw(Error);
  }

  @test "throws Error on non-boolean values"() {
    expect(() => (new ValueType).convert("true")).to.throw(Error);
  }
}
