"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datatype_1 = require("../datatype");
const index_1 = require("../../index");
class ArrayType extends datatype_1.NonScalarType {
    static identifyType(array) {
        let innerType = null;
        for (let elem of array) {
            let t = index_1.default.identifyType(elem);
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
