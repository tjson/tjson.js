// TJSON: Tagged JSON with Rich Types

import * as utf8 from "utf8";
import { DataType } from "./src/datatype";
import { ArrayType } from "./src/datatype/array";
import { SetType } from "./src/datatype/set";
import { Binary16Type, Binary32Type, Binary64Type } from "./src/datatype/binary";
import { BooleanType } from "./src/datatype/boolean";
import { FloatType } from "./src/datatype/float";
import { IntType, UintType } from "./src/datatype/integer";
import { ObjectType } from "./src/datatype/object";
import { StringType } from "./src/datatype/string";
import { TimestampType } from "./src/datatype/timestamp";

DataType.register(new Binary16Type);
DataType.register(new Binary32Type);
DataType.register(new Binary64Type);
DataType.register(new Binary64Type, "d64");
DataType.register(new BooleanType);
DataType.register(new FloatType);
DataType.register(new IntType);
DataType.register(new UintType);
DataType.register(new ObjectType);
DataType.register(new StringType);
DataType.register(new TimestampType);

export default class TJSON {
  // Parse a UTF-8 encoded TJSON string
  public static parse(tjsonString: string, decodeUTF8 = true) {
    let decodedString = decodeUTF8 ? utf8.decode(tjsonString) : tjsonString;
    let result = JSON.parse(decodedString, TJSON.reviver);

    if (Array.isArray(result)) {
      throw new Error("toplevel arrays are not allowed in TJSON");
    }

    return result;
  }

  // Convert a value to TJSON
  public static stringify(value: any, space: number | string = 0, encodeUTF8 = true): string {
    let result = JSON.stringify(value, TJSON.replacer, space);
    return encodeUTF8 ? utf8.encode(result) : result;
  }

  // Parse a TJSON type signature into the corresponding DataType object
  public static parseType(tag: string): DataType {
    // Object
    if (tag == "O") {
      return DataType.get("O");
    }

    // Non-Scalar
    let result = tag.match(/^([A-Z][a-z0-9]*)<(.*)>$/);

    if (result !== null) {
      let prefix = result[1];
      let inner = result[2];

      switch (prefix) {
        case "A":
          if (inner == "") {
            return new ArrayType(null);
          } else {
            return new ArrayType(TJSON.parseType(inner));
          }
        case "S":
          if (inner == "") {
            return new SetType(null);
          } else {
            return new SetType(TJSON.parseType(inner));
          }
        case "O":
          return DataType.get(tag);
        default:
          throw new Error(`invalid non-scalar type: ${tag}`);
      }
    }

    // Scalar
    if (/^[a-z][a-z0-9]*$/.test(tag)) {
      return DataType.get(tag);
    } else {
      throw new Error(`invalid tag: "${tag}"`);
    }
  }

  // Identify the TJSON DataType for a given value
  public static identifyType(value: any): DataType {
    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return ArrayType.identifyType(value);
      } else if (value instanceof Uint8Array) {
        return DataType.get("d");
      } else if (value instanceof Set) {
        return SetType.identifyType(value);
      } else if (value instanceof Date) {
        return DataType.get("t");
      } else {
        return DataType.get("O");
      }
    } else if (typeof value === "string") {
      return DataType.get("s");
    } else if (typeof value === "number") {
      return DataType.get("f");
    } else if (typeof value === "boolean") {
      return DataType.get("b");
    } else {
      throw new Error(`unsupported TJSON value: ${value}`);
    }
  }

  // Look for objects in parsed JSON, extract their types, and decode their values
  static reviver(_key: any, value: any): any {
    // Ignore non-objects (including arrays). Transform them on the next pass
    if (typeof value !== "object" || Array.isArray(value)) {
      return value;
    }

    let result: any = {};

    Object.keys(value).forEach(key => {
      let tagResult = key.match(/^(.*):([A-Za-z0-9\<]+[\>]*)$/);

      if (tagResult === null) {
        throw new Error(`failed to parse tag: ${key}`);
      }

      let untaggedKey = tagResult[1];
      let tag = tagResult[2];
      let childValue = value[key];

      let type = TJSON.parseType(tag);
      result[untaggedKey] = type.decode(childValue);
    });

    return result;
  }

  // Serializer for TJSON objects when building JSON strings
  static replacer(_key: any, value: any): any {
    // Ignore non-objects (including arrays). They'll already by transformed
    // at this point (by the code below)
    if (typeof value !== "object" || Array.isArray(value)) {
      return value;
    }

    let result: any = {};

    Object.keys(value).forEach(key => {
      let childValue = value[key];
      let type = TJSON.identifyType(childValue);

      // Add tag to resulting field
      result[key + ":" + type.tag()] = type.encode(childValue);
    });

    return result;
  }
}
