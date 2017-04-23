import { ScalarType } from "../datatype";
export declare class TimestampType extends ScalarType {
    tag(): string;
    decode(timestamp: any): Date;
    encode(value: any): number;
}
