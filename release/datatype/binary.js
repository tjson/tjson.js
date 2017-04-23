"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datatype_1 = require("../datatype");
class Binary16Type extends datatype_1.ScalarType {
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
class Binary32Type extends datatype_1.ScalarType {
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
class Binary64Type extends datatype_1.ScalarType {
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
