import EncodingType from "../encoding_type";
import NonScalarType from "../non_scalar_type";
import TJSON from "../tjson";

export default class SetType extends NonScalarType {
  public static identifyType(set: Set<any>): EncodingType {
    let innerType: EncodingType | null = null;

    for (const elem of Array.from(set)) {
      const t = TJSON.identifyType(elem);
      if (innerType === null) {
        innerType = t;
      } else if (innerType.tag() !== t.tag()) {
        throw new Error(`set contains heterogenous types: ${set}`);
      }
    }

    return new SetType(innerType);
  }

  constructor(innerType: EncodingType | null) {
    super(innerType);
  }

  public tag(): string {
    if (this.innerType === null) {
      return "S<>";
    } else {
      return `S<${this.innerType.tag()}>`;
    }
  }

  public decode(array: any[]): object {
    if (this.innerType === null) {
      if (array.length > 0) {
        throw new Error("no inner type specified for non-empty array");
      } else {
        return new Set();
      }
    }

    const elements = [];

    for (const elem of array) {
      elements.push(this.innerType.decode(elem));
    }

    const set = new Set(elements);

    if (elements.length !== set.size) {
      throw new Error("set contains duplicate items");
    }

    return set;
  }

  public encode(set: Set<any>): any[] {
    return Array.from(set);
  }
}
