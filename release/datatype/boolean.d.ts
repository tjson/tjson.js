import { ScalarType } from "../datatype";
export declare class BooleanType extends ScalarType {
    tag(): string;
    decode(bool: any): boolean;
    encode(bool: any): boolean;
}
