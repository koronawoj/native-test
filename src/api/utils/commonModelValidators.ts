import * as t from 'io-ts';
import {buildValidator} from "@twoupdigital/mobx-utils/libjs/buildValidator";

export const decodeString = buildValidator('', t.string);
export const decodeNumber = buildValidator('', t.number);
export const decodeBoolean = buildValidator('', t.boolean);

export const decodeStringOrNumber = buildValidator('decodeStringOrNumber', t.union([t.string, t.number]));

export const decodeNumberOrUndefined = buildValidator('', t.union([ t.number, t.undefined, t.null ]));
export const decodeStringOrUndefined = buildValidator('', t.union([ t.string, t.undefined, t.null ]));
export const decodeBooleanOrUndefined = buildValidator('', t.union([ t.boolean, t.null, t.undefined ]));

export const decodeStringOrNull = buildValidator('', t.union([ t.string, t.null, t.undefined ]));
export const decodeNumberOrNull = buildValidator('', t.union([ t.number, t.null, t.undefined ]));
export const decodeBooleanOrNull = buildValidator('', t.union([ t.boolean, t.null, t.undefined ]));

export const ArrayIO = t.array(t.interface({}));
export const decodeArray = buildValidator('ArrayIO', ArrayIO, true);

export const ArrayNumberIO = t.array(t.union([ t.number, t.undefined, t.null ]));
export const decodeArrayNumberOrNull = buildValidator('ArrayNumberIO', ArrayNumberIO);

export const decodeArrayStringOrNull = buildValidator('ArrayStringIO', t.union([ t.array(t.string), t.undefined, t.null ]));

export const decodeStringArr = buildValidator('', t.array(t.string));
export const decodeNumberArr = buildValidator('', t.array(t.number));

export const decodeArrayOrUndefined = buildValidator('', t.union([ ArrayIO, t.undefined, t.null ]));

export const buildOptionalDecoderModel = <T>(decode: (data: unknown) => T): ((data: unknown) => T | null | undefined) => {
    return (data: unknown): T | null | undefined => {
        if (data === null) {
            return null;
        }

        if (data === undefined) {
            return undefined;
        }

        return decode(data);
    };
};

export const decodeSuccessResponse = buildValidator('', t.literal('success'));
export const decodeErrorResponse = buildValidator('', t.literal('error'));
