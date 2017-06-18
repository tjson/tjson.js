import { suite, test } from "mocha-typescript";
import { expect } from "chai";

import Base16DataType from "../../src/types/data/base16";
import Base32DataType from "../../src/types/data/base32";
import Base64DataType from "../../src/types/data/base64";

@suite class Base16DataTypeTest {
  @test "decodes hexadecimal"() {
    let expected = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33]);
    expect((new Base16DataType).decode("48656c6c6f2c20776f726c6421")).to.eql(expected);
  }

  @test "encodes hexadecimal"() {
    let input = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33]);
    expect((new Base16DataType).encode(input)).to.eql("48656c6c6f2c20776f726c6421");
  }

  @test "round trips 0-256 byte byte arrays"() {
    for (let i = 0; i <= 256; i++) {
      let input = new Uint8Array(i);

      for (let j = 0; j < i; j++) {
        input[j] = j;
      }

      let type = new Base16DataType;
      let encoded = type.encode(input);
      let output = type.decode(encoded);

      expect(input).to.eql(output);
    }
  }
}

@suite class Base32DataTypeTest {
  @test "decodes RFC 4648 Base32 (lower-case, no padding)"() {
    let expected = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33]);
    expect((new Base32DataType).decode("jbswy3dpfqqho33snrscc")).to.eql(expected);
  }

  @test "encodes RFC 4648 Base32 (lower-case, no padding)"() {
    let input = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33]);
    expect((new Base32DataType).encode(input)).to.eql("jbswy3dpfqqho33snrscc");
  }

  @test "round trips 0-256 byte byte arrays"() {
    for (let i = 0; i <= 256; i++) {
      let input = new Uint8Array(i);

      for (let j = 0; j < i; j++) {
        input[j] = j;
      }

      let type = new Base32DataType;
      let encoded = type.encode(input);
      let output = type.decode(encoded);

      expect(input).to.eql(output);
    }
  }
}

@suite class Base64DataTypeTest {
  @test "decodes RFC 4648 Base64url (no padding)"() {
    let expected = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33]);
    expect((new Base64DataType).decode("SGVsbG8sIHdvcmxkIQ")).to.eql(expected);
  }

  @test "encodes RFC 4648 Base64url (no padding)"() {
    let input = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33]);
    expect((new Base64DataType).encode(input)).to.eql("SGVsbG8sIHdvcmxkIQ");
  }

  @test "round trips 0-256 byte byte arrays"() {
    for (let i = 0; i <= 256; i++) {
      let input = new Uint8Array(i);

      for (let j = 0; j < i; j++) {
        input[j] = j;
      }

      let type = new Base64DataType;
      let encoded = type.encode(input);
      let output = type.decode(encoded);

      expect(input).to.eql(output);
    }
  }
}
