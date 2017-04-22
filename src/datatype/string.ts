import { ScalarType } from "../datatype";

export class StringType extends ScalarType {
  tag(): string {
    return "s";
  }

  decode(str: any): string {
    if (typeof str !== "string") {
      throw new Error(`not a valid string: ${str}`);
    }

    return str;
  }

  encode(str: any): string {
    return str;
  }
}
