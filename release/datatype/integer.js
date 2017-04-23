"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datatype_1 = require("../datatype");
// TODO: Support full 64-bit integer range using https://tc39.github.io/proposal-integer/
const MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
const MIN_SAFE_INTEGER = -(Math.pow(2, 53) - 1);
class IntType extends datatype_1.ScalarType {
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
class UintType extends datatype_1.ScalarType {
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
