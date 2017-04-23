"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datatype_1 = require("../datatype");
class TimestampType extends datatype_1.ScalarType {
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
