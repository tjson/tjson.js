import { ScalarType } from "../datatype";
export declare class IntType extends ScalarType {
    tag(): string;
    decode(str: any): number;
}
export declare class UintType extends ScalarType {
    tag(): string;
    decode(str: any): number;
}
