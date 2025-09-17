import { describe, it, expect } from 'vitest';
import { Csv } from '@/csv/csv.ts';
import { Row } from '@/adapter/row';

describe.concurrent('csv/csvHeaders test', () => {
    
    it('returns column count', async () => {

        const csv = new Csv(['Name', 'Age', 'Email']);

        expect(csv.columnCount()).toEqual(3);

        const emptyCsv = new Csv([]);
        expect(emptyCsv.columnCount()).toEqual(0);

        const row = new Row(5);
        emptyCsv.addRow(row);
        expect(emptyCsv.columnCount()).toEqual(5);
    });

    it('returns all headers', async () => {

        const headerArray = ['Name', 'Age', 'Email'];
        const csv = new Csv(headerArray);

        expect(csv.headers()).toEqual(headerArray);
    });

    it('check if CSV has headers', async () => {

        const csvWithHeaders = new Csv(['Name', 'Age', 'Email']);
        expect(csvWithHeaders.hasHeaders()).toBe(true);

        const csvWithoutHeaders = new Csv([]);
        expect(csvWithoutHeaders.hasHeaders()).toBe(false);
    });

    it('checks if header exists', async () => {

        const csv = new Csv(['Name', 'Age', 'Email']);

        expect(csv.hasHeaders()).toBe(true);
        expect(csv.headerExists('Name')).toBe(true);
        expect(csv.headerExists('Age')).toBe(true);
        expect(csv.headerExists('Email')).toBe(true);
        expect(csv.headerExists('NonExistent')).toBe(false);
    });

    it('returns column index by header name', async () => {

        const csv = new Csv(['Name', 'Age', 'Email']);

        expect(csv.columnIndexOf('Name')).toEqual(0);
        expect(csv.columnIndexOf('Age')).toEqual(1);
        expect(csv.columnIndexOf('Email')).toEqual(2);
        expect(csv.columnIndexOf('NonExistent')).toEqual(-1);
    });

    it('returns row count', async () => {
        
        const csv = new Csv(['Name', 'Age', 'Job']);
        expect(csv.rowCount()).toEqual(0);

        csv.addRow(new Row(3));
        expect(csv.rowCount()).toEqual(1);

        csv.addRow(new Row(3));
        csv.addRow(new Row(3));
        expect(csv.rowCount()).toEqual(3);
    });

    it('appends new headers and expand row column', async () => {

        const csv = new Csv(['Name', 'Age']);

        expect(csv.columnCount()).toEqual(2);
        expect(csv.headers()).toEqual(['Name', 'Age']);

        csv.addRow(new Row(2));

        csv.appendHeaders(['Email', 'Job']);

        expect(csv.columnCount()).toEqual(4);
        expect(csv.headers()).toEqual(['Name', 'Age', 'Email', 'Job']);
        expect(csv.row(0).columnCount()).toEqual(4);
    });

    it('throws error when adding row with mismatched column count', async () => {

        const csv = new Csv(['Name', 'Age', 'Job']);

        expect(() => {
            csv.addRow(new Row(2));
        }).toThrow();

        expect(() => {
            csv.addRow(new Row(4));
        }).toThrow();
    });

    it('returns value by row and column index', async () => {

        const csv = new Csv(['Name', 'Age', 'Job']);

        const row1 = new Row(3);
        row1.setValueAt(0, 'Alice');
        row1.setValueAt(1, 30);
        row1.setValueAt(2, 'Engineer');
        csv.addRow(row1);

        const row2 = new Row(3);
        row2.setValueAt(0, 'Bob');
        row2.setValueAt(1, 25);
        row2.setValueAt(2, 'Designer');
        csv.addRow(row2);

        expect(csv.row(0).col(0).get().asString()).toEqual('Alice');
        expect(csv.row(0).col(1).get().asNumber()).toEqual(30);
        expect(csv.row(0).col(2).get().asString()).toEqual('Engineer');
        expect(csv.row(1).col(0).get().asString()).toEqual('Bob');
        expect(csv.row(1).col(1).get().asNumber()).toEqual(25);
        expect(csv.row(1).col(2).get().asString()).toEqual('Designer');

        expect(csv.value(0, 0).asString()).toEqual('Alice');
        expect(csv.value(0, 1).asNumber()).toEqual(30);
        expect(csv.value(0, 2).asString()).toEqual('Engineer');
        expect(csv.value(1, 0).asString()).toEqual('Bob');
        expect(csv.value(1, 1).asNumber()).toEqual(25);
        expect(csv.value(1, 2).asString()).toEqual('Designer');
    });

    it('returns value by row and header name', async () => {

        const csv = new Csv(['Name', 'Age', 'Job']);

        const row1 = new Row(3);
        row1.setValueAt(0, 'Alice');
        row1.setValueAt(1, 30);
        row1.setValueAt(2, 'Engineer');
        csv.addRow(row1);

        const row2 = new Row(3);
        row2.setValueAt(0, 'Bob');
        row2.setValueAt(1, 25);
        row2.setValueAt(2, 'Designer');
        csv.addRow(row2);

        expect(csv.row(0).col('Name').get().asString()).toEqual('Alice');
        expect(csv.row(0).col('Age').get().asNumber()).toEqual(30);
        expect(csv.row(0).col('Job').get().asString()).toEqual('Engineer');
        expect(csv.row(1).col('Name').get().asString()).toEqual('Bob');
        expect(csv.row(1).col('Age').get().asNumber()).toEqual(25);
        expect(csv.row(1).col('Job').get().asString()).toEqual('Designer');

        expect(csv.value(0, 'Name').asString()).toEqual('Alice');
        expect(csv.value(0, 'Age').asNumber()).toEqual(30);
        expect(csv.value(0, 'Job').asString()).toEqual('Engineer');
        expect(csv.value(1, 'Name').asString()).toEqual('Bob');
        expect(csv.value(1, 'Age').asNumber()).toEqual(25);
        expect(csv.value(1, 'Job').asString()).toEqual('Designer');
    });

    it('throws error for invalid header name', async () => {

        const csv = new Csv(['Name', 'Age', 'Job']);

        const row1 = new Row(3);
        row1.setValueAt(0, 'Alice');
        row1.setValueAt(1, 30);
        row1.setValueAt(2, 'Engineer');
        csv.addRow(row1);

        expect(() => csv.row(0).col('Email')).toThrow();
        expect(() => csv.value(0, 'Email')).toThrow();
    });

    it('sets value by row and column index', async () => {

        const csv = new Csv(['Name', 'Age', 'Job']);

        const row = new Row(3);
        row.setValueAt(0, 'Alice');
        row.setValueAt(1, 30);
        row.setValueAt(2, 'Engineer');
        csv.addRow(row);

        expect(csv.row(0).col(0).get().asString()).toEqual('Alice');
        expect(csv.row(0).col(1).get().asNumber()).toEqual(30);
        expect(csv.row(0).col(2).get().asString()).toEqual('Engineer');

        expect(csv.value(0, 0).asString()).toEqual('Alice');
        expect(csv.value(0, 1).asNumber()).toEqual(30);
        expect(csv.value(0, 2).asString()).toEqual('Engineer');

        csv.row(0).set(0, 'Bob');
        csv.row(0).set(1, 25);
        csv.row(0).set(2, 'Designer');

        expect(csv.row(0).col(0).get().asString()).toEqual('Bob');
        expect(csv.row(0).col(1).get().asNumber()).toEqual(25);
        expect(csv.row(0).col(2).get().asString()).toEqual('Designer');

        expect(csv.value(0, 0).asString()).toEqual('Bob');
        expect(csv.value(0, 1).asNumber()).toEqual(25);
        expect(csv.value(0, 2).asString()).toEqual('Designer');

        csv.set(0, 0, 'Charlie');
        csv.set(0, 1, 28);
        csv.set(0, 2, 'Manager');

        expect(csv.row(0).col(0).get().asString()).toEqual('Charlie');
        expect(csv.row(0).col(1).get().asNumber()).toEqual(28);
        expect(csv.row(0).col(2).get().asString()).toEqual('Manager');

        expect(csv.value(0, 0).asString()).toEqual('Charlie');
        expect(csv.value(0, 1).asNumber()).toEqual(28);
        expect(csv.value(0, 2).asString()).toEqual('Manager');

        csv.set(0, 'Name', 'David');
        csv.set(0, 'Age', 35);
        csv.set(0, 'Job', 'Director');

        expect(csv.row(0).col(0).get().asString()).toEqual('David');
        expect(csv.row(0).col(1).get().asNumber()).toEqual(35);
        expect(csv.row(0).col(2).get().asString()).toEqual('Director');

        expect(csv.value(0, 0).asString()).toEqual('David');
        expect(csv.value(0, 1).asNumber()).toEqual(35);
        expect(csv.value(0, 2).asString()).toEqual('Director');
    });

    it('throws error for out-of-range row index', async () => {
        
        const csv = new Csv(['Name', 'Age', 'Job']);
        csv.addRow(new Row(3));

        expect(() => csv.row(-1)).toThrow();
        expect(() => csv.row(1)).toThrow();
        expect(() => csv.value(-1, 'Name')).toThrow();
        expect(() => csv.value(1, 'Name')).toThrow();
    });

    it('throws error for invalid header name when setting value', async () => {

        const csv = new Csv(['Name', 'Age', 'Job']);

        const row = new Row(3);
        row.setValueAt(0, 'Alice');
        row.setValueAt(1, 30);
        row.setValueAt(2, 'Engineer');
        csv.addRow(row);

        expect(() => csv.row(0).set('Country', 'USA')).toThrow();
        expect(() => csv.set(0, 'Country', 'USA')).toThrow();
    });

    it('throws error for out-of-range column index when setting value', async () => {

        const csv = new Csv(['Name', 'Age', 'Job']);

        const row = new Row(3);
        row.setValueAt(0, 'Alice');
        row.setValueAt(1, 30);
        row.setValueAt(2, 'Engineer');
        csv.addRow(row);

        expect(() => csv.row(0).set(3, 'USA')).toThrow();
        expect(() => csv.row(0).set(-1, 'USA')).toThrow();
        expect(() => csv.set(0, 3, 'USA')).toThrow();
        expect(() => csv.set(0, -1, 'USA')).toThrow();
    });

    it('throws error when setting value for out-of-range row index', async () => {
        
        const csv = new Csv(['Name', 'Age', 'Job']);
        csv.addRow(new Row(3));

        expect(() => csv.set(-1, 'Name', 'Bob')).toThrow();
        expect(() => csv.set(1, 'Name', 'Bob')).toThrow();

        expect(() => csv.set(-1, 0, 'Bob')).toThrow();
        expect(() => csv.set(1, 0, 'Bob')).toThrow();
    });

    it('sorts rows by column index in ascending order', async () => {

        const csv = new Csv(['Name', 'Age']);

        const row1 = new Row(2);
        row1.setValueAt(0, 'Charlie');
        row1.setValueAt(1, 28);
        csv.addRow(row1);

        const row2 = new Row(2);
        row2.setValueAt(0, 'Alice');
        row2.setValueAt(1, 30);
        csv.addRow(row2);

        const row3 = new Row(2);
        row3.setValueAt(0, 'Bob');
        row3.setValueAt(1, 25);
        csv.addRow(row3);

        csv.sortByColumnAsc(0);

        expect(csv.value(0, 0).asString()).toEqual('Alice');
        expect(csv.value(1, 0).asString()).toEqual('Bob');
        expect(csv.value(2, 0).asString()).toEqual('Charlie');

        csv.sortByColumnAsc(1);

        expect(csv.value(0, 1).asNumber()).toEqual(25);
        expect(csv.value(1, 1).asNumber()).toEqual(28);
        expect(csv.value(2, 1).asNumber()).toEqual(30);
    });

    it('sorts rows by header name in ascending order', async () => {

        const csv = new Csv(['Name', 'Age']);

        const row1 = new Row(2);
        row1.setValueAt(0, 'Charlie');
        row1.setValueAt(1, 28);
        csv.addRow(row1);

        const row2 = new Row(2);
        row2.setValueAt(0, 'Alice');
        row2.setValueAt(1, 30);
        csv.addRow(row2);

        const row3 = new Row(2);
        row3.setValueAt(0, 'Bob');
        row3.setValueAt(1, 25);
        csv.addRow(row3);

        csv.sortByColumnAsc('Name');

        expect(csv.value(0, 'Name').asString()).toEqual('Alice');
        expect(csv.value(1, 'Name').asString()).toEqual('Bob');
        expect(csv.value(2, 'Name').asString()).toEqual('Charlie');

        csv.sortByColumnAsc('Age');

        expect(csv.value(0, 'Age').asNumber()).toEqual(25);
        expect(csv.value(1, 'Age').asNumber()).toEqual(28);
        expect(csv.value(2, 'Age').asNumber()).toEqual(30);
    });

    it('sorts rows by column index in descending order', async () => {

        const csv = new Csv(['Name', 'Age']);

        const row1 = new Row(2);
        row1.setValueAt(0, 'Alice');
        row1.setValueAt(1, 30);
        csv.addRow(row1);

        const row2 = new Row(2);
        row2.setValueAt(0, 'Charlie');
        row2.setValueAt(1, 28);
        csv.addRow(row2);

        const row3 = new Row(2);
        row3.setValueAt(0, 'Bob');
        row3.setValueAt(1, 25);
        csv.addRow(row3);

        csv.sortByColumnDesc(0);

        expect(csv.value(0, 0).asString()).toEqual('Charlie');
        expect(csv.value(1, 0).asString()).toEqual('Bob');
        expect(csv.value(2, 0).asString()).toEqual('Alice');

        csv.sortByColumnDesc(1);

        expect(csv.value(0, 1).asNumber()).toEqual(30);
        expect(csv.value(1, 1).asNumber()).toEqual(28);
        expect(csv.value(2, 1).asNumber()).toEqual(25);
    });

    it('sorts rows by header name in descending order', async () => {

        const csv = new Csv(['Name', 'Age']);

        const row1 = new Row(2);
        row1.setValueAt(0, 'Alice');
        row1.setValueAt(1, 30);
        csv.addRow(row1);

        const row2 = new Row(2);
        row2.setValueAt(0, 'Charlie');
        row2.setValueAt(1, 28);
        csv.addRow(row2);

        const row3 = new Row(2);
        row3.setValueAt(0, 'Bob');
        row3.setValueAt(1, 25);
        csv.addRow(row3);

        csv.sortByColumnDesc('Name');

        expect(csv.value(0, 'Name').asString()).toEqual('Charlie');
        expect(csv.value(1, 'Name').asString()).toEqual('Bob');
        expect(csv.value(2, 'Name').asString()).toEqual('Alice');

        csv.sortByColumnDesc('Age');

        expect(csv.value(0, 'Age').asNumber()).toEqual(30);
        expect(csv.value(1, 'Age').asNumber()).toEqual(28);
        expect(csv.value(2, 'Age').asNumber()).toEqual(25);
    });

    it('sorts columns by header name in ascending order', async () => {

        const csv = new Csv(['Charlie', 'Alice', 'Bob']);

        const row = new Row(3);
        row.setValueAt(0, 3);
        row.setValueAt(1, 1);
        row.setValueAt(2, 2);
        csv.addRow(row);

        csv.sortByHeaderAsc();

        expect(csv.headers()).toEqual(['Alice', 'Bob', 'Charlie']);
        expect(csv.row(0).col(0).get().asNumber()).toEqual(1);
        expect(csv.row(0).col(1).get().asNumber()).toEqual(2);
        expect(csv.row(0).col(2).get().asNumber()).toEqual(3);

        const csvNoHeaders = new Csv([]);
        const rowNoHeaders = new Row(3);
        rowNoHeaders.setValueAt(0, 'X');
        rowNoHeaders.setValueAt(1, 'Y');
        rowNoHeaders.setValueAt(2, 'Z');
        csvNoHeaders.addRow(rowNoHeaders);

        csvNoHeaders.sortByHeaderAsc();

        expect(csvNoHeaders.headers()).toEqual([]);
        expect(csvNoHeaders.row(0).col(0).get().asString()).toEqual('X');
        expect(csvNoHeaders.row(0).col(1).get().asString()).toEqual('Y');
        expect(csvNoHeaders.row(0).col(2).get().asString()).toEqual('Z');
    });

    it('sorts columns by header name in descending order', async () => {

        const csv = new Csv(['Charlie', 'Alice', 'Bob']);

        const row = new Row(3);
        row.setValueAt(0, 3);
        row.setValueAt(1, 1);
        row.setValueAt(2, 2);
        csv.addRow(row);

        csv.sortByHeaderDesc();

        expect(csv.headers()).toEqual(['Charlie', 'Bob', 'Alice']);
        expect(csv.row(0).col(0).get().asNumber()).toEqual(3);
        expect(csv.row(0).col(1).get().asNumber()).toEqual(2);
        expect(csv.row(0).col(2).get().asNumber()).toEqual(1);

        const csvNoHeaders = new Csv([]);
        const rowNoHeaders = new Row(3);
        rowNoHeaders.setValueAt(0, 'X');
        rowNoHeaders.setValueAt(1, 'Y');
        rowNoHeaders.setValueAt(2, 'Z');
        csvNoHeaders.addRow(rowNoHeaders);

        csvNoHeaders.sortByHeaderDesc();

        expect(csvNoHeaders.headers()).toEqual([]);
        expect(csvNoHeaders.row(0).col(0).get().asString()).toEqual('X');
        expect(csvNoHeaders.row(0).col(1).get().asString()).toEqual('Y');
        expect(csvNoHeaders.row(0).col(2).get().asString()).toEqual('Z');
    });

    it('throws if sorting by non-existent header name', async () => {

        const csv = new Csv(['Name', 'Age']);

        const row = new Row(2);
        row.setValueAt(0, 'Alice');
        row.setValueAt(1, 30);
        csv.addRow(row);

        expect(() => csv.sortByColumnAsc('NonExistent')).toThrow();
        expect(() => csv.sortByColumnDesc('NonExistent')).toThrow();
    });

    it('throws if sorting by column index out of range', async () => {

        const csv = new Csv(['Name', 'Age']);

        const row = new Row(2);
        row.setValueAt(0, 'Alice');
        row.setValueAt(1, 30);
        csv.addRow(row);

        expect(() => csv.sortByColumnAsc(2)).toThrow();
        expect(() => csv.sortByColumnAsc(-1)).toThrow();
        expect(() => csv.sortByColumnDesc(2)).toThrow();
        expect(() => csv.sortByColumnDesc(-1)).toThrow();
    });

    it('sorting doesnt chage order if values are equal', async () => {

        const csv = new Csv(['Name', 'Age']);

        const row1 = new Row(2);
        row1.setValueAt(0, 'Alice');
        row1.setValueAt(1, 30);
        csv.addRow(row1);

        const row2 = new Row(2);
        row2.setValueAt(0, 'Bob');
        row2.setValueAt(1, 30);
        csv.addRow(row2);

        const row3 = new Row(2);
        row3.setValueAt(0, 'Charlie');
        row3.setValueAt(1, 30);
        csv.addRow(row3);

        csv.sortByColumnAsc(1);

        expect(csv.value(0, 0).asString()).toEqual('Alice');
        expect(csv.value(1, 0).asString()).toEqual('Bob');
        expect(csv.value(2, 0).asString()).toEqual('Charlie');

        csv.sortByColumnDesc(1);

        expect(csv.value(0, 0).asString()).toEqual('Alice');
        expect(csv.value(1, 0).asString()).toEqual('Bob');
        expect(csv.value(2, 0).asString()).toEqual('Charlie');
    });

    it('stringify CSV', async () => {

        const csv = new Csv(['Name', 'Age', 'Job']);

        const row1 = new Row(3);
        row1.setValueAt(0, 'Alice');
        row1.setValueAt(1, 30);
        row1.setValueAt(2, 'Engineer');
        csv.addRow(row1);

        const row2 = new Row(3);
        row2.setValueAt(0, 'Bob');
        row2.setValueAt(1, 25);
        row2.setValueAt(2, 'Designer');
        csv.addRow(row2);

        expect(csv.stringify()).toEqual('Name,Age,Job\nAlice,30,Engineer\nBob,25,Designer');
        expect(csv.stringify('|')).toEqual('Name|Age|Job\nAlice|30|Engineer\nBob|25|Designer');
        expect(csv.stringify(',', '"')).toEqual('"Name","Age","Job"\n"Alice","30","Engineer"\n"Bob","25","Designer"');
        expect(csv.stringify('|', "'")).toEqual("'Name'|'Age'|'Job'\n'Alice'|'30'|'Engineer'\n'Bob'|'25'|'Designer'");

        const csvNoHeaders = new Csv([]);

        const row3 = new Row(3);
        row3.setValueAt(0, 'Alice');
        row3.setValueAt(1, 30);
        row3.setValueAt(2, 'Engineer');
        csvNoHeaders.addRow(row3);

        const row4 = new Row(3);
        row4.setValueAt(0, 'Bob');
        row4.setValueAt(1, 25);
        row4.setValueAt(2, 'Designer');
        csvNoHeaders.addRow(row4);

        expect(csvNoHeaders.stringify()).toEqual('Alice,30,Engineer\nBob,25,Designer');
        expect(csvNoHeaders.stringify('|')).toEqual('Alice|30|Engineer\nBob|25|Designer');
        expect(csvNoHeaders.stringify(',', '"')).toEqual('"Alice","30","Engineer"\n"Bob","25","Designer"');
        expect(csvNoHeaders.stringify('|', "'")).toEqual("'Alice'|'30'|'Engineer'\n'Bob'|'25'|'Designer'");
    });

    it('throw if delimiter is empty string', async () => {

        const csv = new Csv(['Name', 'Age']);
        
        expect(() => csv.stringify('')).toThrow();
    });

    it('throw if quote is not single character', async () => {

        const csv = new Csv(['Name', 'Age']);
        
        expect(() => csv.stringify(',', '""')).toThrow();
    });
});