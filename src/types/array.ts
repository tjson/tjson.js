import EncodingType from "../encoding_type";
import NonScalarType from "../non_scalar_type";
import TJSON from "../tjson";

export default class ArrayType extends NonScalarType {
  public static identifyType(array: any[]): EncodingType {
    let innerType: EncodingType | null = null;

    for (const elem of array) {
      const t = TJSON.identifyType(elem);
      if (innerType === null) {
        innerType = t;
      } else if (innerType.tag() !== t.tag()) {
        throw new Error(`array contains heterogenous types: [${array}]`);
      }
    }

    return new ArrayType(innerType);
  }

  constructor(innerType: EncodingType | null) {
    super(innerType);
  }

  public tag(): string {
    if (this.innerType === null) {
      return "A<>";
    } else {
      return `A<${this.innerType.tag()}>`;
    }
  }

  public decode(array: any[]): object {
    if (this.innerType === null) {
      if (array.length > 0) {
        throw new Error("no inner type specified for non-empty array");
      } else {
        return [];
      }
    }

    const result = [];

    for (const elem of array) {
      result.push(this.innerType.decode(elem));
    }

    return result;
  }

  public encode(array: any[]): any[] {
    return array;
  }
}
