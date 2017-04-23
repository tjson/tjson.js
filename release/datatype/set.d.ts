import { DataType, NonScalarType } from "../datatype";
export declare class SetType extends NonScalarType {
    static identifyType(set: Set<any>): DataType;
    constructor(innerType: DataType | null);
    tag(): string;
    decode(array: any[]): object;
    encode(set: Set<any>): any[];
}
