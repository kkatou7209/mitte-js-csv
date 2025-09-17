import { describe, expect, it } from 'vitest';
import { parseToRows } from './parseToRows';

describe.concurrent('parseToRows', () => {

    it('convert ordinal csv to string array.', async () => {

        const src = `
header1,header2,header3
value1,value2,value3`;

        const expected = [
            ['header1', 'header2', 'header3'],
            ['value1', 'value2', 'value3'],
        ];

        const result = parseToRows(src);

        expect(result).toEqual(expected);
    });

    it('convert csv with custom delimiter correctly.', async () => {

        const src = `
header1;header2;header3
value1;value2;value3`;

        const expected = [
            ['header1', 'header2', 'header3'],
            ['value1', 'value2', 'value3'],
        ];

        const result = parseToRows(src, {delim: ';' });

        expect(result).toEqual(expected);
    });

    it('convert csv with quote correctly.', async () => {

        const src = `
header1,"header2,header3",header4
value1,\`value2,value3\`,value4`;

        const expected = [
            ['header1', '"header2,header3"', 'header4'],
            ['value1', '`value2,value3`', 'value4'],
        ];

        const result = parseToRows(src, { quotes: ['"', '`'] });

        expect(result).toEqual(expected);
    });

    it('convert csv with quote and custom delimiter correctly.', async () => {

        const src = `
header1@\`hea"der2@"header3\`@header4
va"@"lue1@'value2@value3'@va"lue4`;

        const expected = [
            ['header1', '`hea"der2@"header3`', 'header4'],
            ['va"@"lue1', "'value2@value3'", 'va"lue4'],
        ];

        const result = parseToRows(src, { delim: '@', quotes: ['`', '"', "'"] });

        expect(result).toEqual(expected);
    });

    it('throw if empty string was passed as delimiter.', async () => {

        expect(() => parseToRows('', { delim: '' })).toThrow();
    });

    it('throw if multiple characters were passed as quotes.', async () => {

        expect(() => parseToRows('', { quotes: ['""'] })).toThrow();
    });
});