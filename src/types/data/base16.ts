import EncodingType from "../../encoding_type";

/** RFC 4648 Base16 alphabet (lower case) */
const BASE16_ALPHABET = "0123456789abcdef";
const LOOKUP_TABLE = BASE16_ALPHABET.split("").reduce((arr: number[], char) => {
  arr[char.charCodeAt(0)] = BASE16_ALPHABET.indexOf(char);
  return arr;
}, []);

export default class Base16DataType extends EncodingType {
  public tag(): string {
    return "d16";
  }

  public decode(hex: any): Uint8Array {
    if (hex === null || hex.length % 2 !== 0 || !(/^[a-z0-9]*$/).test(hex)) {
      throw new Error(`invalid b16: ${hex}`);
    }

    const result = new Uint8Array(hex.length / 2);

    for (let i = 0; i < hex.length; i += 2) {
      result[i >> 1] = LOOKUP_TABLE[hex.charCodeAt(i)] << 4 |
        LOOKUP_TABLE[hex.charCodeAt(i + 1)];
    }

    return new Uint8Array(result);
  }

  public encode(bytes: Uint8Array): string {
    const result = new Array(bytes.length * 2);
    const alphabet = BASE16_ALPHABET;

    for (let i = 0, j = 0; i < bytes.length; i++ , j += 2) {
      result[j] = alphabet[bytes[i] >> 4];
      result[j + 1] = alphabet[bytes[i] & 0xF];
    }

    return result.join("");
  }
}
