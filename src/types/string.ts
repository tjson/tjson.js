import EncodingType from "../encoding_type";

export default class StringType extends EncodingType {
  public tag(): string {
    return "s";
  }

  public decode(str: any): string {
    if (typeof str !== "string") {
      throw new Error(`not a valid string: ${str}`);
    }

    return str;
  }

  public encode(str: any): string {
    return str;
  }
}
