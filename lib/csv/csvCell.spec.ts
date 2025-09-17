import { describe, expect, it } from 'vitest';
import { CsvCell } from '@/csv/csvCell.ts';
import { Value } from '@/adapter/value.ts';
import { Cell } from '@/adapter/cell';

describe.concurrent('csv/csvCell test', () => {
    
    it('returns currect value', async () => {
        
        const str = new CsvCell(new Cell(new Value('Alice Johnson')));

        expect(str).toBeInstanceOf(CsvCell);
        expect(str.get().asString()).toEqual('Alice Johnson');

        const num = new CsvCell(new Cell(new Value(3.14159.toString())));

        expect(num).toBeInstanceOf(CsvCell);
        expect(num.get().asNumber()).toEqual(3.14159);

        const date = new CsvCell(new Cell(new Value('2024-06-15T12:00:00Z')));

        expect(date).toBeInstanceOf(CsvCell);
        expect(date.get().asDate()).toEqual(new Date('2024-06-15T12:00:00Z'));
    });

    it('sets currect value', async () => {
        const str = new CsvCell(new Cell(new Value('Old String')));

        expect(str.get().asString()).toEqual('Old String');

        const num = new CsvCell(new Cell(new Value('0')));
        expect(num.get().asNumber()).toEqual(0);

        const date = new CsvCell(new Cell(new Value('2023-01-01T00:00:00Z')));
        expect(date.get().asDate()).toEqual(new Date('2023-01-01T00:00:00Z'));
    });
});
