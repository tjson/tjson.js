import { suite, test } from "mocha-typescript";
import { expect } from "chai";
import { DataType } from "../src/datatype";

const EXAMPLE_TAG = "example";

class ExampleType extends DataType {
  tag(): string {
    return EXAMPLE_TAG;
  }
}

@suite class DataTypeTest {
  @test "registering data types"() {
    expect(() => DataType.get(EXAMPLE_TAG)).to.throw(Error);
    DataType.register(new ExampleType);
    expect(DataType.get(EXAMPLE_TAG)).to.be.a.instanceOf(ExampleType);
  }
}
