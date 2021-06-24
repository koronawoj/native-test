import { buildModelValidator, buildApiItemDefault } from 'src/api/utils/modelUtils';
import { decodeString, decodeNumber } from 'src/api/utils/commonModelValidators';

const modelConfig = {
    id: buildApiItemDefault(decodeNumber, 0),
    headline: buildApiItemDefault(decodeString, ''),
    description: buildApiItemDefault(decodeString, ''),
    btnText: buildApiItemDefault(decodeString, ''),
    btnAction: buildApiItemDefault(decodeString, ''),
    scheduleStart: buildApiItemDefault(decodeString, ''),
    scheduleEnd: buildApiItemDefault(decodeString, ''),
    slideType: buildApiItemDefault(decodeString, ''),
    createdDate: buildApiItemDefault(decodeString, ''),
    updatedDate: buildApiItemDefault(decodeString, '')
};

export const decodeBannersDataModel = buildModelValidator('BannersData', modelConfig);

export type BannersDataModelType = ReturnType<typeof decodeBannersDataModel>;