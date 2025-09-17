import { MitteCsvConversionError } from "@/errors/error";

export type ParseToObjectsCaseOption = 'upperCamel' | 'lowerCamel' | 'upperSnake' | 'lowerSnake' | 'kabab' | 'original';

export type ParseRowsToObjectOption = {
    headerProp?: boolean;
    case?: ParseToObjectsCaseOption;
}

const defaultOption = Object.freeze<Required<ParseRowsToObjectOption>>({
    headerProp: false,
    case: 'original',
});

export function parseRowsToObjects<T extends Record<string, string>>(rows: string[][], opts?: ParseRowsToObjectOption): T[] {

    const _opts = { ...defaultOption, ...opts };

    const { headerProp, } = _opts;

    if (headerProp && rows.length === 0) {
        throw new MitteCsvConversionError(`to use first row as property names, need minimum one row. rows=${rows}`);
    }

    const rs = [...rows];

    const result: T[] = [];

    if (headerProp) {

        const propNames = rs.shift()!;

        if (new Set(propNames).size !== propNames.length) {
            throw new MitteCsvConversionError(`same header name cannot be used. names="${propNames}"`);
        }
    
        for (const row of rs) {

            let data: any = {};
    
            for (const [num, name] of propNames.entries()) {
                data[name] = row[num] ?? '';
            }

            if (_opts.case === 'upperCamel') {
                data = toUpperCamel(data);
            }

            if (_opts.case === 'lowerCamel') {
                data = toLowerCamel(data);
            }

            if (_opts.case === 'upperSnake') {
                data = toUpperSnake(data);
            }

            if (_opts.case === 'lowerSnake') {
                data = toLowerSnake(data);
            }

            if (_opts.case === 'kabab') {
                data = toKabab(data);
            }

            result.push(data);
        }

        return result;
    }

    for (const row of rs) {

        const data: any = {};

        for (const [num, value] of row.entries()) {

            data[num] = value;
        }

        result.push(data);
    }

    return result;
}

const pattern = /([a-z][a-z]*|[A-Z][a-z]+|[A-Z][A-Z]*|(?<=(-_)?)[0-9]+(?=(-_)?))/g;

function propToWords(prop: string): string[] {

    return [...prop.matchAll(pattern)].map(m => m[0]);
}

function toUpperCamel<T extends Record<string, string>>(obj: object): T {

    const result: any = {};

    for (const prop of Reflect.ownKeys(obj).map(key => key.toString() as keyof typeof obj)) {

        const words = propToWords(prop)
            .map(word => word.toLowerCase())
            .map(word => word[0].toUpperCase() + word.slice(1));

        const newProp = words.join('');

        result[newProp] = obj[prop];
    }

    return result;
}

function toLowerCamel<T extends Record<string, string>>(obj: object): T {

    const result: any = {};

    for (const prop of Reflect.ownKeys(obj).map(key => key.toString() as keyof typeof obj)) {

        const words = propToWords(prop)
            .map(word => word.toLowerCase())
            .map((word, i) => i === 0 ? word : word[0].toUpperCase() + word.slice(1));

        const newProp = words.join('');

        result[newProp] = obj[prop];
    }

    return result;
}

function toUpperSnake<T extends Record<string, string>>(obj: object): T {

    const result: any = {};

    for (const prop of Reflect.ownKeys(obj).map(key => key.toString() as keyof typeof obj)) {

        const words = propToWords(prop)
            .map(word => word.toUpperCase());

        const newProp = words.join('_');

        result[newProp] = obj[prop];
    }

    return result;
}

function toLowerSnake<T extends Record<string, string>>(obj: object): T {

    const result: any = {};

    for (const prop of Reflect.ownKeys(obj).map(key => key.toString() as keyof typeof obj)) {

        const words = propToWords(prop)
            .map(word => word.toLowerCase());

        const newProp = words.join('_');

        result[newProp] = obj[prop];
    }

    return result;
}

function toKabab<T extends Record<string, string>>(obj: object): T {

    const result: any = {};

    for (const prop of Reflect.ownKeys(obj).map(key => key.toString() as keyof typeof obj)) {

        const words = propToWords(prop)
            .map(word => word.toLowerCase());

        const newProp = words.join('-');

        result[newProp] = obj[prop];
    }

    return result;
}