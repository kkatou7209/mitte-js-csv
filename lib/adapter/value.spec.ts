import { describe, expect, it } from "vitest";
import { Value } from "@/adapter/value.ts";

describe.concurrent('adapter/value', () => {

    it('toNumber test', async () => {

        let value = new Value('\n\t 100.003e-8 ');

        expect(value.toNumber()).toEqual(100.003e-8);

        value = new Value('897gh');

        expect(() => value.toNumber()).toThrow();
    });

    it('toDate test', async () => {

        let value = new Value('2025-07-24 10:09:40 Z');

        expect(value.toDate()).toEqual(new Date('2025-07-24 10:09:40 Z'));

        value = new Value('absgdke99');

        expect(() => value.toDate()).toThrow();
    });

    it('copy test', async () => {

        const value = new Value('Lorem');

        const copy = value.copy();

        expect(copy).not.toBe(value);
        expect(copy.toString()).toEqual(value.toString());
    });

    it('throw if toNumber is too large', async () => {

        const value = new Value('1e309');

        expect(() => value.toNumber()).toThrow();
    });
});