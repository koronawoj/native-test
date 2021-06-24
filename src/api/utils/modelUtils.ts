import { assertNever } from "@twoupdigital/mobx-utils/libjs/assertNever";
import * as t from 'io-ts';
import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import { recordGet } from "src/utils/safeGetters";

interface ContextItemType {
    type: 'item',
    message: string,
    data: unknown,
}

interface ContextErrorStatusType {
    type: 'errorStatus',
    showError: boolean,
}

const createContextItem = (message: string, data: unknown): ContextItemType => ({
    type: 'item',
    message,
    data,
});

const createErrorStatus = (status: boolean): ContextErrorStatusType => ({
    type: 'errorStatus',
    showError: status,
});

const globalContext: Array<ContextItemType | ContextErrorStatusType> = [];

const getPathFromContext = (): string => {
    const out: Array<string> = [];

    for (const item of globalContext) {
        if (item.type === 'item') {
            out.push(item.message);
        }
    }

    return out.join(' -> ');
};

const showErrorEnable = (): boolean => {
    for (const item of globalContext) {
        if (item.type === 'errorStatus') {
            if (item.showError === false) {
                return false;
            }
        }
    }

    return true;
};

const cloneData = (data: unknown): unknown => {
    if (data === undefined) {
        return data;
    }

    return JSON.parse(JSON.stringify(data));
};

const showMessage = (errorTrace: Error, message: string, data: unknown): void => {
    if (showErrorEnable() === false) {
        console.warn(`Partial validator - redundant message for -> ${getPathFromContext()}`);
        return;
    }

    console.group();
    console.error(`Partial validator message -> ${message}`);
    console.info('path', getPathFromContext());
    console.info('data', data);
    console.info(errorTrace);
    console.info('context', cloneData(globalContext));
    console.groupEnd();
};


const decodeObject = buildValidator('decodeObject', t.interface({}));

export type ApiItemBase<T> = {
    type: 'default',
    decode: (value: unknown) => T | Error,
    default: T;
} | {
    type: 'simple',
    decode: (value: unknown) => T,
};

export const buildApiItemDefault = <T>(decode: ((value: unknown) => T | Error), defaultValue: T): ApiItemBase<T> => ({
    type: 'default',
    decode,
    default: defaultValue
});

export const buildApiItemSimple = <T>(decode: (value: unknown) => T): ApiItemBase<T> => ({
    type: 'simple',
    decode,
});

const decodeFieldModel = <T>(errorTrace: Error, config: ApiItemBase<T>, data: unknown): T => {

    if (config.type === 'default') {
        const decodedData = config.decode(data);

        if (decodedData instanceof Error) {
            showMessage(errorTrace, 'Not match', data);
            return config.default;
        }
        return decodedData;

    }

    if (config.type === 'simple') {
        return config.decode(data);
    }

    assertNever('buildValidatorFieldModel', config);
};

type ModelItem<T extends ApiItemBase<unknown>> = T extends ApiItemBase<infer FieldType> ? FieldType : never;

export type ModelReturn<T extends Record<string, ApiItemBase<unknown>>> = {
    readonly [P in keyof T]: ModelItem<T[P]>
};

const ArrayIO = t.array(t.interface({}));
const decodeArray = buildValidator('ArrayIO', ArrayIO, true);

export const buildArrayDecoderModel = <T>(decode: (data: unknown) => T): ((data: unknown) => Array<T>) => {

    return (data: unknown): Array<T> => {
        const out: Array<T> = [];

        const arr = decodeArray(data);

        if (arr instanceof Error) {
            console.error(arr);
            return out;
        }

        arr.forEach((item, index) => {
            globalContext.push(createContextItem(`index:${index}`, item));

            out.push(decode(item));

            globalContext.pop();
        });

        return out;
    };
};


const RecordIO = t.interface({});
const decodeRecord = buildValidator('RecordIO', RecordIO, true);


export const buildRecordDecoderModel = <T>(
    decode: (data: unknown) => T
): ((data: unknown) => Record<string, T>) => {

    return (data: unknown): Record<string, T> => {
        const out: Record<string, T> = {};

        const record = decodeRecord(data);

        if (record instanceof Error) {
            console.error(record);
            return out;
        }

        for (const [key, value] of Object.entries(record)) {
            globalContext.push(createContextItem(`key:${key}`, value));
            out[key] = decode(value);
            globalContext.pop();
        }

        return out;
    };
};


export const buildDecodeWithDefault = <T>(label: string, decode: (data: unknown) => T | Error, defaultValue: T): ((data: unknown) => T) => {
    const errorTrace = new Error('The place where the validator was created');

    return (data: unknown): T => {
        const decodedData = decode(data);
        if (decodedData instanceof Error) {
            showMessage(errorTrace, `${label} - error match`, data);
            return defaultValue;
        }
        return decodedData;
    };
};

//createErrorStatus

export const buildModelValidator = <T extends Record<string, ApiItemBase<unknown>>>(
    modelName: string,
    modelConfig: T,
    shouldAllMatch?: boolean
): ((data: unknown) => ModelReturn<T>) => {

    const errorTrace = new Error('The place where the validator was created');

    return (data: unknown): ModelReturn<T> => {
        globalContext.push(createContextItem(`model:${modelName}`, data));


        const decodedData = ((): Record<string, unknown> => {
            const decodedData = decodeObject(data);

            if (decodedData instanceof Error) {
                showMessage(errorTrace, 'Expected object', data);
                globalContext.push(createErrorStatus(false));
                return {};
            }

            globalContext.push(createErrorStatus(true));
            return decodedData;
        })();

        //shouldAllMatch
        const allKeys = new Set(Object.keys(decodedData));

        const model: Record<string, unknown> = {};

        for (const [key, config] of Object.entries(modelConfig)) {
            const valueToTest = recordGet(decodedData, key);

            globalContext.push(createContextItem(`key:${key}`, valueToTest));

            model[key] = decodeFieldModel(errorTrace, config, valueToTest);

            allKeys.delete(key);

            globalContext.pop();
        }
    
        if (shouldAllMatch === true && allKeys.size > 0) {
            showMessage(errorTrace, 'All keys should be decoded', Array.from(allKeys));
        }

        globalContext.pop();            //pop error status
        globalContext.pop();            //pop label

        //@ts-expect-error
        return model;
    };
};

export const buildModelValidatorStrict = <T extends Record<string, ApiItemBase<unknown>>>(
    modelName: string,
    modelConfig: T,
): ((data: unknown) => ModelReturn<T>) => {
    return buildModelValidator(modelName, modelConfig, true);
};