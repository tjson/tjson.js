import { DataType, NonScalarType } from "../datatype";
import TJSON from "../tjson";

export class SetType extends NonScalarType {
  public static identifyType(set: Set<any>): DataType {
    let innerType: DataType | null = null;

    for (let elem of Array.from(set)) {
      let t = TJSON.identifyType(elem);
      if (innerType === null) {
        innerType = t;
      } else if (innerType.tag() !== t.tag()) {
        throw new Error(`set contains heterogenous types: ${set}`);
      }
    }

    return new SetType(innerType);
  }

  constructor(innerType: DataType | null) {
    super(innerType);
  }

  tag(): string {
    if (this.innerType === null) {
      return "S<>";
    } else {
      return `S<${this.innerType.tag()}>`;
    }
  }

  decode(array: any[]): object {
    if (this.innerType === null) {
      if (array.length > 0) {
        throw new Error("no inner type specified for non-empty array");
      } else {
        return new Set();
      }
    }

    let elements = [];

    for (let elem of array) {
      elements.push(this.innerType.decode(elem));
    }

    let set = new Set(elements);

    if (elements.length !== set.size) {
      throw new Error("set contains duplicate items");
    }

    return set;
  }

  encode(set: Set<any>): any[] {
    return Array.from(set);
  }
}
