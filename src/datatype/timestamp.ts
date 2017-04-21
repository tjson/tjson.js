import { ScalarType } from "../datatype";

export class TimestampType extends ScalarType {
  tag(): string {
    return "t";
  }

  convert(timestamp: any): Date {
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(timestamp)) {
      throw new Error(`invalid timestamp: '${timestamp}'`);
    }

    return new Date(Date.parse(timestamp));
  }
}
