import { ScalarType } from "../datatype";

export class FloatType extends ScalarType {
  tag(): string {
    return "f";
  }

  decode(value: any): number {
    if (typeof value !== "number") {
      throw new Error(`invalid floating point: ${value}`);
    }

    return value;
  }

  encode(value: any): number {
    return value;
  }
}
