export declare class DataType {
    static TAGS: any;
    static register(type: DataType, tag?: string): void;
    static get(tag: string): DataType;
    tag(): string;
    decode(_value: any): any;
    encode(_value: any): any;
}
export declare class ScalarType extends DataType {
}
export declare class NonScalarType extends DataType {
    readonly innerType: DataType | null;
    constructor(innerType: DataType | null);
}
