import { ScalarType } from "../datatype";

export class StringType extends ScalarType {
  tag(): string {
    return "s";
  }

  convert(str: any): string {
    if (typeof str !== "string") {
      throw new Error(`not a valid string: ${str}`);
    }

    return str;
  }
}
