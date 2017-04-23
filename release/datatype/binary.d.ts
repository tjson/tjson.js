import { ScalarType } from "../datatype";
export declare class Binary16Type extends ScalarType {
    static readonly BASE16_ALPHABET: string;
    static readonly LOOKUP_TABLE: number[];
    tag(): string;
    decode(hex: any): Uint8Array;
    encode(bytes: Uint8Array): string;
}
export declare class Binary32Type extends ScalarType {
    static readonly BASE32_ALPHABET: string;
    static readonly LOOKUP_TABLE: number[];
    tag(): string;
    decode(b32: any): Uint8Array;
    encode(bytes: Uint8Array): string;
}
export declare class Binary64Type extends ScalarType {
    static readonly BASE64_ALPHABET: string;
    static readonly LOOKUP_TABLE: number[];
    tag(): string;
    decode(b64: any): Uint8Array;
    encode(bytes: Uint8Array): string;
}
