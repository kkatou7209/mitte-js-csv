import { MitteCsvArgumentError } from '@/errors/error.ts';
import { Value } from '@/adapter/value.ts';
import { Cell } from '@/adapter/cell.ts';

export class Row {

    private _cells: Cell[] = [];

    public constructor(cols: number) {
        for (let i = 0; i < cols; i++) {
            this._cells.push(new Cell(new Value('')));
        }
    }

    public static fromCells(cells: Cell[]): Row {
        const row = new Row(0);
        row._cells = cells;
        return row;
    }

    /**
     * Get number of columns in this row.
     * @returns `number` of columns in this row.
     */
    public columnCount = (): number => this._cells.length;

    /**
     * Add empty cells to the end of the row.
     * @param columnCount number of columns to expand
     */
    public expand = (columnCount: number): void => {
        for (let i = 0; i < columnCount; i++) {
            this._cells.push(new Cell(new Value('')));
        }
    }

    /**
     * Get a value by column index.
     * @param col column index
     */
    public cellAt = (col: number): Cell => {

        if (col < 0 || this._cells.length < col + 1) {
            throw new MitteCsvArgumentError(`value does not exist at column ${col}`);
        }

        return this._cells[col];
    }

    /**
     * Set new value to existing cell by column index.
     * @param col 
     * @param value 
     */
    public setValueAt = (col: number, value: string | number | Date): void => {

        if (this._cells[col] === undefined) {
            throw new MitteCsvArgumentError(`value does not exist at column ${col}`);
        }

        this._cells[col].setValue(value);
    }

    /**
     * Convert row to CSV string.
     * @param delim delimiter string, default is `,`
     * @returns CSV string
     */
    public stringify = (delim: string = ','): string => {

        const values: string[] = [];

        for (const cell of this._cells) {
            values.push(cell.getValue().toString());
        }

        return values.join(delim);
    }
}