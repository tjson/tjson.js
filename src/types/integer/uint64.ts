import EncodingType from "../../encoding_type";

// TODO: Support full 64-bit integer range using https://tc39.github.io/proposal-bigint/
const MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

export default class Uint64Type extends EncodingType {
  public tag(): string {
    return "u";
  }

  public decode(str: any): number {
    if (!/^-?\d+$/.test(str)) {
      throw new Error(`invalid unsigned int: '${str}'`);
    }

    if (str[0] === "-") {
      throw new RangeError(`value is less than zero: ${str}`);
    }

    const result = parseInt(str, 10);

    if (result > MAX_SAFE_INTEGER) {
      throw new RangeError(`value not in safe integer range: ${str}`);
    }

    return result;
  }
}
