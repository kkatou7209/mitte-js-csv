import { describe, expect, it } from "vitest";
import { parseRowsToObjects } from "./parseRowsToObjects";

describe.concurrent('parseToObject', () => {

    it('parse rows as number indexed object', async () => {

        const src = [
            ['value1', 'valu"e2', 'value3'],
            ['valueOne', 'valueTwo', 'valueThree'],
        ];

        const expected = [
            {
                '0': 'value1',
                '1': 'valu"e2',
                '2': 'value3',
            },
            {
                '0': 'valueOne',
                '1': 'valueTwo',
                '2': 'valueThree',
            }
        ];

        expect(parseRowsToObjects(src)).toEqual(expected);
    });

    it('parse rows prop names', async () => {

        const src = [
            ['value1', 'value2', 'value3'],
            ['one', 'two', 'three'],
            ['ein', 'zwei'],
        ];

        const expected = [
            {
                value1: 'one',
                value2: 'two',
                value3: 'three',
            },
            {
                value1: 'ein',
                value2: 'zwei',
                value3: '',
            },
        ];

        expect(parseRowsToObjects(src, { headerProp: true })).toEqual(expected);
    });

    it('parse rows to objects with specified case prop name.', async () => {

        const src = [
            ['prop_name1', 'PROP_NAME_2', 'PropName3', 'propName4', 'prop-name-5',],
            ['value1', 'value2', 'value3', 'value4', 'value5',],
        ];

        expect(parseRowsToObjects(src, { headerProp: true, case: 'lowerCamel' }))
            .toEqual([{
                'propName1': 'value1',
                'propName2': 'value2',
                'propName3': 'value3',
                'propName4': 'value4',
                'propName5': 'value5',
            }]);
        
        expect(parseRowsToObjects(src, { headerProp: true, case: 'upperCamel' }))
            .toEqual([{
                'PropName1': 'value1',
                'PropName2': 'value2',
                'PropName3': 'value3',
                'PropName4': 'value4',
                'PropName5': 'value5',
            }]);

        expect(parseRowsToObjects(src, { headerProp: true, case: 'upperSnake' }))
            .toEqual([{
                'PROP_NAME_1': 'value1',
                'PROP_NAME_2': 'value2',
                'PROP_NAME_3': 'value3',
                'PROP_NAME_4': 'value4',
                'PROP_NAME_5': 'value5',
            }]);

        expect(parseRowsToObjects(src, { headerProp: true, case: 'lowerSnake' }))
            .toEqual([{
                'prop_name_1': 'value1',
                'prop_name_2': 'value2',
                'prop_name_3': 'value3',
                'prop_name_4': 'value4',
                'prop_name_5': 'value5',
            }]);

        expect(parseRowsToObjects(src, { headerProp: true, case: 'kabab' }))
            .toEqual([{
                'prop-name-1': 'value1',
                'prop-name-2': 'value2',
                'prop-name-3': 'value3',
                'prop-name-4': 'value4',
                'prop-name-5': 'value5',
            }]);
    });

    it('throw if empty array with headerProp option', async () => {

        expect(() => parseRowsToObjects([], { headerProp: true })).toThrow();
    });

    it('throw if array has same name header.', async () => {

        expect(() => parseRowsToObjects([['name', 'other', 'name']], { headerProp: true })).toThrow();
    });
});