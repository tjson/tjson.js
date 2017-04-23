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
