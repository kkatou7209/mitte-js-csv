import { describe, it, expect } from 'vitest';
import { Row } from '@/adapter/row.ts';
import { CsvRow } from '@/csv/csvRows.ts';
import { CsvHeaders } from '@/csv/csvHeaders.ts';
import { CsvCell } from '@/csv/csvCell.ts';

describe.concurrent('csv/csvRow test', () => {

    it('returns column count', async () => {

        const headers = new CsvHeaders([]);

        const row = new Row(5);

        const csvRow  = new CsvRow(headers, row);

        expect(csvRow.columnCount()).toEqual(5);

        const emptyRow = new Row(0);
        const emptyCsvRow  = new CsvRow(headers, emptyRow);

        expect(emptyCsvRow.columnCount()).toEqual(0);
    });

    it('returns currect value', async () => {

        const headers = new CsvHeaders([]);

        const row = new Row(2);

        row.setValueAt(0, -13e+4);
        row.setValueAt(1, 'John Doe');

        const csvRow  = new CsvRow(headers, row);

        const foo = csvRow.col(0);
        const bar = csvRow.col(1);

        expect(foo).toBeInstanceOf(CsvCell);
        expect(foo.get().asNumber()).toEqual(-13e+4);

        expect(bar).toBeInstanceOf(CsvCell);
        expect(bar.get().asString()).toEqual('John Doe');
    });

    it('sets currect value', async () => {

        const headers = new CsvHeaders([]);

        const row = new Row(3);

        row.setValueAt(0, 'Bob Smith');
        row.setValueAt(1, '2025-09-08 00:00:00.000Z');
        row.setValueAt(2, 42);

        const csvRow  = new CsvRow(headers, row);

        csvRow.set(0, 'Alice Johnson');
        csvRow.set(1, new Date('2024-06-15T12:00:00Z'));
        csvRow.set(2, 3.14159);

        const foo = csvRow.col(0);
        const bar = csvRow.col(1);
        const baz = csvRow.col(2);

        expect(foo).toBeInstanceOf(CsvCell);
        expect(foo.get().asString()).toEqual('Alice Johnson');

        expect(bar).toBeInstanceOf(CsvCell);
        expect(bar.get().asDate()).toEqual(new Date('2024-06-15T12:00:00Z'));

        expect(baz).toBeInstanceOf(CsvCell);
        expect(baz.get().asNumber()).toEqual(3.14159);
    });

    it('has same cell reference', async () => {

        const headers = new CsvHeaders([]);

        const row = new Row(1);

        row.setValueAt(0, 'Initial Value');

        const csvRow  = new CsvRow(headers, row);

        const cell = csvRow.col(0);

        cell.set('Updated Value');

        expect(csvRow.col(0).get().asString()).toEqual('Updated Value');

        row.setValueAt(0, 'Direct Update');
        
        expect(csvRow.col(0).get().asString()).toEqual('Direct Update');
    });

    it('can access columns by header name', async () => {

        const headers = new CsvHeaders(['id', 'name', 'birthdate']);

        const row = new Row(3);

        row.setValueAt(0, 1);
        row.setValueAt(1, 'John Doe');
        row.setValueAt(2, '1990-05-15T00:00:00Z');

        const csvRow  = new CsvRow(headers, row);

        const idCell = csvRow.col('id');
        const nameCell = csvRow.col('name');
        const birthdateCell = csvRow.col('birthdate');

        expect(idCell).toBeInstanceOf(CsvCell);
        expect(idCell.get().asNumber()).toEqual(1);

        expect(nameCell).toBeInstanceOf(CsvCell);
        expect(nameCell.get().asString()).toEqual('John Doe');

        expect(birthdateCell).toBeInstanceOf(CsvCell);
        expect(birthdateCell.get().asDate()).toEqual(new Date('1990-05-15T00:00:00Z'));
    });

    it('can set columns by header name', async () => {

        const headers = new CsvHeaders(['id', 'name', 'birthdate']);

        const row = new Row(3);

        row.setValueAt(0, 1);
        row.setValueAt(1, 'John Doe');
        row.setValueAt(2, '1990-05-15T00:00:00Z');

        const csvRow  = new CsvRow(headers, row);

        csvRow.set('id', 42);
        csvRow.set('name', 'Alice Johnson');
        csvRow.set('birthdate', new Date('1985-10-30T00:00:00Z'));

        const idCell = csvRow.col('id');
        const nameCell = csvRow.col('name');
        const birthdateCell = csvRow.col('birthdate');

        expect(idCell).toBeInstanceOf(CsvCell);
        expect(idCell.get().asNumber()).toEqual(42);

        expect(nameCell).toBeInstanceOf(CsvCell);
        expect(nameCell.get().asString()).toEqual('Alice Johnson');

        expect(birthdateCell).toBeInstanceOf(CsvCell);
        expect(birthdateCell.get().asDate()).toEqual(new Date('1985-10-30T00:00:00Z'));
    });

    it('throws error for invalid header name', async () => {

        const headers = new CsvHeaders(['id', 'name']);

        const row = new Row(2);

        row.setValueAt(0, 1);
        row.setValueAt(1, 'John Doe');

        const csvRow  = new CsvRow(headers, row);

        expect(() => csvRow.col('age')).toThrow();
        expect(() => csvRow.set('age', 30)).toThrow();
    });

    it('throws error for header/column count mismatch', async () => {

        const headers = new CsvHeaders(['id', 'name']);

        const row = new Row(3);

        expect(() => new CsvRow(headers, row)).toThrow();
    });
});