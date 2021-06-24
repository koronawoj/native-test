import { buildModelValidator, buildApiItemDefault } from 'src/api/utils/modelUtils';
import { decodeString } from 'src/api/utils/commonModelValidators';

const modelConfig = {
    type: buildApiItemDefault(decodeString, 'To do'),
};


export const decodeChangeOddFormatDataModel = buildModelValidator('Change odds format', modelConfig);

export type ChangeOddFormatDataModelType = ReturnType<typeof decodeChangeOddFormatDataModel>;
