"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datatype_1 = require("../datatype");
class StringType extends datatype_1.ScalarType {
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
