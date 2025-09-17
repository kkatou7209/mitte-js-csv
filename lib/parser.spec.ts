import { describe, expect, it } from 'vitest';
import { Parser } from '@/parser.ts';

describe.concurrent('parser test', () => {

    it('parse to to rows', async () => {
        const csvText = `Name,Age,Job
Alice,30,Engineer
Bob,25,Designer
"Charlie, D.",35,"Product Manager"`;

        const parser = new Parser({ header: true });

        const rows = parser.toRows(csvText);

        expect(rows.length).toEqual(4);
        expect(rows[0]).toEqual(['Name', 'Age', 'Job']);
        expect(rows[1]).toEqual(['Alice', '30', 'Engineer']);
        expect(rows[2]).toEqual(['Bob', '25', 'Designer']);
        expect(rows[3]).toEqual(['"Charlie, D."', '35', '"Product Manager"']);
    });

    it('trim spaces', async () => {
        const csvText = ` Name , Age , Job 
 Alice , 30 , Engineer 
 Bob , 25 , Designer 
 "Charlie, D." , 35 , "Product Manager" `;

        const parser = new Parser({ header: true, trimSpaces: true });

        const rows = parser.toRows(csvText);

        expect(rows.length).toEqual(4);
        expect(rows[0]).toEqual(['Name', 'Age', 'Job']);
        expect(rows[1]).toEqual(['Alice', '30', 'Engineer']);
        expect(rows[2]).toEqual(['Bob', '25', 'Designer']);
        expect(rows[3]).toEqual(['"Charlie, D."', '35', '"Product Manager"']);
    });

    it('skip first row', async () => {
        const csvText = `Name,Age,Job
Alice,30,Engineer
Bob,25,Designer
"Charlie, D.",35,"Product Manager"`;

        const parser = new Parser({ skipFirstRow: true });

        const rows = parser.toRows(csvText);

        expect(rows.length).toEqual(3);
        expect(rows[0]).toEqual(['Alice', '30', 'Engineer']);
        expect(rows[1]).toEqual(['Bob', '25', 'Designer']);
        expect(rows[2]).toEqual(['"Charlie, D."', '35', '"Product Manager"']);
    });

    it('parse to objects', async () => {
        const csvText = `Name,Age,Job
Alice,30,Engineer
Bob,25,Designer
"Charlie, D.",35,"Product Manager"`;

        const parser = new Parser();

        const objs = parser.toObjects(csvText, { headerProp: true });

        expect(objs[0]).toEqual({ Name: 'Alice', Age: '30', Job: 'Engineer' });
        expect(objs[1]).toEqual({ Name: 'Bob', Age: '25', Job: 'Designer' });
        expect(objs[2]).toEqual({ Name: '"Charlie, D."', Age: '35', Job: '"Product Manager"' });
    });

    it('parse to objects with triming quotes', async () => {

        const csvText = `Name,Age,Job
Alice,30,Engineer
Bob,25,Designer
"Charlie, D.",35,"Product Manager"`;

        const parser = new Parser({ noQuotes: true });

        const objs = parser.toObjects(csvText, { headerProp: true });
        
        expect(objs[0]).toEqual({ Name: 'Alice', Age: '30', Job: 'Engineer' });
        expect(objs[1]).toEqual({ Name: 'Bob', Age: '25', Job: 'Designer' });
        expect(objs[2]).toEqual({ Name: 'Charlie, D.', Age: '35', Job: 'Product Manager' });

        const rows = parser.toRows(csvText);

        expect(rows[0]).toEqual(['Name', 'Age', 'Job']);
        expect(rows[1]).toEqual(['Alice', '30', 'Engineer']);
        expect(rows[2]).toEqual(['Bob', '25', 'Designer']);
        expect(rows[3]).toEqual(['Charlie, D.', '35', 'Product Manager']);
    });

    it('parse to Csv instance', async () => {
        const csvText = `Name,Age,Job
Alice,30,Engineer
Bob,25,"Designer"
"Charlie, D.",35,"Product Manager"`;

        const parser = new Parser({ header: true });

        const csv = parser.parse(csvText);

        expect(csv.rowCount()).toEqual(3);
        expect(csv.columnCount()).toEqual(3);
        expect(csv.headers()).toEqual(['Name', 'Age', 'Job']);
        expect(csv.row(0).col(0).get().asString()).toEqual('Alice');
        expect(csv.row(1).col(1).get().asNumber()).toEqual(25);
        expect(csv.row(2).col(2).get().asString()).toEqual('"Product Manager"');

        const parser2 = new Parser({ noQuotes: true });

        const csv2 = parser2.parse(csvText);

        expect(csv2.rowCount()).toEqual(4);
        expect(csv2.columnCount()).toEqual(3);
        expect(csv2.headers()).toEqual([]);
        expect(csv2.row(0).col(0).get().asString()).toEqual('Name');
        expect(csv2.row(1).col(1).get().asNumber()).toEqual(30);
        expect(csv2.row(2).col(2).get().asString()).toEqual('Designer');
    });

    it('throw error when parse invalid csv', async () => {
        const csvText = `Name,Age,Job
Alice,30,Engineer
Bob,25,Designer
"Charlie, D.,35,"Product Manager"`;

        const parser = new Parser({ header: true });

        expect(() => parser.parse(csvText)).toThrow();
    });
});