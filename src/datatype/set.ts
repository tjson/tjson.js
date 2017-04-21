import { DataType, NonScalarType } from "../datatype";

export class SetType extends NonScalarType {
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

  convert(array: any[]): object {
    if (this.innerType === null) {
      if (array.length > 0) {
        throw new Error("no inner type specified for non-empty array");
      } else {
        return new Set();
      }
    }

    let elements = [];

    for (let elem of array) {
      elements.push(this.innerType.convert(elem));
    }

    let set = new Set(elements);

    if (elements.length !== set.size) {
      throw new Error("set contains duplicate items");
    }

    return set;
  }
}
