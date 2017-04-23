"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datatype_1 = require("../datatype");
class BooleanType extends datatype_1.ScalarType {
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
