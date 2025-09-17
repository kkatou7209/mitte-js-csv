import type { Value } from '@/adapter/value.ts';

/**
 * Represents a single value in a CSV cell.
 */
export class CsvValue {

    private _value: Value;

    public constructor(value: Value) {
        this._value = value;
    }

    /**
     * Get value as number.
     * @returns number
     */
    public asNumber = (): number => {
        return this._value.toNumber();
    }

    /**
     * Get value as string.
     * @returns string
     */
    public asString = (): string => {
        return this._value.toString();
    }

    /**
     * Get value as Date.
     * @returns Date
     */
    public asDate = (): Date => {
        return this._value.toDate();
    }
}