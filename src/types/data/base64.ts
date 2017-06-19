import EncodingType from "../../encoding_type";

/** RFC 4648 Base64url alphabet */
const BASE64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const LOOKUP_TABLE = BASE64_ALPHABET.split("").reduce((arr: number[], char) => {
  arr[char.charCodeAt(0)] = BASE64_ALPHABET.indexOf(char);
  return arr;
}, []);

export default class Base64DataType extends EncodingType {

  public tag(): string {
    // Default to using "d" for Base64, per SHOULD in spec
    return "d";
  }

  public decode(b64: any): Uint8Array {
    if (b64 === null || !(/^[A-Za-z0-9\-_]*$/).test(b64)) {
      throw new Error(`invalid b64: ${b64}`);
    }

    const result = new Uint8Array(b64.length * 3 / 4);

    for (let i = 0, j = 0; i < b64.length; i += 4, j += 3) {
      const buf = new Uint8Array(4);
      const remaining = Math.min(b64.length - i, 4);

      for (let k = 0; k < remaining; k++) {
        buf[k] = LOOKUP_TABLE[b64.charCodeAt(i + k)];
      }

      const value = (buf[0] << 18) | (buf[1] << 12) | (buf[2] << 6) | buf[3];
      result[j] = (value >> 16) & 0xFF;
      result[j + 1] = (value >> 8) & 0xFF;
      result[j + 2] = value & 0xFF;
    }

    return result;
  }

  public encode(bytes: Uint8Array): string {
    let outputLength = Math.ceil(bytes.length / 3) * 4;

    const result = new Array(outputLength);
    const alphabet = BASE64_ALPHABET;

    for (let i = 0, j = 0; i < bytes.length; i += 3, j += 4) {
      const value = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

      result[j] = alphabet[(value >> 18) & 63];
      result[j + 1] = alphabet[(value >> 12) & 63];
      result[j + 2] = alphabet[(value >> 6) & 63];
      result[j + 3] = alphabet[value & 63];
    }

    const offset = bytes.length % 3;
    if (offset !== 0) {
      outputLength -= 3 - offset;
    }

    return result.slice(0, outputLength).join("");
  }
}
