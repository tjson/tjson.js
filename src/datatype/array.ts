import { DataType, NonScalarType } from "../datatype";

export class ArrayType extends NonScalarType {
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

  convert(array: any[]): object {
    if (this.innerType === null) {
      if (array.length > 0) {
        throw new Error("no inner type specified for non-empty array");
      } else {
        return [];
      }
    }

    let result = [];

    for (let elem of array) {
      result.push(this.innerType.convert(elem));
    }

    return result;
  }
}
