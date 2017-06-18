import { suite, test } from "mocha-typescript";
import { expect } from "chai";

import EncodingType from "../../src/encoding_type";
import SetType from "../../src/types/set";

@suite class SetTypeTest {
  @test "parses arrays"() {
    let intType = EncodingType.get("i");
    expect((new SetType(intType)).decode(["1", "2", "3"])).to.eql(new Set([1, 2, 3]));
  }
}
