import { assertNever } from '../../utils/assertNever';
import { ResourceMap, VBase } from './ResourceMap';
//import { PingPongManager } from './PingPongManager';
import { SocketWrapper } from './common/SocketWrapper';
import { createMessageSubscriptions, MessageSubscriptionsType } from './common/MessageToServer';
import { MessageToBrowserType } from './common/MessageToBrowser';
import { timeout } from '../../utils/timeout';
import { createSocketWrapper } from './createSocketWrapper';
import { runInAction } from 'mobx';
import { SubscriptionResourceIdType } from './common/subscriptionId';
import { EventsCollectionQueryType, EventListGroupType } from '../modelsApi/EventsCollectionQuery';
import { CompetitionModel } from '../models/CompetitionModel';
import { CompetitionModelType } from '../modelsApi/Competition';
import { BoxModel } from '../common/BoxModel';
import { SportModelType } from '../modelsApi/Sport';
import { MarketModel } from '../models/MarketModel';
import { MarketModelType, SelectionModelType } from '../modelsApi/Market';
import { EventModelType } from '../modelsApi/Event';
import { EventModel } from '../models/EventModel';
import { EventMarketItemType } from '../modelsApi/EventMarkets';
import { SelectionModel } from '../models/SelectionModel/SelectionModel';
import { Result } from '../../utils/Result';
import { EventMarketsModel } from '../models/EventMarketsModel';
import { EventsCollectionQueryModel } from '../models/EventsCollectionQueryModel';
import { SportModel } from '../models/SportModel/SportModel';
import { RabMarketType } from '../modelsApi/RabMarket';
import { RabMarketsModel } from '../models/RabMarketsModel';

const TIMEOUT_RETRY = 2000;

export type SignalIdFnType<K> = (id: K) => void;


interface ResourceMapCommonType {
    activeEntries(): Array<SubscriptionResourceIdType>,
    isObserved(): boolean,
}

export type BoxModelSelectionType = BoxModel<number, SelectionModelType, SelectionModelType, SelectionModel>;
export type BoxModelSportType = BoxModel<string, unknown, SportModelType, SportModel>;
export type BoxModelCompetitionType = BoxModel<number, unknown, CompetitionModelType, CompetitionModel>;
export type BoxModelMarketType = BoxModel<number, unknown, MarketModelType, MarketModel>;
export type BoxModelEventType = BoxModel<number, unknown, EventModelType, EventModel>;
export type BoxModelEventMarketsType = BoxModel<number, unknown, Array<EventMarketItemType>, EventMarketsModel>;
export type BoxModelQueryType = BoxModel<string, unknown, EventListGroupType, EventsCollectionQueryModel>;
export type BoxModelRabMarketsType = BoxModel<string, unknown, Array<RabMarketType>, RabMarketsModel>;

export interface CreateBoxType {
    sport: (id: string, onConnect: SignalIdFnType<BoxModelSportType>, onDisconnect: SignalIdFnType<BoxModelSportType>) => BoxModelSportType,
    competition: (id: number, onConnect: SignalIdFnType<BoxModelCompetitionType>, onDisconnect: SignalIdFnType<BoxModelCompetitionType>) => BoxModelCompetitionType,
    market: (id: number, onConnect: SignalIdFnType<BoxModelMarketType>, onDisconnect: SignalIdFnType<BoxModelMarketType>) => BoxModelMarketType,
    event: (id: number, onConnect: SignalIdFnType<BoxModelEventType>, onDisconnect: SignalIdFnType<BoxModelEventType>) => BoxModelEventType,
    eventMarkets: (id: number, onConnect: SignalIdFnType<BoxModelEventMarketsType>, onDisconnect: SignalIdFnType<BoxModelEventMarketsType>) => BoxModelEventMarketsType,
    query: (query: string, onConnect: SignalIdFnType<BoxModelQueryType>, onDisconnect: SignalIdFnType<BoxModelQueryType>) => BoxModelQueryType,
    getRabMarkets: (platformId: string, onConnect: SignalIdFnType<BoxModelRabMarketsType>, onDisconnect: SignalIdFnType<BoxModelRabMarketsType>) => BoxModelRabMarketsType,
}

interface CreateResourceMapType<K, V extends VBase<K>> {
    create: (id: K, onConnect: SignalIdFnType<V>, onDisconnect: SignalIdFnType<V>) => V,
    createResourceId: (id: K) => SubscriptionResourceIdType,
}

export class SocketManager {
    private readonly isBrowser: boolean;
    //private readonly pingPong: PingPongManager = new PingPongManager();
    private readonly host: string | null;
    private readonly debounceTime: number;

    private readonly resourceSport: ResourceMap<string, BoxModelSportType>;                             //TODO
    private readonly resourceCompetition: ResourceMap<number, BoxModelCompetitionType>;                 //TODO - unknown
    private readonly resourceMarket: ResourceMap<number, BoxModelMarketType>;                           //TODO - unknown
    private readonly resourceEvent: ResourceMap<number, BoxModelEventType>;                             //TODO
    private readonly resourceEventMarkets: ResourceMap<number, BoxModelEventMarketsType>;               //TODO
    private readonly resourceQueryEvents: ResourceMap<string, BoxModelQueryType>;                       //TODO
    private readonly resourceRabMarkets: ResourceMap<string, BoxModelRabMarketsType>;                   //TODO

    private socket: SocketWrapper | null = null;

    public constructor(isBrowser: boolean, host: string | null, debounceTime: number, createBox: CreateBoxType) {
        this.isBrowser = isBrowser;
        this.host = host;
        this.debounceTime = debounceTime;

        this.resourceSport = this.createResourceMap({
            create: createBox.sport,
            createResourceId: (id: string): SubscriptionResourceIdType => ({
                type: 'ModelSport',
                id: id
            })
        });

        this.resourceCompetition = this.createResourceMap({
            create: createBox.competition,
            createResourceId: (id: number): SubscriptionResourceIdType => ({
                type: 'ModelCompetition',
                id: id
            })
        });

        this.resourceMarket = this.createResourceMap({
            create: createBox.market,
            createResourceId: (id: number): SubscriptionResourceIdType => ({
                type: 'ModelMarket',
                id: id
            })
        });

        this.resourceEvent = this.createResourceMap({
            create: createBox.event,
            createResourceId: (id: number): SubscriptionResourceIdType => ({
                type: 'ModelEvent',
                id: id
            })
        });

        this.resourceEventMarkets = this.createResourceMap({
            create: createBox.eventMarkets,
            createResourceId: (id: number): SubscriptionResourceIdType => ({
                type: 'ModelEventMarkets',
                id: id
            })
        });

        this.resourceQueryEvents = this.createResourceMap({
            create: createBox.query,
            createResourceId: (query: string): SubscriptionResourceIdType => ({
                type: 'QueryEvents',
                query: query
            })
        });

        this.resourceRabMarkets = this.createResourceMap({
            create: createBox.getRabMarkets,
            createResourceId: (platformId: string): SubscriptionResourceIdType => ({
                type: 'ModelRabMarkets',
                platformId
            })
        });

        this.runConnectionLoop();
    }

    private createResourceMap<K, V extends VBase<K>>(params: CreateResourceMapType<K, V>): ResourceMap<K, V> {
        const onConnect = (boxModel: V): void => {
            this.onConnect(params.createResourceId(boxModel.getKey()));
        };

        const onDisconnect = (boxModel: V): void => {
            this.onDisconnect(params.createResourceId(boxModel.getKey()));
        };

        return new ResourceMap({
            createResourceId: params.createResourceId,
            onCreate: (id: K): V => {
                return params.create(
                    id,
                    onConnect,
                    onDisconnect
                );
            }
        });
    }

    private onConnect = (resourceId: SubscriptionResourceIdType): void => {
        if (this.socket !== null) {
            this.socket.send(
                createMessageSubscriptions([{
                    id: resourceId,
                    active: true
                }])
            );
        }
    };

    private onDisconnect = (resourceId: SubscriptionResourceIdType): void => {
        if (this.socket !== null) {
            this.socket.send(
                createMessageSubscriptions([{
                    id: resourceId,
                    active: false
                }])
            );
        }
    };

    private allResourceMap(): Array<ResourceMapCommonType> {
        return [
            this.resourceSport,
            this.resourceCompetition,
            this.resourceMarket,
            this.resourceEvent,
            this.resourceEventMarkets,
            this.resourceQueryEvents,
            this.resourceRabMarkets,
        ];
    }

    private async wait(): Promise<void> {
        console.info('Retry network connection - pause');
        await timeout(TIMEOUT_RETRY);
        console.info('Retry network connection');
    }

    public createSubscriptionValueForAll(): MessageSubscriptionsType {
        const pathList: Array<{id: SubscriptionResourceIdType, active: boolean}> = [];

        for (const resourceItem of this.allResourceMap()) {
            for (const itemId of resourceItem.activeEntries()) {
                pathList.push({
                    id: itemId,
                    active: true,
                });
            }
        }

        return createMessageSubscriptions(pathList);
    }

    private async runConnectionLoop(): Promise<void> {
        if (this.isBrowser === false) {
            return;
        }
        const host = this.host;

        if (host === null) {
            return;
        }

        while (true) {
            const socketWrapper = await createSocketWrapper(host, this.debounceTime, this.onMessages);

            if (socketWrapper === null) {
                await this.wait();
                continue;
            }

            socketWrapper.socket.send(
                this.createSubscriptionValueForAll()
            );

            this.socket = socketWrapper.socket;
            await socketWrapper.done;
            this.socket = null;
            await this.wait();
        }
    }

    private onMessages = (socket: SocketWrapper, messageList: Array<MessageToBrowserType>): void => {
        runInAction(() => {
            //console.time('Socket update');
            for (const message of messageList) {
                this.processMessage(socket, message);
            }
            //console.timeEnd('Socket update');
        });
    }

    private processMessage(_socket: SocketWrapper, message: MessageToBrowserType): void {
        if (message.type === 'Pong') {
            return;
        }

        if (message.type === 'Update') {
            const item = message.item;

            if (item.type === 'ModelSport') {
                this.resourceSport.getOrCreate(item.id).setRawData(item.data);
                return;
            }

            if (item.type === 'ModelCompetition') {
                this.resourceCompetition.getOrCreate(item.id).setRawData(item.data);
                return;
            }

            if (item.type === 'ModelMarket') {
                this.resourceMarket.getOrCreate(item.id).setRawData(item.data);
                return;
            }

            if (item.type === 'ModelEvent') {
                this.resourceEvent.getOrCreate(item.id).setRawData(item.event);
                return;
            }

            if (item.type === 'ModelEventMarkets') {
                this.resourceEventMarkets.getOrCreate(item.id).setRawData(item.data);
                return;
            }

            if (item.type === 'QueryEvents') {
                this.resourceQueryEvents.getOrCreate(item.query).setRawData(item.data.group);
                return;
            }

            if (item.type === 'ModelRabMarkets') {
                this.resourceRabMarkets.getOrCreate(item.platformId).setRawData(item.rabMarkets);
                return;
            }

            return assertNever('Update item', item);
        }

        if (message.type === 'Message') {
            console.info('Info from socket: ', message.text);
            return;
        }

        return assertNever('processMessageFromServer', message);
    }

    public resetWebsocket(): void {
        if (this.socket !== null) {
            this.socket.rawSocket.close();
        }
    }

    public getSport(sportId: string): Result<SportModel | null> {
        return this.resourceSport.getOrCreate(sportId).getResult();
    }

    public getCompetition(competition: number): Result<CompetitionModel | null> {
        return this.resourceCompetition.getOrCreate(competition).getResult();
    }

    public getMarket(marketId: number): Result<MarketModel | null> {
        return this.resourceMarket.getOrCreate(marketId).getResult();
    }

    public getEvent(eventId: number): Result<EventModel | null> {
        return this.resourceEvent.getOrCreate(eventId).getResult();
    }

    public getEventMarkets(eventId: number): Result<EventMarketsModel | null> {
        return this.resourceEventMarkets.getOrCreate(eventId).getResult();
    }

    public getEventQuery(query: EventsCollectionQueryType): Result<EventsCollectionQueryModel | null> {
        const queryString = JSON.stringify(query);
        return this.resourceQueryEvents.getOrCreate(queryString).getResult();
    }

    public getRabMarkets(platformId: string): Result<RabMarketsModel | null> {
        return this.resourceRabMarkets.getOrCreate(platformId).getResult();
    }
}
