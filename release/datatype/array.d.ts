import { DataType, NonScalarType } from "../datatype";
export declare class ArrayType extends NonScalarType {
    static identifyType(array: any[]): DataType;
    constructor(innerType: DataType | null);
    tag(): string;
    decode(array: any[]): object;
    encode(array: any[]): any[];
}
