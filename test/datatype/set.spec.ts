import { suite, test } from "mocha-typescript";
import { expect } from "chai";
import { DataType } from "../../src/datatype";
import { SetType } from "../../src/datatype/set";

@suite class SetTypeTest {
  @test "parses arrays"() {
    let intType = DataType.get("i");
    expect((new SetType(intType)).decode(["1", "2", "3"])).to.eql(new Set([1, 2, 3]));
  }
}
