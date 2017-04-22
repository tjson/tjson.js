import { suite, test } from "mocha-typescript";
import { expect } from "chai";
import { IntType, UintType } from "../../src/datatype/integer";

@suite class IntTypeTest {
  @test "parses integer values"() {
    expect((new IntType).decode("42")).to.eq(42);
  }

  @test "parses negative integer values"() {
    expect((new IntType).decode("-42")).to.eq(-42);
  }
}

@suite class UintTypeTest {
  @test "parses integer values"() {
    expect((new UintType).decode("42")).to.eq(42);
  }

  @test "throws RangeError on negative values"() {
    expect(() => (new UintType).decode("-42")).to.throw(RangeError);
  }
}
