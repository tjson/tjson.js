import { NonScalarType } from "../datatype";

export class ObjectType extends NonScalarType {
  constructor() {
    super(null);
  }

  tag(): string {
    return "O";
  }

  convert(obj: any): object {
    if(typeof obj !== "object") {
      throw new Error(`not a valid object: ${obj}`);
    }

    return obj;
  }
}
