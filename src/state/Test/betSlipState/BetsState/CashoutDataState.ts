import { AccountState } from 'src/appState/accountState/AccountState';
import { autorun, computed } from 'mobx';
import { MobxMapAutoNew } from '@twoupdigital/mobx-utils/libjs/MobxMapAutoNew';
import { apiCommon } from 'src/api/ApiCommon';
import { AccountCashOutErrorModelType, CashOutMainDataModelType } from 'src/api/config/betting/cashOutsDataDecode';
import { MobxValue } from '@twoupdigital/mobx-utils/libjs/MobxValue';
import { WebsocketV1 } from 'src/appState/websocketV1/WebsocketV1';
import { AccountAllBetsDataModelType, SingleBetResultModelType } from 'src/api/config/accounts/accountAllBetsDataDecode';
import { ApiResponseWrapper } from 'src/utils-mobx/ApiResponseWrapper';

export interface AllMarketsIdAndEventsIdType {
    markets: Array<number>,
    events: Array<string>,
} 

//type MobxValueCashoutData = MobxValue<Resource<CashOutMainDataModelType | AccountCashOutErrorModelType>>;

class SubscriptionItemConnect {
    public constructor(
        private readonly socket: WebsocketV1,
        private readonly socketId: string,
        private readonly refresh: () => void
    ) {}

    public refreshCallback = (): void => {
        console.info(`Refresh z ${this.socketId}`);
        this.refresh();
    }

    public connect(): void {
        this.socket.subscribe(this.socketId, this.refreshCallback);
    }

    public dispose(): void {
        this.socket.unsubscribe(this.socketId, this.refreshCallback);
    }
}

class SubscriptionItem {
    private sub: MobxValue<undefined>;

    public constructor(
        private readonly socket: WebsocketV1,
        id: string,
        triggerSocketUpdate: () => void,
    ) {
        this.sub = MobxValue.create({
            initValue: undefined,
            connect: new SubscriptionItemConnect(this.socket, id, triggerSocketUpdate),
        });
    }

    public subscribe(): void {
        return this.sub.getValue();     //subscription to mobx
    }
}

const toSocketId = <K extends string | number>(type: 'event' | 'market', id: K): string => {
    if (type === 'event') {
        return `*:Event:${id.toString()}`;
    }

    return `*:Market:${id.toString()}`;
};

class SubscriptionList<K extends string | number> {
    private readonly data: MobxMapAutoNew<K, SubscriptionItem>;

    public constructor(socket: WebsocketV1, type: 'event' | 'market', triggerSocketUpdate: () => void) {
        this.data = new MobxMapAutoNew((id: K) => {
            return new SubscriptionItem(socket, toSocketId(type, id), triggerSocketUpdate);
        });
    }

    public subscribe(id: K): void {
        this.data.get(id).subscribe();
    }
}

export class CashoutDataState {
    private readonly data: ApiResponseWrapper<CashOutMainDataModelType | AccountCashOutErrorModelType | null>;

    public constructor(
        private readonly accountState: AccountState,
        socket: WebsocketV1, 
    ) {
        this.data = new ApiResponseWrapper(
            'CashoutData',
            null,
            async (): Promise<CashOutMainDataModelType | AccountCashOutErrorModelType> => {
                const resp = await apiCommon.cashOutsData.run({
                    betsIds: this.getBetsIdsForCashOut
                });
                return resp;
            },
            (refresh) => {
                const events = new SubscriptionList(socket, 'event', refresh);
                const markets = new SubscriptionList(socket, 'market', refresh);

                const dispose = autorun(() => {
                    const all = this.allMarketsIdAndEventsId;
        
                    for (const eventId of all.events) {
                        events.subscribe(eventId);
                    }
        
                    for (const marketId of all.markets) {
                        markets.subscribe(marketId);
                    }
        
                    refresh();
                });

                window.addEventListener('online', refresh);

                return (): void => {
                    dispose();
                    window.removeEventListener('online', refresh);
                };
            }
        );
    }


    @computed private get allBetsResource(): AccountAllBetsDataModelType | null {
        if (this.accountState.account !== null) {
            return this.accountState.account.allBets.list;
        }
        return null;
    }

    @computed private  get betsList(): Array<SingleBetResultModelType> {
        if (this.allBetsResource !== null) {
            return this.allBetsResource.results;
        }
        return [];
    }


    @computed private  get getBetsIdsForCashOut(): Array<number> {
        const bets = this.betsList.filter(bet => bet.transaction.tags?.freebetCredits.length === 0 && (bet.status === 'open' || bet.status === 'parked'));
        return bets.map(elem => elem.id);
    }

    @computed private  get betsListMap(): Map<number, SingleBetResultModelType> {
        const betsListMap: Map<number, SingleBetResultModelType> = new Map();

        for (const bet of this.betsList) {
            betsListMap.set(bet.id, bet);
        }

        return betsListMap;
    }

    private getBetById = (id: number): SingleBetResultModelType | null => {
        const bet = this.betsListMap.get(id);
        return bet ?? null;
    }

    @computed.struct private get allMarketsIdAndEventsId(): AllMarketsIdAndEventsIdType {
        const markets: Array<number> = [];
        const events: Array<string> = [];

        for (const betId of this.getBetsIdsForCashOut) {
            const bet = this.getBetById(betId);

            if (bet !== null) {
                for (const leg of bet.legs) {
                    const marketId = leg.market?.id ?? null;
                    if (marketId !== null) {
                        markets.push(marketId);
                    }

                    const eventId = leg.event?.id ?? null;
                    if (eventId !== null) {
                        events.push(eventId);
                    }
                }
            }
        }

        return {
            markets,
            events
        };
    }

    public get(): CashOutMainDataModelType | AccountCashOutErrorModelType | null {
        return this.data.data;
    }
}
