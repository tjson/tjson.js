// TJSON: Tagged JSON with Rich Types

import * as utf8 from "utf8";
import { DataType } from "./src/datatype";
import { ArrayType } from "./src/datatype/array";
import { SetType } from "./src/datatype/set";
import { Binary16Type, Binary32Type, Binary64Type } from "./src/datatype/binary";
import { IntType, UintType } from "./src/datatype/integer";
import { FloatType } from "./src/datatype/float";
import { ObjectType } from "./src/datatype/object";
import { StringType } from "./src/datatype/string";
import { TimestampType } from "./src/datatype/timestamp";
import { ValueType } from "./src/datatype/value";

DataType.register(new Binary16Type);
DataType.register(new Binary32Type);
DataType.register(new Binary64Type);
DataType.register(new FloatType);
DataType.register(new IntType);
DataType.register(new UintType);
DataType.register(new ObjectType);
DataType.register(new StringType);
DataType.register(new TimestampType);
DataType.register(new ValueType);

export default class TJSON {
  // Parse a UTF-8 encoded TJSON string
  public static parse(tjsonString: string) {
    let decodedString = utf8.decode(tjsonString);
    let result = JSON.parse(decodedString, TJSON.reviver);

    if (Array.isArray(result)) {
      throw new Error("toplevel arrays are not allowed in TJSON");
    }

    return result;
  }

  // Look for objects in parsed JSON, extract their types, and convert their values
  static reviver(_key: any, value: any) {
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
      result[untaggedKey] = type.convert(childValue);
    });

    return result;
  }

  // Parse a TJSON type signature into the corresponding DateTime object
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
}
