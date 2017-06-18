import { suite, test } from "mocha-typescript";
import { expect } from "chai";

import EncodingType from "../../src/encoding_type";
import ArrayType from "../../src/types/array";

@suite class ArrayTypeTest {
  @test "parses arrays"() {
    let intType = EncodingType.get("i");
    expect((new ArrayType(intType)).decode(["1", "2", "3"])).to.eql([1, 2, 3]);
  }
}
