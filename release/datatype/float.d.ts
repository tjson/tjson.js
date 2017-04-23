import { ScalarType } from "../datatype";
export declare class FloatType extends ScalarType {
    tag(): string;
    decode(value: any): number;
    encode(value: any): number;
}
