# @mitte/csv

`@mitte/csv` is a simple TypeScript library for handling CSV formatted text data.

## Features

- Manipulate CSV data: retrieve values, set new values, and sort rows and columns.
- Output edited data as string.
- Convert CSV string to rows.
- Convert CSV string to objects.

## Usage

A very simple usage example.

```ts
import { Parser, type Csv } from '@mitte/csv';

// create parser
const parser = new Parser();

const csv: Csv = parser.parse(`
John,40,USA,Designer,1985-01-09
Jane,35,UK,Developer,1990-05-24
Alice,18,Canada,Manager,2008-10-08
`);

console.log(csv.row(0).col(1).get().asNumber());
// => 40

csv.row(1).col(0).set('Mark');

console.log(csv.row(1).col(0).get().asString());
// => 'Mark'
```

If you want to get a single value, use a simpler method.

```ts
console.log(csv.value(2, 1).asNumber());
// => 18
```
Each value can be retrieved as a `string`, `number`, or `Date` using the `Csv`.

```ts
console.log(csv.value(0, 0).asString());
// => 'John'

console.log(csv.value(0, 1).asNumber());
// => 40

console.log(csv.value(0, 4).asDate());
// => Date object representing 1985-01-09
```

Finally, get the CSV as a string.

```ts
const csvText = csv.stringify();

console.log(csvText);
// => 
// John,40,USA,Designer,1985-01-09
// Mark,35,UK,Developer,1990-05-24
// Alice,18,Canada,Manager,2008-10-08
```

Convert string to rows.

```ts
const parser = new Parser();

const rows = parser.toRows(`
John,40,USA,Designer,1985-01-09
Jane,35,UK,Developer,1990-05-24
Alice,18,Canada,Manager,2008-10-08
`);

console.log(rows);
// => [
//   ['John', '40', 'USA', 'Designer', '1985-01-09'],
//   ['Jane', '35', 'UK', 'Developer', '1990-05-24'],
//   ['Alice', '18', 'Canada', 'Manager', '2008-10-08']
// ]
```

You can also get rows as objects.

```ts
const records = parser.toObjects<{
    name: string;
    age: string;
    country: string;
    job: string;
    birth: string;
}>(`
name,age,country,job,birth
John,40,USA,Designer,1985-01-09
Jane,35,UK,Developer,1990-05-24
Alice,18,Canada,Manager,2008-10-08
`, {
    headerProp: true,
});

console.log(records);
// => [
//   { name: 'John', age: '40', country: 'USA', job: 'Designer', birth: '1985-01-09' },
//   { name: 'Jane', age: '35', country: 'UK', job: 'Developer', birth: '1990-05-24' },
//   { name: 'Alice', age: '18', country: 'Canada', job: 'Manager', birth: '2008-10-08' }
// ]
```

---

For more example, see also [./example](./example)

## Installation

**npm**

```bash
npm install @mitte/csv
```

## License

This package is under the MIT license.