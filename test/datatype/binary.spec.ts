import { suite, test } from "mocha-typescript";
import { expect } from "chai";
import { Binary16Type, Binary32Type, Binary64Type } from "../../src/datatype/binary";

@suite class Binary16Test {
  @test "parses hexadecimal"() {
    let expected = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33]);
    expect((new Binary16Type).convert("48656c6c6f2c20776f726c6421")).to.eql(expected);
  }
}

@suite class Binary32Test {
  @test "parses RFC 4648 Base32"() {
    let expected = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33]);
    expect((new Binary32Type).convert("jbswy3dpfqqho33snrscc")).to.eql(expected);
  }
}

@suite class Binary64Test {
  @test "parses RFC 4648 Base64url"() {
    let expected = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33]);
    expect((new Binary64Type).convert("SGVsbG8sIHdvcmxkIQ")).to.eql(expected);
  }
}
