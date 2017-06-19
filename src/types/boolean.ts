import EncodingType from "../encoding_type";

export default class BooleanType extends EncodingType {
  public tag(): string {
    return "b";
  }

  public decode(bool: any): boolean {
    if (typeof bool !== "boolean") {
      throw new Error(`invalid boolean value type: ${bool}`);
    }

    return bool;
  }

  public encode(bool: any): boolean {
    return bool;
  }
}
