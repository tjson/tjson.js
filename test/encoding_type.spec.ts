import { suite, test } from "mocha-typescript";
import { expect } from "chai";

import EncodingType from "../src/encoding_type";

const EXAMPLE_TAG = "example";

class ExampleType extends EncodingType {
  tag(): string {
    return EXAMPLE_TAG;
  }
}

@suite class EncodingTypeTest {
  @test "registering data types"() {
    expect(() => EncodingType.get(EXAMPLE_TAG)).to.throw(Error);
    EncodingType.register(new ExampleType);
    expect(EncodingType.get(EXAMPLE_TAG)).to.be.a.instanceOf(ExampleType);
  }
}
