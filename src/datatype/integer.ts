import { ScalarType } from "../datatype";

// TODO: Support full 64-bit integer range using https://tc39.github.io/proposal-integer/
const MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
const MIN_SAFE_INTEGER = -(Math.pow(2, 53) - 1);

export class IntType extends ScalarType {
  tag(): string {
    return "i";
  }

  convert(str: any): number {
    if (!/^-?\d+$/.test(str)) {
      throw new Error(`invalid signed int: '${str}'`);
    }

    let result = parseInt(str);

    if (result > MAX_SAFE_INTEGER || result < MIN_SAFE_INTEGER) {
      throw new RangeError(`value not in safe integer range: ${result}`);
    }

    return result
  }
}

export class UintType extends ScalarType {
  tag(): string {
    return "u";
  }

  convert(str: any): number {
    if (!/^-?\d+$/.test(str)) {
      throw new Error(`invalid unsigned int: '${str}'`);
    }

    if (str[0] == "-") {
      throw new RangeError(`value is less than zero: ${str}`);
    }

    let result = parseInt(str);

    if (result > MAX_SAFE_INTEGER) {
      throw new RangeError(`value not in safe integer range: ${str}`);
    }

    return result
  }
}
