import { NonScalarType } from "../datatype";
export declare class ObjectType extends NonScalarType {
    constructor();
    tag(): string;
    decode(obj: any): object;
    encode(obj: any): object;
}
