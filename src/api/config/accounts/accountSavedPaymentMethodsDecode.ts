import { buildModelValidator, buildApiItemDefault, buildArrayDecoderModel } from 'src/api/utils/modelUtils';
import { decodeString, decodeStringOrNull } from 'src/api/utils/commonModelValidators';

const decodeSavePaymentMethods = buildModelValidator('', {
    expires: buildApiItemDefault(decodeStringOrNull, null),
    id: buildApiItemDefault(decodeString, ''),
    name: buildApiItemDefault(decodeString, ''),
    number: buildApiItemDefault(decodeString, ''),
    provider: buildApiItemDefault(decodeString, ''),
    type: buildApiItemDefault(decodeString, ''),
    subtype: buildApiItemDefault(decodeString, ''),
    providerReference: buildApiItemDefault(decodeString, ''),
    lastUsedAt: buildApiItemDefault(decodeString, '')
});

export const decodeSavePaymentMethodsDataModel = buildArrayDecoderModel(decodeSavePaymentMethods);

export type SavedPaymentMethodCardType = ReturnType<typeof decodeSavePaymentMethods>;

export type SavePaymentMethodsModelType = ReturnType<typeof decodeSavePaymentMethodsDataModel>;
