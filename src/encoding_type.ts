/** Base class of all tag encodings used by TJSON */
export default class EncodingType {
  public static TAGS: any = {};

  /** Register a new TJSON datatype (used internally only) */
  public static register(type: EncodingType, tag = type.tag()) {
    if (tag in EncodingType.TAGS) {
      throw new Error(`type already registered for tag: '${tag}'`);
    }

    EncodingType.TAGS[tag] = type;
  }

  /** Find a (simple) entry in the EncodingType.tags table */
  public static get(tag: string): EncodingType {
    const result = EncodingType.TAGS[tag];

    if (result === undefined) {
      throw new Error(`unknown tag: "${tag}"`);
    }

    return result;
  }

  /** Return the tag for this type */
  public tag(): string {
    throw new Error(`unimplemented`);
  }

  /** Decode a value as this TJSON type */
  public decode(_value: any): any {
    throw new Error(`unimplemented`);
  }

  /** Encode a value as this TJSON type */
  public encode(_value: any): any {
    throw new Error(`unimplemented`);
  }
}
