import { DataType } from "./src/datatype";
export default class TJSON {
    static parse(tjsonString: string, decodeUTF8?: boolean): any;
    static stringify(value: any, space?: number | string, encodeUTF8?: boolean): string;
    static parseType(tag: string): DataType;
    static identifyType(value: any): DataType;
    static reviver(_key: any, value: any): any;
    static replacer(_key: any, value: any): any;
}
