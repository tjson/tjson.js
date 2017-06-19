import { suite, test } from "mocha-typescript";
import { expect } from "chai";

import ObjectType from "../../src/types/object";

@suite class ObjectTypeTest {
  @test "parses objects"() {
    let exampleObj = { "foo": 1, "bar": 2, "baz": 3 };
    expect((new ObjectType).decode(exampleObj)).to.eq(exampleObj);
  }
}
