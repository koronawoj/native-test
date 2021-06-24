import { buildModelValidator, buildApiItemDefault } from 'src/api/utils/modelUtils';
import { decodeString, decodeArray } from 'src/api/utils/commonModelValidators';

const buildArrayDecoderModel = <T>(decode: (data: unknown) => T): ((data: unknown) => Array<T>) => {

    return (data: unknown): Array<T> => {
        const out: Array<T> = [];
        const arr = decodeArray(data);

        if (arr instanceof Error) {
            console.error(arr);
            return out;
        }

        for (const item of arr) {
            out.push(decode(item));
        }

        return out;
    };
};

const decodeBonus = buildModelValidator('', {
    type: buildApiItemDefault(decodeString, ''),
    name: buildApiItemDefault(decodeString, '')
});

const decodeBonuses = buildArrayDecoderModel(decodeBonus);

export type BonusModelType = ReturnType<typeof decodeBonus>;

export const decodeAccountBonusesDataModel = decodeBonuses;

export type AccountBonusesDataModelType = ReturnType<typeof decodeAccountBonusesDataModel>;
