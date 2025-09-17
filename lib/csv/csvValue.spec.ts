import { describe, it, expect } from 'vitest';
import { Value } from '@/adapter/value.ts';
import { CsvValue } from '@/csv/csvValue.ts';

describe.concurrent('csv/csvValue test', () => {
    
    it('returns currect value', async () => {
        
        const str = new CsvValue(new Value('Alice Johnson'));

        expect(str).toBeInstanceOf(CsvValue);
        expect(str.asString()).toEqual('Alice Johnson');

        const num = new CsvValue(new Value(3.14159.toString()));

        expect(num).toBeInstanceOf(CsvValue);
        expect(num.asNumber()).toEqual(3.14159);

        const date = new CsvValue(new Value('2024-06-15T12:00:00Z'));

        expect(date).toBeInstanceOf(CsvValue);
        expect(date.asDate()).toEqual(new Date('2024-06-15T12:00:00Z'));
    });
});