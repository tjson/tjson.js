"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datatype_1 = require("../datatype");
class ObjectType extends datatype_1.NonScalarType {
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
