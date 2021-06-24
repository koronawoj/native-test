import { apiCommon } from 'src/api/ApiCommon';
import { AccountAllBetsDataModelType } from 'src/api/config/accounts/accountAllBetsDataDecode';
import { WebsocketV1 } from 'src/appState/websocketV1/WebsocketV1';
import { ApiResponseWrapper } from 'src/utils-mobx/ApiResponseWrapper';

export class BetsList {

    private readonly data: ApiResponseWrapper<AccountAllBetsDataModelType | null>;

    public constructor(websocketV1: WebsocketV1, userId: number) {
        this.data = new ApiResponseWrapper(
            'BetsList',
            null,
            async (): Promise<AccountAllBetsDataModelType> => {
                const resp = await apiCommon.accountAllBetsData.run({
                    perPage: 500
                });
                return resp;
            },
            (refresh) => {
                const callback = (): void => {
                    refresh();
                    setTimeout(refresh, 5000);
                };
        
                callback();
        
                const betsTopic = `${userId}:Bets`;
                const walletTopic = `${userId}:Wallet`;
        
                window.addEventListener('online', callback);
                websocketV1.subscribe(betsTopic, callback);
                websocketV1.subscribe(walletTopic, callback);
        
                return (): void => {
                    window.removeEventListener('online', callback);
                    websocketV1.unsubscribe(betsTopic, callback);
                    websocketV1.unsubscribe(walletTopic, callback);
                };
            }
        );
    }

    public get list(): AccountAllBetsDataModelType | null {
        return this.data.data;
    }
}
