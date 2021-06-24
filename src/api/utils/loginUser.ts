import { autorun } from 'mobx';
import { apiCommon } from 'src/api/ApiCommon';
import { insertIncomeAccessPixelWrapper } from 'src/api/utils/insertIncomeAccessPixelWrapper';
import { AccountState } from 'src/appState/accountState/AccountState';
import { ConfigMainType } from 'src/config/features/config';
import { LoginResponseType } from 'src/api/config/accounts/login';

export const loginUser = async (disable_geo: true | undefined, accountState: AccountState, config: ConfigMainType, email: string, password: string, type: 'login' | 'registration'): Promise<LoginResponseType> => {
    const loginStatus = await apiCommon.login.run({ email, password, disable_geo });

    if (loginStatus.type !== 'ok') {
        return loginStatus;
    }

    autorun((reaction) => {
        const account = accountState.account;

        if (account !== null) {
            reaction.dispose();
            const accountId = account.getId();

            insertIncomeAccessPixelWrapper(config.insertIncomeAccessPixel, accountId, type);
        }
    });

    return loginStatus;
};
