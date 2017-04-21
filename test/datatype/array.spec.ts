import { suite, test } from "mocha-typescript";
import { expect } from "chai";
import { DataType } from "../../src/datatype";
import { ArrayType } from "../../src/datatype/array";

@suite class ArrayTypeTest {
  @test "parses arrays"() {
    let intType = DataType.get("i");
    expect((new ArrayType(intType)).convert(["1", "2", "3"])).to.eql([1, 2, 3]);
  }
}
