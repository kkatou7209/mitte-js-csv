import { parseToRows, type StringToArrayOption } from '@/converter/parseToRows.ts';
import { parseRowsToObjects, type ParseRowsToObjectOption } from '@/converter/parseRowsToObjects';
import { Csv } from '@/csv/csv.ts';
import { MitteCsvParseError } from '@/errors/error.ts';
import { Row } from '@/adapter/row.ts';

/**
 * Parser options.
 */
export type ParserOptions = {
    /**
     * csv value delimiter. Default is comma (,).
     */
    delim?: string;
    /**
     * characters to use as quote. Default are double quote ("), single quote ('), and backtick (`).
     */
    quotes?: string[];
    /**
     * use first row as prop names. Default is false.
     */
    header?: boolean;
    /**
     * remove quotes around values. Default is false.
     */
    noQuotes?: boolean;
    /**
     * trim spaces around values. Default is false.
     */
    trimSpaces?: boolean;
    /**
     * skip first row (header). Default is false.
     */
    skipFirstRow?: boolean;
};

const defaultOption = Object.freeze<Required<ParserOptions & ParseRowsToObjectOption>>({
    delim: ',',
    quotes: ['"', "'", "`"],
    headerProp: false,
    header: false,
    case: 'original',
    noQuotes: false,
    trimSpaces: false,
    skipFirstRow: false,
});

/**
 * Facade class of library.
 */
export class Parser {

    private _delim: string;

    private _quotes: string[];

    private _header: boolean;

    private _noQuotes: boolean;

    private _trimSpaces: boolean;

    private _skipFirstRow: boolean;
    
    public constructor(opts?: ParserOptions) {

        const { delim, quotes, header, noQuotes, trimSpaces, skipFirstRow } = { ...defaultOption, ...opts};

        this._delim = delim;
        this._quotes = [...quotes];
        this._header = header;
        this._noQuotes = noQuotes;
        this._trimSpaces = trimSpaces;
        this._skipFirstRow = skipFirstRow;
    }

    private trimQuotes = (str: string): string => {

        let result = str;

        for (const q of this._quotes) {

            if (result.startsWith(q) && result.endsWith(q)) {
                result = result.slice(q.length, result.length - q.length);
                break;
            }
        }

        return result;
    }

    /**
     * Parse csv text to `Csv`.
     * @param csvText csv text string
     * @returns `Csv`
     */
    public parse = (csvText: string): Csv => {

        const rows = this.toRows(csvText);

        const csv = new Csv();

        let colCount = 0;

        if (this._header && rows.length > 0) {
            const headers = rows.shift()!;
            csv.appendHeaders(headers);
            colCount = headers.length;
        }

        for (const [i, row] of rows.entries()) {

            if (colCount === 0) {
                colCount = row.length;
            }

            if (colCount !== 0 && colCount !== row.length) {
                throw new MitteCsvParseError(`row ${i} column count ${row.length} does not match previous row column count ${colCount}.`);
            }

            const r = new Row(row.length);

            for (const [j, cell] of row.entries()) {
                r.setValueAt(j, cell);
            }
            
            csv.addRow(r);
        }

        return csv;
    }

    /**
     * Parse csv text to two dimensional string array.
     * @param csv csv text string
     * @returns `string[][]`
     */
    public toRows = (csv: string, options?: StringToArrayOption): string[][] => {

        const rows =  parseToRows(csv, { delim: this._delim, quotes: [...this._quotes], ...options });

        if (this._noQuotes) {
            for (const row of rows) {
                for (let i = 0; i < row.length; i++) {
                    row[i] = this.trimQuotes(row[i]);
                }
            }
        }

        if (this._trimSpaces) {
            for (const row of rows) {
                for (let i = 0; i < row.length; i++) {
                    row[i] = row[i].trim();
                }
            }
        }

        if (this._skipFirstRow) {
            rows.shift();
        }

        return rows;
    }

    /**
     * Parse csv text to object
     * @param csv csv text string
     * @param header use first row as prop names.
     * @template T
     * @returns `T[]`
     */
    public toObjects = <T extends Record<string, string>>(csv: string, options?: ParseRowsToObjectOption): T[] => {

        const rows = this.toRows(csv);

        const opts = { ...defaultOption, ...options };

        return parseRowsToObjects<T>(rows, { ...opts });
    }
}