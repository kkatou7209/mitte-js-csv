import { MitteCsvArgumentError } from '@/errors/error.ts';
import { Row } from '@/adapter/row.ts';
import { CsvRow } from '@/csv/csvRows.ts';
import { CsvValue } from '@/csv/csvValue.ts';
import { CsvHeaders } from '@/csv/csvHeaders.ts';

/**
 * Represents a CSV records.
 */
export class Csv {

    private _headers: CsvHeaders;

    private _rows: Row[] = [];

    public constructor(headers: string[] = []) {
        this._headers = new CsvHeaders([...headers]);
    }

    /**
     * Append new headers at the end of existing headers.
     * @param headers headers to append at the end of existing headers.
     */
    public appendHeaders = (headers: string[]): void => {

        this._headers.appendHeaders(headers);

        for (const row of this._rows) {
            row.expand(headers.length);
        }
    }

    /**
     * Add a new row.
     * @param row row to add
     */
    public addRow = (row: Row): void => {

        if (this._headers.matchCount(row) === false) {
            throw new MitteCsvArgumentError(`header count ${this._headers.headerCount()} does not match row column count ${row.columnCount()}.`);
        }

        this._rows.push(row);
    }

    public headers = (): string[] => {
        return this._headers.headers();
    }

    /**
     * Check if CSV has headers.
     * @returns `boolean`
     */
    public hasHeaders = (): boolean => this._headers.headerCount() > 0;

    /**
     * Get column index by header name.
     * @param name 
     * @returns `number` column index of header. -1 if not found.
     */
    public columnIndexOf = (name: string): number => {
        return this._headers.columnIndexOf(name);
    }

    /**
     * Check if header exists.
     * @param name header name
     * @returns `boolean`
     */
    public headerExists = (name: string): boolean => {
        return this._headers.headerExists(name);
    }

    /**
     * Get amount of columns.
     * @returns `number` of columns
     */
    public columnCount = (): number => {

        if (this.hasHeaders()) {
            return this._headers.headerCount();
        }

        if (this._rows.length === 0) {
            return 0;
        }
        
        return this._rows[0].columnCount();
    };

    /**
     * Get number of rows.
     * @returns number of rows.
     */
    public rowCount = (): number => this._rows.length;

    /**
     * Get a row by index.
     * @param index row index
     * @returns `CsvRow`
     */
    public row = (index: number): CsvRow => {

        if (index < 0 || index >= this._rows.length) {
            throw new MitteCsvArgumentError(`row index ${index} is out of range.`);
        }

        return new CsvRow(this._headers, this._rows[index]);
    }

    /**
     * Get value by row index and column index or header name.
     * @param row row index
     * @param col column index or header name
     * @returns `CsvValue`
     */
    public value = (row: number, col: string | number): CsvValue => {

        if (row < 0 || row >= this._rows.length) {
            throw new MitteCsvArgumentError(`row index ${row} is out of range.`);
        }

        const r = this._rows[row];

        if (typeof col === 'string') {

            const colIndex = this._headers.columnIndexOf(col);

            if (colIndex === -1) {
                throw new MitteCsvArgumentError(`column name "${col}" does not exist.`);
            }

            return new CsvValue(r.cellAt(colIndex).getValue());
        }

        return new CsvValue(r.cellAt(col).getValue());
    }

    /**
     * Set value by row index and column index or header name.
     * @param row row index
     * @param col column index or header name
     * @param value value to set
     */
    public set = (row: number, col: string | number, value: string | number | Date): void => {

        if (row < 0 || row >= this._rows.length) {
            throw new MitteCsvArgumentError(`row index ${row} is out of range.`);
        }

        const r = this._rows[row];

        if (typeof col === 'string') {
            
            const colIndex = this._headers.columnIndexOf(col);

            if (colIndex === -1) {
                throw new MitteCsvArgumentError(`header name "${col}" does not exist.`);
            }

            r.setValueAt(colIndex, value);

            return;
        }

        r.setValueAt(col, value);
    }

    /**
     * Sort rows vertically by column index or header name in ascending order.
     * @param col column index or header name
     */
    public sortByColumnAsc = (col: number | string): void => {

        let colIndex: number;

        if (typeof col === 'string') {

            if (this._headers.headerExists(col) === false) {
                throw new MitteCsvArgumentError(`header name "${col}" does not exist.`);
            }

            colIndex = this._headers.columnIndexOf(col);

        } else {
            colIndex = col;
        }

        if (colIndex < 0 || this.columnCount() <= colIndex) {
            throw new MitteCsvArgumentError(`column index ${colIndex} is out of range.`);
        }

        this._rows.sort((a, b) => {

            const aVal = a.cellAt(colIndex).getValue();
            const bVal = b.cellAt(colIndex).getValue();

            if (aVal.toString() == bVal.toString()) {
                return 0;
            }

            return aVal.toString() < bVal.toString() ? -1 : 1;
        });
    }

    /**
     * Sort rows vertically by column index or header name in descending order.
     * @param col column index or header name
     */
    public sortByColumnDesc = (col: number | string): void => {

        let colIndex: number;

        if (typeof col === 'string') {

            if (this._headers.headerExists(col) === false) {
                throw new MitteCsvArgumentError(`header name "${col}" does not exist.`);
            }

            colIndex = this._headers.columnIndexOf(col);

        } else {
            colIndex = col;
        }

        if (colIndex < 0 || this.columnCount() <= colIndex) {
            throw new MitteCsvArgumentError(`column index ${colIndex} is out of range.`);
        }

        this._rows.sort((a, b) => {

            const aVal = a.cellAt(colIndex).getValue();
            const bVal = b.cellAt(colIndex).getValue();

            if (aVal.toString() == bVal.toString()) {
                return 0;
            }

            return aVal.toString() > bVal.toString() ? -1 : 1;
        });
    }

    /**
     * Sort columns horizontally by header name in ascending order.
     * Does nothing if there are no headers.
     */
    public sortByHeaderAsc = (): void => {
        
        if (this._headers.headerCount() === 0) {
            return;
        }

        const newHeaders = [...this._headers.headers()].sort();

        const indices = [...newHeaders].sort().map(h => this._headers.columnIndexOf(h));

        const newRows: Row[] = [];

        for (const row of this._rows) {
         
            const newCells = indices.map(i => row.cellAt(i));

            const newRow = Row.fromCells(newCells);

            newRows.push(newRow);
        }

        this._headers = new CsvHeaders(newHeaders);

        this._rows = newRows;
    }

    /**
     * Sort columns horizontally by header name in descending order.
     * Does nothing if there are no headers.
     */
    public sortByHeaderDesc = (): void => {
        
        if (this._headers.headerCount() === 0) {
            return;
        }

        const newHeaders = [...this._headers.headers()].sort().reverse();

        const indices = [...this._headers.headers()].sort().reverse().map(h => this._headers.columnIndexOf(h));

        const newRows: Row[] = [];

        for (const row of this._rows) {
         
            const newCells = indices.map(i => row.cellAt(i));

            const newRow = Row.fromCells(newCells);

            newRows.push(newRow);
        }

        this._headers = new CsvHeaders(newHeaders);

        this._rows = newRows;
    }

    public stringify = (delim: string = ',', quote: string = ''): string => {

        if (delim.length !== 1) {
            throw new MitteCsvArgumentError('delimiter must be a single character string.');
        }

        if (quote.length !== 0 && quote.length !== 1) {
            throw new MitteCsvArgumentError('quote must be a single character string or empty string.');
        }

        const lines: string[] = [];

        if (this.hasHeaders()) {
            const headerLine = this._headers.headers().map(h => quote + h + quote).join(delim);
            lines.push(headerLine);
        }
        
        for (const row of this._rows) {
            
            const line = [];

            for (let i = 0; i < row.columnCount(); i++) {
                line.push(quote + row.cellAt(i).getValue().toString() + quote);
            }
            
            lines.push(line.join(delim));
        }

        return lines.join('\n');
    }
}
