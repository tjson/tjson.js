import { suite, test } from "mocha-typescript";
import { expect } from "chai";
import { Binary16Type, Binary32Type, Binary64Type } from "../../src/datatype/binary";

@suite class Binary16Test {
  @test "decodes hexadecimal"() {
    let expected = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33]);
    expect((new Binary16Type).decode("48656c6c6f2c20776f726c6421")).to.eql(expected);
  }

  @test "encodes hexadecimal"() {
    let input = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33]);
    expect((new Binary16Type).encode(input)).to.eql("48656c6c6f2c20776f726c6421");
  }

  @test "round trips 0-256 byte byte arrays"() {
    for (let i = 0; i <= 256; i++) {
      let input = new Uint8Array(i);

      for (let j = 0; j < i; j++) {
        input[j] = j;
      }

      let type = new Binary16Type;
      let encoded = type.encode(input);
      let output = type.decode(encoded);

      expect(input).to.eql(output);
    }
  }
}

@suite class Binary32Test {
  @test "decodes RFC 4648 Base32 (lower-case, no padding)"() {
    let expected = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33]);
    expect((new Binary32Type).decode("jbswy3dpfqqho33snrscc")).to.eql(expected);
  }

  @test "encodes RFC 4648 Base32 (lower-case, no padding)"() {
    let input = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33]);
    expect((new Binary32Type).encode(input)).to.eql("jbswy3dpfqqho33snrscc");
  }

  @test "round trips 0-256 byte byte arrays"() {
    for (let i = 0; i <= 256; i++) {
      let input = new Uint8Array(i);

      for (let j = 0; j < i; j++) {
        input[j] = j;
      }

      let type = new Binary32Type;
      let encoded = type.encode(input);
      let output = type.decode(encoded);

      expect(input).to.eql(output);
    }
  }
}

@suite class Binary64Test {
  @test "decodes RFC 4648 Base64url (no padding)"() {
    let expected = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33]);
    expect((new Binary64Type).decode("SGVsbG8sIHdvcmxkIQ")).to.eql(expected);
  }

  @test "encodes RFC 4648 Base64url (no padding)"() {
    let input = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33]);
    expect((new Binary64Type).encode(input)).to.eql("SGVsbG8sIHdvcmxkIQ");
  }

  @test "round trips 0-256 byte byte arrays"() {
    for (let i = 0; i <= 256; i++) {
      let input = new Uint8Array(i);

      for (let j = 0; j < i; j++) {
        input[j] = j;
      }

      let type = new Binary64Type;
      let encoded = type.encode(input);
      let output = type.decode(encoded);

      expect(input).to.eql(output);
    }
  }
}
