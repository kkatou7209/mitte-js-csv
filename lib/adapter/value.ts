import { MitteCsvConversionError } from "@/errors/error";

export class Value {

    private _value: string;

    public constructor(value: string) {

        this._value = value;
    }

    public toString = (): string => this._value.slice();

    /**
     * Get value as `number`.
     */
    public toNumber = (): number => {

        const num = Number(this._value);

        if (/^\s*[+-]?(?:\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?\s*$/.test(this._value) === false || isNaN(num)) {
            throw new MitteCsvConversionError(`'${this._value}' is not a valid number format.`);
        }

        if (isFinite(num) === false) {
            throw new MitteCsvConversionError(`'${this._value}' is too large.`);
        }

        return num;
    }

    /**
     * Get value as `Date`.
     */
    public toDate = (): Date => {

        const date = new Date(this._value);

        if (isNaN(date.getTime())) {
            throw new MitteCsvConversionError(`'${this._value}' is not a valid date format.`);
        }

        return date;
    }

    public copy = () => new Value(this._value);
}