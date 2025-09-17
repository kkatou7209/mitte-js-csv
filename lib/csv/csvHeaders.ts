import type { Row } from "@/adapter/row";

/**
 * CsvHeaders class to manage CSV headers.
 */
export class CsvHeaders {

    private _headers: string[] = [];

    public constructor(headers: string[] = []) {

        this._headers = [...headers];
    }

    /**
     * Append new headers.
     * @param headers headers to append
     */
    public appendHeaders = (headers: string[]): void => {
        this._headers.push(...headers);
    }

    /**
     * Check if the header count matches the row column count.
     * @param row row to compare
     * @returns `boolean`
     */
    public matchCount = (row: Row): boolean => {

        if (this._headers.length === 0) {
            return true;
        }

        return this._headers.length === row.columnCount();
    }

    /**
     * Get all headers.
     * @returns `string[]` array of headers.
     */
    public headers = (): string[] => {
        return [...this._headers];
    }

    /**
     * Get count of headers.
     * @returns `number` count of headers.
     */
    public headerCount = (): number => this._headers.length;

    /**
     * Get column index by header name.
     * @param name 
     * @returns `number` column index of header. -1 if not found.
     */
    public columnIndexOf = (name: string): number => {
        return this._headers.indexOf(name);
    }

    /**
     * Check if header exists.
     * @param name header name
     * @returns `boolean`
     */
    public headerExists = (name: string): boolean => {
        return this._headers.includes(name);
    }
}