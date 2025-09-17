import { describe, it, expect } from "vitest";
import { Cell } from '@/adapter/cell.ts';
import { Value } from '@/adapter/value.ts';

describe.concurrent('adapter/cell test', () => {

    it('returns currect value', async () => {

        const cell = new Cell(new Value('Alice Johnson'));

        const value = cell.getValue();

        expect(value).toBeInstanceOf(Value);
        expect(value.toString()).toEqual('Alice Johnson');
    });
    
    it('sets currect value', async () => {
        const cell = new Cell(new Value('Old Value'));

        cell.setValue(42);
        let value = cell.getValue();
        expect(value).toBeInstanceOf(Value);
        expect(value.toNumber()).toEqual(42);

        cell.setValue(new Date('2023-01-01T00:00:00Z'));
        value = cell.getValue();
        expect(value).toBeInstanceOf(Value);
        expect(value.toDate()).toEqual(new Date('2023-01-01T00:00:00Z'));

        cell.setValue('New String');
        value = cell.getValue();
        expect(value).toBeInstanceOf(Value);
        expect(value.toString()).toEqual('New String');
    });
});