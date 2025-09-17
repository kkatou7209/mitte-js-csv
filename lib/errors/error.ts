export class MitteCsvConversionError extends Error {

    public constructor(message?: string, options?: ErrorOptions) {
        super(message, options);
        this.name = 'MitteCsvConversionError';
    }
}

export class MitteCsvOptionError extends Error {

    public constructor(message?: string, options?: ErrorOptions) {
        super(message, options);
        this.name = 'MitteCsvOptionError';
    }
}

export class MitteCsvParseError extends Error {

    public constructor(message?: string, options?: ErrorOptions) {
        super(message, options);
        this.name = 'MitteCsvParseError';
    }
}

export class MitteCsvArgumentError extends Error {

    public constructor(message?: string, options?: ErrorOptions) {
        super(message, options);
        this.name = 'MitteCsvArgumentError';
    }
}