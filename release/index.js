define("src/datatype", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DataType {
        // Register a new TJSON datatype (used internally only)
        static register(type, tag = type.tag()) {
            if (tag in DataType.TAGS) {
                throw new Error(`type already registered for tag: '${tag}'`);
            }
            DataType.TAGS[tag] = type;
        }
        // Find a (simple) entry in the DataType.tags table
        static get(tag) {
            let result = DataType.TAGS[tag];
            if (result === undefined) {
                throw new Error(`unknown tag: "${tag}"`);
            }
            return result;
        }
        // Return the tag for this type
        tag() {
            throw new Error(`unimplemented`);
        }
        // Decode a value as this TJSON type
        decode(_value) {
            throw new Error(`unimplemented`);
        }
        // Encode a value as this TJSON type
        encode(_value) {
            throw new Error(`unimplemented`);
        }
    }
    DataType.TAGS = {};
    exports.DataType = DataType;
    class ScalarType extends DataType {
    }
    exports.ScalarType = ScalarType;
    class NonScalarType extends DataType {
        constructor(innerType) {
            super();
            this.innerType = innerType;
        }
    }
    exports.NonScalarType = NonScalarType;
});
define("src/datatype/set", ["require", "exports", "src/datatype", "index"], function (require, exports, datatype_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SetType extends datatype_1.NonScalarType {
        static identifyType(set) {
            let innerType = null;
            for (let elem of Array.from(set)) {
                let t = index_1.default.identifyType(elem);
                if (innerType === null) {
                    innerType = t;
                }
                else if (innerType.tag() !== t.tag()) {
                    throw new Error(`set contains heterogenous types: ${set}`);
                }
            }
            return new SetType(innerType);
        }
        constructor(innerType) {
            super(innerType);
        }
        tag() {
            if (this.innerType === null) {
                return "S<>";
            }
            else {
                return `S<${this.innerType.tag()}>`;
            }
        }
        decode(array) {
            if (this.innerType === null) {
                if (array.length > 0) {
                    throw new Error("no inner type specified for non-empty array");
                }
                else {
                    return new Set();
                }
            }
            let elements = [];
            for (let elem of array) {
                elements.push(this.innerType.decode(elem));
            }
            let set = new Set(elements);
            if (elements.length !== set.size) {
                throw new Error("set contains duplicate items");
            }
            return set;
        }
        encode(set) {
            return Array.from(set);
        }
    }
    exports.SetType = SetType;
});
define("src/datatype/binary", ["require", "exports", "src/datatype"], function (require, exports, datatype_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Binary16Type extends datatype_2.ScalarType {
        tag() {
            return "d16";
        }
        decode(hex) {
            if (hex === null || hex.length % 2 != 0 || !(/^[a-z0-9]*$/).test(hex)) {
                throw new Error(`invalid b16: ${hex}`);
            }
            let result = new Uint8Array(hex.length / 2);
            for (let i = 0; i < hex.length; i += 2) {
                result[i >> 1] = Binary16Type.LOOKUP_TABLE[hex.charCodeAt(i)] << 4 |
                    Binary16Type.LOOKUP_TABLE[hex.charCodeAt(i + 1)];
            }
            return new Uint8Array(result);
        }
        encode(bytes) {
            let result = new Array(bytes.length * 2);
            let alphabet = Binary16Type.BASE16_ALPHABET;
            for (let i = 0, j = 0; i < bytes.length; i++, j += 2) {
                result[j] = alphabet[bytes[i] >> 4];
                result[j + 1] = alphabet[bytes[i] & 0xF];
            }
            return result.join("");
        }
    }
    // RFC 4648 Base16 alphabet (lower case)
    Binary16Type.BASE16_ALPHABET = "0123456789abcdef";
    Binary16Type.LOOKUP_TABLE = Binary16Type.BASE16_ALPHABET.split("").reduce((arr, char) => {
        arr[char.charCodeAt(0)] = Binary16Type.BASE16_ALPHABET.indexOf(char);
        return arr;
    }, []);
    exports.Binary16Type = Binary16Type;
    class Binary32Type extends datatype_2.ScalarType {
        tag() {
            return "d32";
        }
        decode(b32) {
            if (b32 === null || !(/^[a-z0-9]*$/).test(b32)) {
                throw new Error(`invalid b32: ${b32}`);
            }
            let result = new Uint8Array(b32.length * 5 / 8);
            for (let i = 0, j = 0; i < b32.length; i += 8, j += 5) {
                let buf = new Uint8Array(8);
                let remaining = Math.min(b32.length - i, 8);
                for (let k = 0; k < remaining; k++) {
                    buf[k] = Binary32Type.LOOKUP_TABLE[b32.charCodeAt(i + k)];
                }
                result[j] = (buf[0] << 3) | (buf[1] >> 2);
                result[j + 1] = (buf[1] << 6) | (buf[2] << 1) | (buf[3] >> 4);
                result[j + 2] = (buf[3] << 4) | (buf[4] >> 1);
                result[j + 3] = (buf[4] << 7) | (buf[5] << 2) | (buf[6] >> 3);
                result[j + 4] = (buf[6] << 5) | buf[7];
            }
            return result;
        }
        encode(bytes) {
            let outputLength = Math.ceil(bytes.length / 5) * 8;
            let result = new Array(outputLength);
            let alphabet = Binary32Type.BASE32_ALPHABET;
            for (let i = 0, j = 0; i < bytes.length; i += 5, j += 8) {
                result[j] = alphabet[((bytes[i] & 0xF8) >> 3)];
                result[j + 1] = alphabet[(((bytes[i] & 0x07) << 2) | ((bytes[i + 1] & 0xC0) >> 6))];
                result[j + 2] = alphabet[((bytes[i + 1] & 0x3E) >> 1)];
                result[j + 3] = alphabet[(((bytes[i + 1] & 0x01) << 4) | ((bytes[i + 2] & 0xF0) >> 4))];
                result[j + 4] = alphabet[(((bytes[i + 2] & 0x0F) << 1) | (bytes[i + 3] >> 7))];
                result[j + 5] = alphabet[((bytes[i + 3] & 0x7C) >> 2)];
                result[j + 6] = alphabet[(((bytes[i + 3] & 0x03) << 3) | ((bytes[i + 4] & 0xE0) >> 5))];
                result[j + 7] = alphabet[(bytes[i + 4] & 0x1F)];
            }
            let offset = bytes.length % 5;
            if (offset != 0) {
                outputLength -= 8 - ((offset % 5) * 2) + (offset >= 3 ? 1 : 0);
            }
            return result.slice(0, outputLength).join("");
        }
    }
    // RFC 4648 Base32 alphabet (lower case)
    Binary32Type.BASE32_ALPHABET = "abcdefghijklmnopqrstuvwxyz234567";
    Binary32Type.LOOKUP_TABLE = Binary32Type.BASE32_ALPHABET.split("").reduce((arr, char) => {
        arr[char.charCodeAt(0)] = Binary32Type.BASE32_ALPHABET.indexOf(char);
        return arr;
    }, []);
    exports.Binary32Type = Binary32Type;
    class Binary64Type extends datatype_2.ScalarType {
        tag() {
            // Default to using "d" for Base64, per SHOULD in spec
            return "d";
        }
        decode(b64) {
            if (b64 === null || !(/^[A-Za-z0-9\-_]*$/).test(b64)) {
                throw new Error(`invalid b64: ${b64}`);
            }
            let result = new Uint8Array(b64.length * 3 / 4);
            for (let i = 0, j = 0; i < b64.length; i += 4, j += 3) {
                let buf = new Uint8Array(4);
                let remaining = Math.min(b64.length - i, 4);
                for (let k = 0; k < remaining; k++) {
                    buf[k] = Binary64Type.LOOKUP_TABLE[b64.charCodeAt(i + k)];
                }
                let value = (buf[0] << 18) | (buf[1] << 12) | (buf[2] << 6) | buf[3];
                result[j] = (value >> 16) & 0xFF;
                result[j + 1] = (value >> 8) & 0xFF;
                result[j + 2] = value & 0xFF;
            }
            return result;
        }
        encode(bytes) {
            let outputLength = Math.ceil(bytes.length / 3) * 4;
            let result = new Array(outputLength);
            let alphabet = Binary64Type.BASE64_ALPHABET;
            for (let i = 0, j = 0; i < bytes.length; i += 3, j += 4) {
                let value = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
                result[j] = alphabet[(value >> 18) & 63];
                result[j + 1] = alphabet[(value >> 12) & 63];
                result[j + 2] = alphabet[(value >> 6) & 63];
                result[j + 3] = alphabet[value & 63];
            }
            let offset = bytes.length % 3;
            if (offset != 0) {
                outputLength -= 3 - offset;
            }
            return result.slice(0, outputLength).join("");
        }
    }
    // RFC 4648 Base64url alphabet
    Binary64Type.BASE64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    Binary64Type.LOOKUP_TABLE = Binary64Type.BASE64_ALPHABET.split("").reduce((arr, char) => {
        arr[char.charCodeAt(0)] = Binary64Type.BASE64_ALPHABET.indexOf(char);
        return arr;
    }, []);
    exports.Binary64Type = Binary64Type;
});
define("src/datatype/boolean", ["require", "exports", "src/datatype"], function (require, exports, datatype_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BooleanType extends datatype_3.ScalarType {
        tag() {
            return "b";
        }
        decode(bool) {
            if (typeof bool !== "boolean") {
                throw new Error(`invalid boolean value type: ${bool}`);
            }
            return bool;
        }
        encode(bool) {
            return bool;
        }
    }
    exports.BooleanType = BooleanType;
});
define("src/datatype/float", ["require", "exports", "src/datatype"], function (require, exports, datatype_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class FloatType extends datatype_4.ScalarType {
        tag() {
            return "f";
        }
        decode(value) {
            if (typeof value !== "number") {
                throw new Error(`invalid floating point: ${value}`);
            }
            return value;
        }
        encode(value) {
            return value;
        }
    }
    exports.FloatType = FloatType;
});
define("src/datatype/integer", ["require", "exports", "src/datatype"], function (require, exports, datatype_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // TODO: Support full 64-bit integer range using https://tc39.github.io/proposal-integer/
    const MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
    const MIN_SAFE_INTEGER = -(Math.pow(2, 53) - 1);
    class IntType extends datatype_5.ScalarType {
        tag() {
            return "i";
        }
        decode(str) {
            if (!/^-?\d+$/.test(str)) {
                throw new Error(`invalid signed int: '${str}'`);
            }
            let result = parseInt(str);
            if (result > MAX_SAFE_INTEGER || result < MIN_SAFE_INTEGER) {
                throw new RangeError(`value not in safe integer range: ${result}`);
            }
            return result;
        }
    }
    exports.IntType = IntType;
    class UintType extends datatype_5.ScalarType {
        tag() {
            return "u";
        }
        decode(str) {
            if (!/^-?\d+$/.test(str)) {
                throw new Error(`invalid unsigned int: '${str}'`);
            }
            if (str[0] == "-") {
                throw new RangeError(`value is less than zero: ${str}`);
            }
            let result = parseInt(str);
            if (result > MAX_SAFE_INTEGER) {
                throw new RangeError(`value not in safe integer range: ${str}`);
            }
            return result;
        }
    }
    exports.UintType = UintType;
});
define("src/datatype/object", ["require", "exports", "src/datatype"], function (require, exports, datatype_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ObjectType extends datatype_6.NonScalarType {
        constructor() {
            super(null);
        }
        tag() {
            return "O";
        }
        decode(obj) {
            if (typeof obj !== "object") {
                throw new Error(`not a valid object: ${obj}`);
            }
            return obj;
        }
        encode(obj) {
            return obj;
        }
    }
    exports.ObjectType = ObjectType;
});
define("src/datatype/string", ["require", "exports", "src/datatype"], function (require, exports, datatype_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class StringType extends datatype_7.ScalarType {
        tag() {
            return "s";
        }
        decode(str) {
            if (typeof str !== "string") {
                throw new Error(`not a valid string: ${str}`);
            }
            return str;
        }
        encode(str) {
            return str;
        }
    }
    exports.StringType = StringType;
});
define("src/datatype/timestamp", ["require", "exports", "src/datatype"], function (require, exports, datatype_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TimestampType extends datatype_8.ScalarType {
        tag() {
            return "t";
        }
        decode(timestamp) {
            if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(timestamp)) {
                throw new Error(`invalid timestamp: '${timestamp}'`);
            }
            return new Date(Date.parse(timestamp));
        }
        encode(value) {
            // TODO: support subsecond precision in TJSON spec
            return value.toISOString().replace(/\.(\d){3}Z/, "Z");
        }
    }
    exports.TimestampType = TimestampType;
});
// TJSON: Tagged JSON with Rich Types
define("index", ["require", "exports", "utf8", "src/datatype", "src/datatype/array", "src/datatype/set", "src/datatype/binary", "src/datatype/boolean", "src/datatype/float", "src/datatype/integer", "src/datatype/object", "src/datatype/string", "src/datatype/timestamp"], function (require, exports, utf8, datatype_9, array_1, set_1, binary_1, boolean_1, float_1, integer_1, object_1, string_1, timestamp_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    datatype_9.DataType.register(new binary_1.Binary16Type);
    datatype_9.DataType.register(new binary_1.Binary32Type);
    datatype_9.DataType.register(new binary_1.Binary64Type);
    datatype_9.DataType.register(new binary_1.Binary64Type, "d64");
    datatype_9.DataType.register(new boolean_1.BooleanType);
    datatype_9.DataType.register(new float_1.FloatType);
    datatype_9.DataType.register(new integer_1.IntType);
    datatype_9.DataType.register(new integer_1.UintType);
    datatype_9.DataType.register(new object_1.ObjectType);
    datatype_9.DataType.register(new string_1.StringType);
    datatype_9.DataType.register(new timestamp_1.TimestampType);
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
                return datatype_9.DataType.get("O");
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
                        return datatype_9.DataType.get(tag);
                    default:
                        throw new Error(`invalid non-scalar type: ${tag}`);
                }
            }
            // Scalar
            if (/^[a-z][a-z0-9]*$/.test(tag)) {
                return datatype_9.DataType.get(tag);
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
                    return datatype_9.DataType.get("d");
                }
                else if (value instanceof Set) {
                    return set_1.SetType.identifyType(value);
                }
                else if (value instanceof Date) {
                    return datatype_9.DataType.get("t");
                }
                else {
                    return datatype_9.DataType.get("O");
                }
            }
            else if (typeof value === "string") {
                return datatype_9.DataType.get("s");
            }
            else if (typeof value === "number") {
                return datatype_9.DataType.get("f");
            }
            else if (typeof value === "boolean") {
                return datatype_9.DataType.get("b");
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
});
define("src/datatype/array", ["require", "exports", "src/datatype", "index"], function (require, exports, datatype_10, index_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ArrayType extends datatype_10.NonScalarType {
        static identifyType(array) {
            let innerType = null;
            for (let elem of array) {
                let t = index_2.default.identifyType(elem);
                if (innerType === null) {
                    innerType = t;
                }
                else if (innerType.tag() !== t.tag()) {
                    throw new Error(`array contains heterogenous types: [${array}]`);
                }
            }
            return new ArrayType(innerType);
        }
        constructor(innerType) {
            super(innerType);
        }
        tag() {
            if (this.innerType === null) {
                return "A<>";
            }
            else {
                return `A<${this.innerType.tag()}>`;
            }
        }
        decode(array) {
            if (this.innerType === null) {
                if (array.length > 0) {
                    throw new Error("no inner type specified for non-empty array");
                }
                else {
                    return [];
                }
            }
            let result = [];
            for (let elem of array) {
                result.push(this.innerType.decode(elem));
            }
            return result;
        }
        encode(array) {
            return array;
        }
    }
    exports.ArrayType = ArrayType;
});
