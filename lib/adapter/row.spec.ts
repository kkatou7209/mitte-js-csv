import { describe, expect, it } from "vitest";
import { Row } from '@/adapter/row.ts';
import { Cell } from '@/adapter/cell.ts';
import { Value } from '@/adapter/value.ts';

describe.concurrent('adapter/row test', () => {

    it('returns currect value', async () => {

        const row = new Row(2);

        row.setValueAt(0, -13e+4);
        row.setValueAt(1, 'John Doe');

        let foo = row.cellAt(0);
        let bar = row.cellAt(1);

        expect(foo).toBeInstanceOf(Cell);
        expect(foo.getValue().toNumber()).toEqual(-13e+4);

        expect(bar).toBeInstanceOf(Cell);
        expect(bar.getValue().toString()).toEqual('John Doe');
    });

    it('sets currect value', async () => {

        const row = new Row(2);

        row.setValueAt(0, 'Bob Smith');
        row.setValueAt(1, '2025-09-08 00:00:00.000Z');

        const foo = row.cellAt(0);
        const bar = row.cellAt(1);

        expect(foo).toBeInstanceOf(Cell);
        expect(foo.getValue().toString()).toEqual('Bob Smith');

        expect(bar).toBeInstanceOf(Cell);
        expect(bar.getValue().toDate()).toEqual(new Date('2025-09-08 00:00:00.000Z'));
    });

    it('returns column count', async () => {

        const row = new Row(5);
        expect(row.columnCount()).toEqual(5);

        const emptyRow = new Row(0);
        expect(emptyRow.columnCount()).toEqual(0);
    });

    it('expand columns', async () => {

        const row = new Row(2);

        expect(row.columnCount()).toEqual(2);

        row.expand(5);

        expect(row.columnCount()).toEqual(7);
        expect(row.cellAt(6).getValue().toString()).toEqual('');
    });

    it('stringify row', async () => {

        const row = new Row(3);

        row.setValueAt(0, 'Alice');
        row.setValueAt(1, 30);
        row.setValueAt(2, '2024-06-15');

        expect(row.stringify()).toEqual('Alice,30,2024-06-15');
        expect(row.stringify('|')).toEqual('Alice|30|2024-06-15');

        const emptyRow = new Row(0);

        expect(emptyRow.stringify()).toEqual('');
    });

    it('create row from cells', async () => {

        const cells = [
            new Cell(new Value('Alice')),
            new Cell(new Value('30')),
            new Cell(new Value('2024-06-15')),
        ];

        const row = Row.fromCells(cells);

        expect(row).toBeInstanceOf(Row);
        expect(row.columnCount()).toEqual(3);
        expect(row.cellAt(0).getValue().toString()).toEqual('Alice');
        expect(row.cellAt(1).getValue().toNumber()).toEqual(30);
        expect(row.cellAt(2).getValue().toString()).toEqual('2024-06-15');
    });

    it('throw if column does not exist.', async () => {

        const row = new Row(2);

        expect(() => row.cellAt(2)).toThrow();
        expect(() => row.setValueAt(-1, 0)).toThrow();
    });
});