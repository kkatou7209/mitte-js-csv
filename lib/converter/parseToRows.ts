import { MitteCsvOptionError } from "@/errors/error.ts";

export type StringToArrayOption = {
    delim?: string;
    quotes?: string[];
}

const defaultOption = Object.freeze<Required<StringToArrayOption>>({
    delim: ',',
    quotes: ['"'],
});

/**
 * Split text into two dimentional string array.
 * 
 * @param text csv text
 * @param opt conversion options
 * @returns string value per lines
 */
export function parseToRows(text: string, opt?: StringToArrayOption): string[][] {

    const { delim, quotes }: StringToArrayOption = { ...defaultOption, ...opt };

    if (delim === '') {
        throw new MitteCsvOptionError('empty string cannot be used as a delimiter.');
    }

    if (quotes.some(char => char.length > 1)) {
        throw new MitteCsvOptionError(`delimiters must be single character. got=${quotes}`);
    }

    const csv: string[][] = [];

    const lines = text.trim()
        .replace('\r\n', '\n')
        .split('\n')
        .filter(l => l.trim() !== '');

    for (const line of lines) {

        const values: string[] = [];

        let quoted = false;

        let quote = '';

        const buf: string[] = [];
        
        for (const char of line.split('')) {
            // start of quotation.
            if (!quoted && quotes.includes(char)) {
                quoted = true;
                quote = char;
                buf.push(char);
                continue;
            }

            // end of quotation.
            if (quoted && quote === char) {
                quoted = false;
                quote = '';
                buf.push(char);
                continue;
            }

            if (quoted) {
                buf.push(char);
                continue;
            }

            if (char === delim) {
                values.push(buf.join(''));
                buf.splice(0, buf.length);
                continue;
            }

            buf.push(char);
        }

        values.push(buf.join(''));

        csv.push(values);
    }

    return csv;
}