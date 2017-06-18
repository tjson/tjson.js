import { suite, test } from "mocha-typescript";
import { expect } from "chai";

import Int64Type from "../../src/types/integer/int64";
import Uint64Type from "../../src/types/integer/uint64";

@suite class Int64TypeTest {
  @test "parses integer values"() {
    expect((new Int64Type).decode("42")).to.eq(42);
  }

  @test "parses negative integer values"() {
    expect((new Int64Type).decode("-42")).to.eq(-42);
  }
}

@suite class Uint64TypeTest {
  @test "parses integer values"() {
    expect((new Uint64Type).decode("42")).to.eq(42);
  }

  @test "throws RangeError on negative values"() {
    expect(() => (new Uint64Type).decode("-42")).to.throw(RangeError);
  }
}
