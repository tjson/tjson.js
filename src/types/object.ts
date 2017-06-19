import NonScalarType from "../non_scalar_type";

export default class ObjectType extends NonScalarType {
  constructor() {
    super(null);
  }

  public tag(): string {
    return "O";
  }

  public decode(obj: any): object {
    if (typeof obj !== "object") {
      throw new Error(`not a valid object: ${obj}`);
    }

    return obj;
  }

  public encode(obj: any): object {
    return obj;
  }
}
