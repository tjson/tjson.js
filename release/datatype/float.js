"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datatype_1 = require("../datatype");
class FloatType extends datatype_1.ScalarType {
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
