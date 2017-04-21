export class DataType {
  static TAGS: any = {};

  public static register(type: DataType) {
    let tag = type.tag();

    if (tag in DataType.TAGS) {
      throw new Error(`type already registered for tag: '${tag}'`);
    }

    DataType.TAGS[tag] = type;
  }

  public static get(tag: string): DataType {
    let result = DataType.TAGS[tag];

    if (result === undefined) {
      throw new Error(`unknown tag: "${tag}"`);
    }

    return result;
  }

  tag(): string {
    throw new Error(`unimplemented`);
  }

  convert(_value: any): any {
    throw new Error(`unimplemented`);
  }
}

export class ScalarType extends DataType {
  isScalar(): boolean {
    return true;
  }
}

export class NonScalarType extends DataType {
  readonly innerType: DataType | null;

  constructor(innerType: DataType | null) {
    super();
    this.innerType = innerType;
  }

  isScalar(): boolean {
    return false;
  }
}
