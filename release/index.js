"use strict";
// TJSON: Tagged JSON with Rich Types
Object.defineProperty(exports, "__esModule", { value: true });
const utf8 = require("utf8");
const datatype_1 = require("./src/datatype");
const array_1 = require("./src/datatype/array");
const set_1 = require("./src/datatype/set");
const binary_1 = require("./src/datatype/binary");
const boolean_1 = require("./src/datatype/boolean");
const float_1 = require("./src/datatype/float");
const integer_1 = require("./src/datatype/integer");
const object_1 = require("./src/datatype/object");
const string_1 = require("./src/datatype/string");
const timestamp_1 = require("./src/datatype/timestamp");
datatype_1.DataType.register(new binary_1.Binary16Type);
datatype_1.DataType.register(new binary_1.Binary32Type);
datatype_1.DataType.register(new binary_1.Binary64Type);
datatype_1.DataType.register(new binary_1.Binary64Type, "d64");
datatype_1.DataType.register(new boolean_1.BooleanType);
datatype_1.DataType.register(new float_1.FloatType);
datatype_1.DataType.register(new integer_1.IntType);
datatype_1.DataType.register(new integer_1.UintType);
datatype_1.DataType.register(new object_1.ObjectType);
datatype_1.DataType.register(new string_1.StringType);
datatype_1.DataType.register(new timestamp_1.TimestampType);
class TJSON {
    // Parse a UTF-8 encoded TJSON string
    static parse(tjsonString, decodeUTF8 = true) {
        let decodedString = decodeUTF8 ? utf8.decode(tjsonString) : tjsonString;
        let result = JSON.parse(decodedString, TJSON.reviver);
        if (Array.isArray(result)) {
            throw new Error("toplevel arrays are not allowed in TJSON");
        }
        return result;
    }
    // Convert a value to TJSON
    static stringify(value, space = 0, encodeUTF8 = true) {
        let result = JSON.stringify(value, TJSON.replacer, space);
        return encodeUTF8 ? utf8.encode(result) : result;
    }
    // Parse a TJSON type signature into the corresponding DataType object
    static parseType(tag) {
        // Object
        if (tag == "O") {
            return datatype_1.DataType.get("O");
        }
        // Non-Scalar
        let result = tag.match(/^([A-Z][a-z0-9]*)<(.*)>$/);
        if (result !== null) {
            let prefix = result[1];
            let inner = result[2];
            switch (prefix) {
                case "A":
                    if (inner == "") {
                        return new array_1.ArrayType(null);
                    }
                    else {
                        return new array_1.ArrayType(TJSON.parseType(inner));
                    }
                case "S":
                    if (inner == "") {
                        return new set_1.SetType(null);
                    }
                    else {
                        return new set_1.SetType(TJSON.parseType(inner));
                    }
                case "O":
                    return datatype_1.DataType.get(tag);
                default:
                    throw new Error(`invalid non-scalar type: ${tag}`);
            }
        }
        // Scalar
        if (/^[a-z][a-z0-9]*$/.test(tag)) {
            return datatype_1.DataType.get(tag);
        }
        else {
            throw new Error(`invalid tag: "${tag}"`);
        }
    }
    // Identify the TJSON DataType for a given value
    static identifyType(value) {
        if (typeof value === "object") {
            if (Array.isArray(value)) {
                return array_1.ArrayType.identifyType(value);
            }
            else if (value instanceof Uint8Array) {
                return datatype_1.DataType.get("d");
            }
            else if (value instanceof Set) {
                return set_1.SetType.identifyType(value);
            }
            else if (value instanceof Date) {
                return datatype_1.DataType.get("t");
            }
            else {
                return datatype_1.DataType.get("O");
            }
        }
        else if (typeof value === "string") {
            return datatype_1.DataType.get("s");
        }
        else if (typeof value === "number") {
            return datatype_1.DataType.get("f");
        }
        else if (typeof value === "boolean") {
            return datatype_1.DataType.get("b");
        }
        else {
            throw new Error(`unsupported TJSON value: ${value}`);
        }
    }
    // Look for objects in parsed JSON, extract their types, and decode their values
    static reviver(_key, value) {
        // Ignore non-objects (including arrays). Transform them on the next pass
        if (typeof value !== "object" || Array.isArray(value)) {
            return value;
        }
        let result = {};
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
    static replacer(_key, value) {
        // Ignore non-objects (including arrays). They'll already by transformed
        // at this point (by the code below)
        if (typeof value !== "object" || Array.isArray(value)) {
            return value;
        }
        let result = {};
        Object.keys(value).forEach(key => {
            let childValue = value[key];
            let type = TJSON.identifyType(childValue);
            // Add tag to resulting field
            result[key + ":" + type.tag()] = type.encode(childValue);
        });
        return result;
    }
}
exports.default = TJSON;
