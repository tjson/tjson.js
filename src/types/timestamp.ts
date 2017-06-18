import EncodingType from "../encoding_type";

export default class TimestampType extends EncodingType {
  public tag(): string {
    return "t";
  }

  public decode(timestamp: any): Date {
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(timestamp)) {
      throw new Error(`invalid timestamp: '${timestamp}'`);
    }

    return new Date(Date.parse(timestamp));
  }

  public encode(value: any): number {
    // TODO: support subsecond precision in TJSON spec
    return value.toISOString().replace(/\.(\d){3}Z/, "Z");
  }
}
