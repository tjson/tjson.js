import { ScalarType } from "../datatype";

export class Binary16Type extends ScalarType {
  tag(): string {
    return "b16";
  }

  convert(hex: any): Uint8Array {
    if (!(/^[a-z0-9]+$/).test(hex)) {
      throw new Error(`invalid b16: ${hex}`);
    }

    let result = [];

    for (let i = 0; i < hex.length; i += 2) {
      result.push(parseInt(hex.substr(i, 2), 16));
    }

    return new Uint8Array(result);
  }
}

export class Binary32Type extends ScalarType {
  // RFC 4648 Base32 alphabet
  static readonly BASE32_ALPHABET = "abcdefghijklmnopqrstuvwxyz234567";
  static readonly LOOKUP_TABLE = Binary32Type.BASE32_ALPHABET.split("").reduce((arr: number[], char) => {
    arr[char.charCodeAt(0)] = Binary32Type.BASE32_ALPHABET.indexOf(char);
    return arr;
  }, []);

  tag(): string {
    return "b32";
  }

  convert(b32: any): Uint8Array {
    if (b32 === null || !(/^[a-z0-9]+$/).test(b32)) {
      throw new Error(`invalid b32: ${b32}`);
    }

    let result = new Uint8Array(b32.length * 5 / 8);

    for (let i = 0, j = 0; i < b32.length; i += 8, j += 5) {
      let buf = new Uint8Array(8);
      let remaining = Math.min(b32.length - i, 8);

      for (let k = 0; k < remaining; k++) {
        buf[k] = Binary32Type.LOOKUP_TABLE[b32.charCodeAt(i + k)];
      }

      result[j] = (buf[0] << 3) | (buf[1] >> 2);
      result[j + 1] = (buf[1] << 6) | (buf[2] << 1) | (buf[3] >> 4);
      result[j + 2] = (buf[3] << 4) | (buf[4] >> 1);
      result[j + 3] = (buf[4] << 7) | (buf[5] << 2) | (buf[6] >> 3);
      result[j + 4] = (buf[6] << 5) | buf[7];
    }

    return result;
  }
}

export class Binary64Type extends ScalarType {
  // RFC 4648 Base64url alphabet
  static readonly BASE64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  static readonly LOOKUP_TABLE = Binary64Type.BASE64_ALPHABET.split("").reduce((arr: number[], char) => {
    arr[char.charCodeAt(0)] = Binary64Type.BASE64_ALPHABET.indexOf(char);
    return arr;
  }, []);

  tag(): string {
    return "b64";
  }

  convert(b64: any): Uint8Array {
    if (b64 === null || !(/^[A-Za-z0-9\-_]+$/).test(b64)) {
      throw new Error(`invalid b64: ${b64}`);
    }

    let result = new Uint8Array(b64.length * 3 / 4);

    for (let i = 0, j = 0; i < b64.length; i += 4, j += 3) {
      let buf = new Uint8Array(4);
      let remaining = Math.min(b64.length - i, 4);

      for (let k = 0; k < remaining; k++) {
        buf[k] = Binary64Type.LOOKUP_TABLE[b64.charCodeAt(i + k)];
      }

      let value = (buf[0] << 18) | (buf[1] << 12) | (buf[2] << 6) | buf[3];
      result[j] = (value >> 16) & 0xFF;
      result[j + 1] = (value >> 8) & 0xFF;
      result[j + 2] = value & 0xFF;
    }

    return result;
  }
}
