import { Cell } from '@/adapter/cell.ts';
import { CsvValue } from '@/csv/csvValue.ts';

/**
 * Represents a single cell in a CSV.
 */
export class CsvCell {

    private _cell: Cell;

    public constructor(cell: Cell) {
        this._cell = cell;
    }
    
    /**
     * Set new value.
     * @param value new value
     */
    public set = (value: string | number | Date): void => {
        this._cell.setValue(value);
    }

    /**
     * Get current value.
     * @returns `CsvValue`
     */
    public get = (): CsvValue => {
        return new CsvValue(this._cell.getValue());
    }
}