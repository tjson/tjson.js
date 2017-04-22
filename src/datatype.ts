export class DataType {
  static TAGS: any = {};

  // Register a new TJSON datatype (used internally only)
  public static register(type: DataType) {
    let tag = type.tag();

    if (tag in DataType.TAGS) {
      throw new Error(`type already registered for tag: '${tag}'`);
    }

    DataType.TAGS[tag] = type;
  }

  // Find a (simple) entry in the DataType.tags table
  public static get(tag: string): DataType {
    let result = DataType.TAGS[tag];

    if (result === undefined) {
      throw new Error(`unknown tag: "${tag}"`);
    }

    return result;
  }

  // Return the tag for this type
  tag(): string {
    throw new Error(`unimplemented`);
  }

  // Decode a value as this TJSON type
  decode(_value: any): any {
    throw new Error(`unimplemented`);
  }

  // Encode a value as this TJSON type
  encode(_value: any): any {
    throw new Error(`unimplemented`);
  }
}

export class ScalarType extends DataType {
}

export class NonScalarType extends DataType {
  readonly innerType: DataType | null;

  constructor(innerType: DataType | null) {
    super();
    this.innerType = innerType;
  }
}
