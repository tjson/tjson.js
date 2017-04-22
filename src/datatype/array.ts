import { DataType, NonScalarType } from "../datatype";
import TJSON from "../../index";

export class ArrayType extends NonScalarType {
  public static identifyType(array: any[]): DataType {
    let innerType: DataType | null = null;

    for (let elem of array) {
      let t = TJSON.identifyType(elem);
      if (innerType === null) {
        innerType = t;
      } else if (innerType.tag() !== t.tag()) {
        throw new Error(`array contains heterogenous types: [${array}]`);
      }
    }

    return new ArrayType(innerType);
  }

  constructor(innerType: DataType | null) {
    super(innerType);
  }

  tag(): string {
    if (this.innerType === null) {
      return "A<>";
    } else {
      return `A<${this.innerType.tag()}>`;
    }
  }

  decode(array: any[]): object {
    if (this.innerType === null) {
      if (array.length > 0) {
        throw new Error("no inner type specified for non-empty array");
      } else {
        return [];
      }
    }

    let result = [];

    for (let elem of array) {
      result.push(this.innerType.decode(elem));
    }

    return result;
  }

  encode(array: any[]): any[] {
    return array;
  }
}
