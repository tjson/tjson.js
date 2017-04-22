import { ScalarType } from "../datatype";

export class BooleanType extends ScalarType {
  tag(): string {
    return "b";
  }

  decode(bool: any): boolean {
    if (typeof bool !== "boolean") {
      throw new Error(`invalid boolean value type: ${bool}`);
    }

    return bool;
  }

  encode(bool: any): boolean {
    return bool;
  }
}
