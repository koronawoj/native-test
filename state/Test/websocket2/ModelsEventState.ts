import { MobxMapAutoNew } from '../utils/MobxMapAutoNew';
import { EventModel } from '../websocket2/models/EventModel';
import { MarketModel } from '../websocket2/models/MarketModel';
import { SelectionModel, PriceType } from '../websocket2/models/SelectionModel/SelectionModel';
import { ModelBoxContext } from '../websocket2/common/ModelBoxContext';
import { CompetitionModel } from '../websocket2/models/CompetitionModel';
import { ServerTimeState } from '../websocket2/ServerTimeState';
import { EventMarketItemType, decodeEventMarkets } from '../websocket2/modelsApi/EventMarkets';
import { SportModelType, decodeSportModelFromSocket } from '../websocket2/modelsApi/Sport';
import { EventsCollectionQueryType, decodeEventListGroup, EventListGroupType } from '../websocket2/modelsApi/EventsCollectionQuery';
import { BoxModel } from '../websocket2/common/BoxModel';
import { CompetitionModelType, decodeCompetitionModel } from '../websocket2/modelsApi/Competition';
import { createResultReady, Result, createResultLoading } from '../utils/Result';
import { decodeEventModel, EventModelType, decodeEventBasicModel, EventBasicModelType } from '../websocket2/modelsApi/Event';
import { decodeMarketResponse, MarketApiModelType, SelectionModelType, MarketModelType } from '../websocket2/modelsApi/Market';
import { SelectionAnimation } from '../websocket2/models/SelectionModel/SelectionAnimation';
import { SocketManager, CreateBoxType, SignalIdFnType, BoxModelSelectionType, BoxModelSportType, BoxModelCompetitionType, BoxModelMarketType, BoxModelEventType, BoxModelEventMarketsType, BoxModelQueryType, BoxModelRabMarketsType } from '../websocket2/SocketClient/SocketManager';
import { RemoteValueContext } from '../websocket2/SocketClient/RemoteValueContext';
import { observable } from 'mobx';
import { MobxValue } from '../utils/MobxValue';
import { SportModel } from '../websocket2/models/SportModel/SportModel';
import { EventMarketsModel } from '../websocket2/models/EventMarketsModel';
import { EventsCollectionQueryModel } from '../websocket2/models/EventsCollectionQueryModel';
import { decodeArrayRabMarket, RabMarketType } from '../websocket2/modelsApi/RabMarket';
import { RabMarketsModel } from '../websocket2/models/RabMarketsModel';
import { ModelsStateSocketConfig } from './ModelsStateSocketConfig';

const TIMEOUT_ANIMATION = 900;
const DEBOUNCE_TIME = 200;

/*
    TODO
    After migrating to develop, in the next step merge this file with ModelsState.ts
    This file is left to minimize conflicts
*/

type SelectionsType = MarketApiModelType['selections'];

class SelectionModelContext {
    private readonly modelBoxContext: ModelBoxContext;
    private animation: SelectionAnimation;
    private prevPrice: PriceType | undefined

    public constructor(modelBoxContext: ModelBoxContext) {
        this.modelBoxContext = modelBoxContext;
        this.animation = new SelectionAnimation(TIMEOUT_ANIMATION);
        this.prevPrice = undefined;
    }

    public onMessage(rawData: SelectionModelType): Result<SelectionModelType | null> {
        return createResultReady(rawData);
    }

    public create(model: MobxValue<SelectionModelType>): SelectionModel {
        return new SelectionModel(this.modelBoxContext, this.animation, model);
    }

    public afterUpdate(model: SelectionModel): void {
        const newPrice = model.price;

        if (this.prevPrice !== undefined && newPrice !== undefined) {
            if (this.prevPrice.d > newPrice.d) {
                this.animation.startAnimation('down');
            } else if (this.prevPrice.d < newPrice.d) {
                this.animation.startAnimation('up');
            }
        }

        this.prevPrice = newPrice;
    }
}

class MarketModelContext {
    public constructor(
        private readonly modelBoxContext: ModelBoxContext,
        private readonly getSelectionBox: (id: number) => BoxModelSelectionType
    ) {
    }

    private transformSelections(eventId: number, marketId: number, selections: SelectionsType): Array<number> {
        return Object.values(selections).map((item) => {
            const selectionId = item.id;
            this.getSelectionBox(selectionId).setRawData({
                ...item,
                eventId,
                marketId
            });
            return selectionId;
        });
    }

    public onMessage(rawData: unknown): Result<MarketModelType> {

        const model = decodeMarketResponse(rawData);

        if (model instanceof Error) {
            console.error(model);
            return createResultLoading();
        }

        const marketId = model.id;
        const eventId = model.event.id;

        return createResultReady({
            ...model,
            eventId: eventId,
            selections: this.transformSelections(eventId, marketId, model.selections)
        });
    }

    public create(model: MobxValue<MarketModelType>): MarketModel {
        return new MarketModel(this.modelBoxContext, model);
    }
}

class EventModelContext {
    public constructor(
        private readonly modelBoxContext: ModelBoxContext,
        private readonly newEvent: (eventId: number) => void,
    ) {}

    private replaceSport(basicModel: EventBasicModelType): EventBasicModelType & { sportOriginal: string } {
        for (const [sport, subsport] of Object.entries(this.modelBoxContext.modelsStateSocketConfig.apiEventListIncludes)) {
            if (subsport.includes(basicModel.sport)) {
                return {
                    ...basicModel,
                    sport: sport,
                    sportOriginal: basicModel.sport,
                };
            }
        }

        return {
            ...basicModel,
            sportOriginal: basicModel.sport,
        };
    }

    public onMessage(inputData: unknown): Result<EventModelType | null> {
        const basicModel = decodeEventBasicModel(inputData);

        if (basicModel instanceof Error) {
            console.error(basicModel);
            return createResultLoading();
        }

        const rawData = this.replaceSport(basicModel);

        const model = decodeEventModel(rawData);

        if (model instanceof Error) {
            console.error(model);
            return createResultLoading();
        }

        // if (model === null) {
        //     return createResultReady(null);
        // }

        this.newEvent(model.id);
        return createResultReady(model);
    }

    public create(model: MobxValue<EventModelType>): EventModel {
        return new EventModel(this.modelBoxContext, model);
    }
};

class CompetitionModelContext {
    public onMessage(rawData: unknown): Result<CompetitionModelType> {
        const data = decodeCompetitionModel(rawData);

        if (data instanceof Error) {
            console.error(data);
            return createResultLoading();
        }

        return createResultReady(data);
    }
    public create(model: MobxValue<CompetitionModelType>): CompetitionModel {
        return new CompetitionModel(model);
    }
}

const createSport = (model: MobxValue<SportModelType>): SportModel => {
    return new SportModel(model);
};

const createEventMarkets = (model: MobxValue<Array<EventMarketItemType>>): EventMarketsModel => {
    return new EventMarketsModel(model);
};

const createRabMarketsModel = (model: MobxValue<Array<RabMarketType>>): RabMarketsModel => {
    return new RabMarketsModel(model);
};

class QueryModelContext {
    public constructor(private readonly modelBoxContext: ModelBoxContext) {}

    public onMessage(rawData: unknown): Result<EventListGroupType> {
        const data = decodeEventListGroup(rawData);

        if (data instanceof Error) {
            console.error(data);
            return createResultLoading();
        }

        return createResultReady(data);
    }
    public create(model: MobxValue<EventListGroupType>): EventsCollectionQueryModel {
        return new EventsCollectionQueryModel(this.modelBoxContext.serverTime, model);
    }
}

export class ModelsEventState {
    private readonly socketManager: SocketManager;

    @observable private allEventsIdList: Array<number> = [];
    private readonly selectionMap: MobxMapAutoNew<number, BoxModelSelectionType>;

    public constructor(
        isBrowser: boolean,
        modelsStateSocketConfig: ModelsStateSocketConfig,
        websocket_host_v2: string,
    ) {
        const serverTime = new ServerTimeState();

        const modelBoxContext: ModelBoxContext = {
            modelsStateSocketConfig,
            serverTime: serverTime,
            getEvent: this.getEvent,
            getEventMarkets: this.getEventMarkets,
            getMarket: this.getMarket,
            getSelection: this.getSelection,
        };

        const selectionOnConnect = (): void => {
            //...
            //TODO - raportować o błędzie w przypadku gdy zaczynamy obserwować model, który nie jest zaciągnięty. Informacja ze trzeba sie przelaczyc na inny rodzaj pobierania selectiona
        };

        const selectionOnDisconnect = (): void => {
            //...
        };

        this.selectionMap = new MobxMapAutoNew((selectionId: number): BoxModelSelectionType => {
            return BoxModel.create({
                decoder: new SelectionModelContext(modelBoxContext),
                key: selectionId,
                onConnect: selectionOnConnect,
                onDisconnect: selectionOnDisconnect
            });
        });

        const getSelectionBox = (id: number): BoxModelSelectionType => {
            return this.selectionMap.get(id);
        };

        const createBox: CreateBoxType = {
            sport: (
                sport: string,
                onConnect: SignalIdFnType<BoxModelSportType>,
                onDisconnect: SignalIdFnType<BoxModelSportType>
            ) => {
                return BoxModel.create({
                    decoder: new RemoteValueContext(
                        decodeSportModelFromSocket,
                        createSport,
                    ),
                    key: sport,
                    onConnect,
                    onDisconnect
                });
            },

            competition: (
                competition: number,
                onConnect: SignalIdFnType<BoxModelCompetitionType>,
                onDisconnect: SignalIdFnType<BoxModelCompetitionType>
            ) => {
                return BoxModel.create({
                    decoder: new CompetitionModelContext(),
                    key: competition,
                    onConnect,
                    onDisconnect
                });
            },

            market: (
                market: number,
                onConnect: SignalIdFnType<BoxModelMarketType>,
                onDisconnect: SignalIdFnType<BoxModelMarketType>
            ) => {
                return BoxModel.create({
                    decoder: new MarketModelContext(modelBoxContext, getSelectionBox),
                    key: market,
                    onConnect,
                    onDisconnect
                });
            },

            event: (
                event: number,
                onConnect: SignalIdFnType<BoxModelEventType>,
                onDisconnect: SignalIdFnType<BoxModelEventType>
            ) => {
                return BoxModel.create({
                    decoder: new EventModelContext(modelBoxContext, (id: number) => {
                        this.allEventsIdList.push(id);
                    }),
                    key: event,
                    onConnect,
                    onDisconnect
                });
            },

            eventMarkets: (
                event: number,
                onConnect: SignalIdFnType<BoxModelEventMarketsType>,
                onDisconnect: SignalIdFnType<BoxModelEventMarketsType>
            ) => {
                return BoxModel.create({
                    decoder: new RemoteValueContext(
                        decodeEventMarkets,
                        createEventMarkets
                    ),
                    key: event,
                    onConnect,
                    onDisconnect
                });
            },

            query: (
                event: string,
                onConnect: SignalIdFnType<BoxModelQueryType>,
                onDisconnect: SignalIdFnType<BoxModelQueryType>
            ) => {
                return BoxModel.create({
                    decoder: new QueryModelContext(modelBoxContext),
                    key: event,
                    onConnect,
                    onDisconnect
                });
            },

            getRabMarkets: (
                platformId: string,
                onConnect: SignalIdFnType<BoxModelRabMarketsType>,
                onDisconnect: SignalIdFnType<BoxModelRabMarketsType>
            ) => {
                return BoxModel.create({
                    decoder: new RemoteValueContext(
                        decodeArrayRabMarket,
                        createRabMarketsModel,
                    ),
                    key: platformId,
                    onConnect,
                    onDisconnect
                });
            }
        };

        this.socketManager = new SocketManager(isBrowser, websocket_host_v2, DEBOUNCE_TIME, createBox);
    }

    public get allEventsId(): Array<number> {
        return this.allEventsIdList;
    }

    public getSelectionAndLoad = (marketId: number, selectionId: number): SelectionModel | null => {
        //Important
        //Fake subscription. It must stay. This is for loading selectiona data.
        //The selection model is part of the market model.
        this.getMarket(marketId);

        //return this.selectionMap.get(selectionId).getModel();
        const resultSelection = this.selectionMap.get(selectionId).getResult();

        if (resultSelection.type === 'loading') {
            return null;
        }

        return resultSelection.value;
    }

    /**
     * @deprecated
     */
    public getSelection = (selectionId: number): SelectionModel | null => {
        const resultSelection = this.selectionMap.get(selectionId).getResult();

        if (resultSelection.type === 'loading') {
            return null;
        }

        return resultSelection.value;
    }

    public getMarketWithLoading = (id: number): MarketModel | null | 'loading' => {
        const result = this.socketManager.getMarket(id);

        if (result.type === 'loading') {
            return 'loading';
        }

        return result.value;
    }

    public getMarket = (id: number): MarketModel | null => {
        const result = this.socketManager.getMarket(id);

        if (result.type === 'loading') {
            return null;
        }

        return result.value;
    }

    /**
     * @deprecated
     */
    public getEventAndLoad = (id: number): EventModel | null => {
        return this.getEvent(id);
    }

    public getEvent = (id: number): EventModel | null => {
        const value = this.socketManager.getEvent(id);

        if (value.type === 'loading') {
            return null;
        }

        return value.value;
    }

    public getEventMarkets = (id: number): Array<EventMarketItemType> | null => {
        const remoteValue = this.socketManager.getEventMarkets(id);

        if (remoteValue.type === 'loading') {
            return null;
        }

        const model = remoteValue.value;

        if (model === null) {
            return [];
        }
        return model.getValue();
    }

    public getEventIsLoading(id: number): boolean {
        const value = this.socketManager.getEvent(id);

        if (value.type === 'loading') {
            return true;
        }

        return false;
    }

    public getCompetitionModel(id: number): CompetitionModel | null {
        const removeValue = this.socketManager.getCompetition(id);
        if (removeValue.type === 'loading') {
            return null;
        }

        return removeValue.value;
    }

    public getSport(sportId: string): SportModel | null {
        const value = this.socketManager.getSport(sportId);

        if (value.type === 'loading') {
            return null;
        }

        return value.value;
    }

    public getEventQuery(query: EventsCollectionQueryType): EventsCollectionQueryModel | null {
        const val = this.socketManager.getEventQuery(query);

        if (val.type === 'loading') {
            return null;
        }

        const value = val.value;
        return value;
    }

    public getRabMarkets(platformId: string): RabMarketsModel | null {
        const val = this.socketManager.getRabMarkets(platformId);

        if (val.type === 'loading') {
            return null;
        }

        const value = val.value;
        return value;
    }
}
