import { NonScalarType } from "../datatype";
import TJSON from "../tjson";

export class ObjectType extends NonScalarType {
  constructor() {
    super(null);
  }

  tag(): string {
    return "O";
  }

  decode(obj: any): object {
    if (typeof obj !== "object") {
      throw new Error(`not a valid object: ${obj}`);
    }

    return obj;
  }

  encode(obj: any): object {
    return obj;
  }
}
