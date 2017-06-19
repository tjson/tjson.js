// TJSON: Tagged JSON with Rich Types

import * as utf8 from "utf8";

import EncodingType from "./encoding_type";

import ArrayType from "./types/array";
import BooleanType from "./types/boolean";
import Base16DataType from "./types/data/base16";
import Base32DataType from "./types/data/base32";
import Base64DataType from "./types/data/base64";
import FloatType from "./types/float";
import Int64Type from "./types/integer/int64";
import Uint64Type from "./types/integer/uint64";
import ObjectType from "./types/object";
import SetType from "./types/set";
import StringType from "./types/string";
import TimestampType from "./types/timestamp";

EncodingType.register(new Base16DataType());
EncodingType.register(new Base32DataType());
EncodingType.register(new Base64DataType());
EncodingType.register(new Base64DataType(), "d64");
EncodingType.register(new BooleanType());
EncodingType.register(new FloatType());
EncodingType.register(new Int64Type());
EncodingType.register(new Uint64Type());
EncodingType.register(new ObjectType());
EncodingType.register(new StringType());
EncodingType.register(new TimestampType());

/** Main API for working with Tagged JSON (TJSON) */
export default class TJSON {
  /** Parse a UTF-8 encoded TJSON string */
  public static parse(tjsonString: string, decodeUTF8 = true) {
    const decodedString = decodeUTF8 ? utf8.decode(tjsonString) : tjsonString;
    const result = JSON.parse(decodedString, TJSON.reviver);

    if (Array.isArray(result)) {
      throw new Error("toplevel arrays are not allowed in TJSON");
    }

    return result;
  }

  /** Convert a value to TJSON */
  public static stringify(value: any, space: number | string = 0, encodeUTF8 = true): string {
    const result = JSON.stringify(value, TJSON.replacer, space);
    return encodeUTF8 ? utf8.encode(result) : result;
  }

  /** Parse a TJSON type signature into the corresponding EncodingType object */
  public static parseType(tag: string): EncodingType {
    // Object
    if (tag === "O") {
      return EncodingType.get("O");
    }

    // Non-Scalar
    const result = tag.match(/^([A-Z][a-z0-9]*)<(.*)>$/);

    if (result !== null) {
      const prefix = result[1];
      const inner = result[2];

      switch (prefix) {
        case "A":
          if (inner === "") {
            return new ArrayType(null);
          } else {
            return new ArrayType(TJSON.parseType(inner));
          }
        case "S":
          if (inner === "") {
            return new SetType(null);
          } else {
            return new SetType(TJSON.parseType(inner));
          }
        case "O":
          return EncodingType.get(tag);
        default:
          throw new Error(`invalid non-scalar type: ${tag}`);
      }
    }

    // Scalar
    if (/^[a-z][a-z0-9]*$/.test(tag)) {
      return EncodingType.get(tag);
    } else {
      throw new Error(`invalid tag: "${tag}"`);
    }
  }

  /** Identify the TJSON EncodingType for a given value */
  public static identifyType(value: any): EncodingType {
    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return ArrayType.identifyType(value);
      } else if (value instanceof Uint8Array) {
        return EncodingType.get("d");
      } else if (value instanceof Set) {
        return SetType.identifyType(value);
      } else if (value instanceof Date) {
        return EncodingType.get("t");
      } else {
        return EncodingType.get("O");
      }
    } else if (typeof value === "string") {
      return EncodingType.get("s");
    } else if (typeof value === "number") {
      return EncodingType.get("f");
    } else if (typeof value === "boolean") {
      return EncodingType.get("b");
    } else {
      throw new Error(`unsupported TJSON value: ${value}`);
    }
  }

  /** Look for objects in parsed JSON, extract their types, and decode their values */
  public static reviver(_key: any, value: any): any {
    // Ignore non-objects (including arrays). Transform them on the next pass
    if (typeof value !== "object" || Array.isArray(value)) {
      return value;
    }

    const result: any = {};

    Object.keys(value).forEach((key) => {
      const tagResult = key.match(/^(.*):([A-Za-z0-9\<]+[\>]*)$/);

      if (tagResult === null) {
        throw new Error(`failed to parse tag: ${key}`);
      }

      const untaggedKey = tagResult[1];
      const tag = tagResult[2];
      const childValue = value[key];

      const type = TJSON.parseType(tag);
      result[untaggedKey] = type.decode(childValue);
    });

    return result;
  }

  /** Serializer for TJSON objects when building JSON strings */
  public static replacer(_key: any, value: any): any {
    // Ignore non-objects (including arrays). They'll already by transformed
    // at this point (by the code below)
    if (typeof value !== "object" || Array.isArray(value)) {
      return value;
    }

    const result: any = {};

    Object.keys(value).forEach((key) => {
      const childValue = value[key];
      const type = TJSON.identifyType(childValue);

      // Add tag to resulting field
      result[key + ":" + type.tag()] = type.encode(childValue);
    });

    return result;
  }
}
