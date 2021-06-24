// import * as t from 'io-ts';
import { buildModelValidator, buildApiItemDefault } from 'src/api/utils/modelUtils';
import { decodeString } from 'src/api/utils/commonModelValidators';
// import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';


const modelConfig = buildModelValidator('backoffice deposits data', {
    siteReference: buildApiItemDefault(decodeString, ''),
    // wsPassword: buildApiItemDefault(decodeString, ''),
    wsUsername: buildApiItemDefault(decodeString, ''),
    // siteSecurityHashingPassword: buildApiItemDefault(decodeString, ''),
    // channel: buildApiItemDefault(decodeString, ''),
    // initiationreason: buildApiItemDefault(decodeString, ''),
    // jwtUser: buildApiItemDefault(decodeString, ''),
    // jwtSecret: buildApiItemDefault(decodeString, ''),
    // requestTypeDescriptions: buildApiItemDefault(buildValidator('', t.unknown), []),
});

export const decodeBackofficeDepositsDataModel = modelConfig;

export type BackofficeDepositsModelType = ReturnType<typeof decodeBackofficeDepositsDataModel>;
