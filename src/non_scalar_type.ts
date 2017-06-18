import EncodingType from "./encoding_type";

/** Non-scalars are data structures containing other types (e.g. arrays, sets) */
export default class NonScalarType extends EncodingType {
  public readonly innerType: EncodingType | null;

  constructor(innerType: EncodingType | null) {
    super();
    this.innerType = innerType;
  }
}
