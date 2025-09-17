import { Value } from '@/adapter/value.ts';

export class Cell {

    private _value: Value;

    public constructor(value: Value) {

        this._value = value;
    }

    public setValue = (value: string | number | Date): void => {
        this._value = new Value(value.toString());
    }

    public getValue = (): Value => {
        return this._value.copy();
    }
}