import EncodingType from "../../encoding_type";

/** RFC 4648 Base32 alphabet (lower case) */
const BASE32_ALPHABET = "abcdefghijklmnopqrstuvwxyz234567";
const LOOKUP_TABLE = BASE32_ALPHABET.split("").reduce((arr: number[], char) => {
  arr[char.charCodeAt(0)] = BASE32_ALPHABET.indexOf(char);
  return arr;
}, []);

export default class Base32DataType extends EncodingType {
  public tag(): string {
    return "d32";
  }

  public decode(b32: any): Uint8Array {
    if (b32 === null || !(/^[a-z0-9]*$/).test(b32)) {
      throw new Error(`invalid b32: ${b32}`);
    }

    const result = new Uint8Array(b32.length * 5 / 8);

    for (let i = 0, j = 0; i < b32.length; i += 8, j += 5) {
      const buf = new Uint8Array(8);
      const remaining = Math.min(b32.length - i, 8);

      for (let k = 0; k < remaining; k++) {
        buf[k] = LOOKUP_TABLE[b32.charCodeAt(i + k)];
      }

      result[j] = (buf[0] << 3) | (buf[1] >> 2);
      result[j + 1] = (buf[1] << 6) | (buf[2] << 1) | (buf[3] >> 4);
      result[j + 2] = (buf[3] << 4) | (buf[4] >> 1);
      result[j + 3] = (buf[4] << 7) | (buf[5] << 2) | (buf[6] >> 3);
      result[j + 4] = (buf[6] << 5) | buf[7];
    }

    return result;
  }

  public encode(bytes: Uint8Array): string {
    let outputLength = Math.ceil(bytes.length / 5) * 8;
    const result = new Array(outputLength);
    const alphabet = BASE32_ALPHABET;

    for (let i = 0, j = 0; i < bytes.length; i += 5, j += 8) {
      result[j] = alphabet[((bytes[i] & 0xF8) >> 3)];
      result[j + 1] = alphabet[(((bytes[i] & 0x07) << 2) | ((bytes[i + 1] & 0xC0) >> 6))];
      result[j + 2] = alphabet[((bytes[i + 1] & 0x3E) >> 1)];
      result[j + 3] = alphabet[(((bytes[i + 1] & 0x01) << 4) | ((bytes[i + 2] & 0xF0) >> 4))];
      result[j + 4] = alphabet[(((bytes[i + 2] & 0x0F) << 1) | (bytes[i + 3] >> 7))];
      result[j + 5] = alphabet[((bytes[i + 3] & 0x7C) >> 2)];
      result[j + 6] = alphabet[(((bytes[i + 3] & 0x03) << 3) | ((bytes[i + 4] & 0xE0) >> 5))];
      result[j + 7] = alphabet[(bytes[i + 4] & 0x1F)];
    }

    const offset = bytes.length % 5;
    if (offset !== 0) {
      outputLength -= 8 - ((offset % 5) * 2) + (offset >= 3 ? 1 : 0);
    }

    return result.slice(0, outputLength).join("");
  }
}
