"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datatype_1 = require("../datatype");
const index_1 = require("../../index");
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
