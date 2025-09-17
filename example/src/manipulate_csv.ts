import { Parser } from '@mitte/csv';

const csvText = `
name,age,city,work
Alice,30,New York,Engineer
Bob,25,Los Angeles,Designer
Charlie,35,Chicago,Teacher
`;

// cerating a parser instance
const parser = new Parser({
    header: true,       // first row as header
    trimSpaces: true,   // trim spaces around values
    noQuotes: true,     // remove quotes around values
    quotes: ['"', "'"], // custom quote characters
    delim: ',',         // custom delimiter
});

const csv = parser.parse(csvText);

// Accessing values
console.log(csv.value(1, 'city').asString()); // => 'Los Angeles'

// Modifying values
csv.set(0, 'name', 'Alicia');

console.log(csv.value(0, 'name').asString()); // => 'Alicia'

// Sorting by header name
csv.sortByHeaderDesc();

console.log(csv.value(0, 3).asNumber()); // => 30

// Sorting by column value
csv.sortByColumnAsc('age');

console.log(csv.value(0, 'name').asString()); // => 'Bob'

// Appending a new header and setting values
csv.appendHeaders(['birthdate']);

csv.set(0, 'birthdate', new Date('1998-01-15'));
csv.set(1, 'birthdate', new Date('1990-05-20'));
csv.set(2, 'birthdate', new Date('1988-12-30'));

console.log(csv.value(1, 'birthdate').asDate()); // => 1990-05-20T00:00:00.000Z