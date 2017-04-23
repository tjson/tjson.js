import { ScalarType } from "../datatype";
export declare class StringType extends ScalarType {
    tag(): string;
    decode(str: any): string;
    encode(str: any): string;
}
