import { createWebApiDriverItemOld } from 'src_common/browser/apiUtils';

import { createAccaConfig } from './config/accaGame/createAccaConfig';

export const configOrbital = {
    createAccaConfig: createWebApiDriverItemOld(createAccaConfig),
};

export const apiOrbital = configOrbital;
