import { describe, it, expect } from 'vitest';
import { CsvHeaders } from '@/csv/csvHeaders.ts';
import { Row } from '@/adapter/row.ts';

describe.concurrent('csv/csvHeaders test', () => {
    
    it('return column index by header name', async () => {
        
        const headers = new CsvHeaders(['Name', 'Age', 'Email']);

        expect(headers.columnIndexOf('Name')).toEqual(0);
        expect(headers.columnIndexOf('Age')).toEqual(1);
        expect(headers.columnIndexOf('Email')).toEqual(2);
        expect(headers.columnIndexOf('NonExistent')).toEqual(-1);
    });

    it('check if header exists', async () => {

        const headers = new CsvHeaders(['Name', 'Age', 'Email']);

        expect(headers.headerExists('Name')).toBe(true);
        expect(headers.headerExists('Age')).toBe(true);
        expect(headers.headerExists('Email')).toBe(true);
        expect(headers.headerExists('NonExistent')).toBe(false);
    });

    it('return all headers', async () => {

        const headerArray = ['Name', 'Age', 'Email'];
        const headers = new CsvHeaders(headerArray);

        expect(headers.headers()).toEqual(headerArray);
    });

    it('return header count', async () => {

        const headers = new CsvHeaders(['Name', 'Age', 'Email']);
        expect(headers.headerCount()).toEqual(3);

        const emptyHeaders = new CsvHeaders([]);
        expect(emptyHeaders.headerCount()).toEqual(0);
    });

    it('match header count with row column count', async () => {

        const headers = new CsvHeaders(['Name', 'Age', 'Email']);

        const row = new Row(3);
        expect(headers.matchCount(row)).toBe(true);

        const row2 = new Row(2);
        expect(headers.matchCount(row2)).toBe(false);

        const emptyHeaders = new CsvHeaders([]);
        const row3 = new Row(5);
        expect(emptyHeaders.matchCount(row3)).toBe(true);
    });
});