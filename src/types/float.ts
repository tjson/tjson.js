import EncodingType from "../encoding_type";

export default class FloatType extends EncodingType {
  public tag(): string {
    return "f";
  }

  public decode(value: any): number {
    if (typeof value !== "number") {
      throw new Error(`invalid floating point: ${value}`);
    }

    return value;
  }

  public encode(value: any): number {
    return value;
  }
}
