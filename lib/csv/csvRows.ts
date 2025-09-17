import { Row } from '@/adapter/row.ts';
import { MitteCsvArgumentError } from '@/errors/error.ts';
import { CsvCell } from '@/csv/csvCell.ts';
import type { CsvHeaders } from './csvHeaders';

/**
 * Represents a single row in a CSV file.
 */
export class CsvRow {

    private _headers: CsvHeaders;

    private _row: Row;

    public constructor(headers: CsvHeaders, row: Row) {

        if (headers.headerCount() != 0 && headers.headerCount() !== row.columnCount()) {
            throw new MitteCsvArgumentError(`header count ${headers.headerCount()} does not match row column count ${row.columnCount()}.`);
        }

        this._headers = headers;
        this._row = row;
    }

    /**
     * Get number of columns in this row.
     * @returns `number` of columns in this row.
     */
    public columnCount = (): number => this._row.columnCount();

    /**
     * Get value by header name or column index.
     * @param key header name or column index
     * @returns `CsvValue`
     */
    public col = (col: number | string): CsvCell => {

        if (typeof col === 'string') {

            if (this._headers.headerExists(col) === false) {
                throw new MitteCsvArgumentError(`header name "${col}" does not exist.`);
            }

            return new CsvCell(this._row.cellAt(this._headers.columnIndexOf(col)));
        }

        return new CsvCell(this._row.cellAt(col));
    }

    /**
     * Set value by header name or column index.
     * @param key header name or column index
     * @param value new value
     */
    public set = (col: number | string, value: string | number | Date): void => {

        if (typeof col === 'string') {

            if (this._headers.headerExists(col) === false) {
                throw new MitteCsvArgumentError(`header name "${col}" does not exist.`);
            }

            this._row.setValueAt(this._headers.columnIndexOf(col), value);

            return;
        }

        this._row.setValueAt(col, value);
    }
}