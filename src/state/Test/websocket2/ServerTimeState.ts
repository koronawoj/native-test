import moment, { Moment } from 'moment';
import { MobxValue } from '../utils/MobxValue';
import { computed } from 'mobx';

const TIME_REFRESH = 2000;
//const TIME_REFRESH = 60000;

class ConnectWrapper {
    public connect(self: MobxValue<Moment>): NodeJS.Timeout {
        self.setValue(moment().utc());

        const timer = setInterval(() => {
            self.setValue(moment().utc());
        }, TIME_REFRESH);

        return timer;
    }

    public dispose(timer: NodeJS.Timeout): void {
        clearInterval(timer);
    }
}

const currentTime: MobxValue<Moment> = MobxValue.create({
    initValue: moment().utc(),
    connect: new ConnectWrapper()
});

const getCurrent = (): Moment => {
    return currentTime.getValue().clone();
};

interface ServerTimeRangeType {
    readonly from: number,
    readonly to: number
}

export class ServerTimeRange {
    public readonly get: () => ServerTimeRangeType;

    public constructor(get: () => {from: number, to: number}) {
        this.get = get;
    }

    @computed private get range(): ServerTimeRangeType {
        return this.get();
    }

    @computed private get from(): number {
        return this.range.from;
    }

    @computed private get to(): number {
        return this.range.to;
    }

    public matchMs(timeUnixMsSeconds: number): boolean {
        return this.from <= timeUnixMsSeconds && timeUnixMsSeconds <= this.to;
    }
}

const getMilisecond = (time: Moment): number => time.unix() * 1000;

export class ServerTimeState {
    
    public readonly searchFrom: () => number;
    public readonly inPlay: ServerTimeRange;
    public readonly startedAndFinished: ServerTimeRange;
    public readonly nextOff: ServerTimeRange;
    public readonly upcoming: ServerTimeRange;
    public readonly today: ServerTimeRange;
    public readonly tomorrow: ServerTimeRange;
    public readonly weekend: ServerTimeRange;
    public readonly currentWeek: ServerTimeRange;
    public readonly nextWeek: ServerTimeRange;

    public readonly fromNowToNext24h: ServerTimeRange;
    public readonly fromNowToNextWeek: ServerTimeRange;

    public constructor() {
        this.searchFrom = (): number => getCurrent().subtract(6, 'days').unix();

        // case 'in-play':
        //     startTime.from = moment().utc().subtract(6, 'days').toISOString();
        //     startTime.to = moment().utc().toISOString();
        this.inPlay = new ServerTimeRange((): ServerTimeRangeType => ({
            from: getMilisecond(getCurrent().subtract(6, 'days')),
            to: getMilisecond(getCurrent()),
        }));

        this.startedAndFinished = new ServerTimeRange((): ServerTimeRangeType => ({
            from: getMilisecond(getCurrent().subtract(1, 'year')),
            to: getMilisecond(getCurrent()),
        }));


        // case 'next-off':
        //     const startFrom = moment().utc().startOf('day').subtract(moment().utcOffset(), 'minutes');
        //     startTime.from = startFrom.toISOString();
        //     startTime.to = startFrom.add(48, 'hour').toISOString();
        this.nextOff = new ServerTimeRange((): ServerTimeRangeType => {
            const startFrom = getCurrent().startOf('day');

            return ({
                from: getMilisecond(startFrom),
                to: getMilisecond(startFrom.clone().add(48, 'hour')),
            });
        });


        // case 'upcoming':
        //     startTime.from = moment().utc().toISOString();
        //     startTime.to = moment().utc().add(1, 'year').add(1, 'day').format('YYYY-MM-DD');
        this.upcoming = new ServerTimeRange((): ServerTimeRangeType => ({
            from: getMilisecond(getCurrent()),
            to: getMilisecond(getCurrent().add(1, 'year').add(1, 'day'))
        }));


        // case 'today':
        //     startTime.from = moment().utc().format('YYYY-MM-DD');
        //     startTime.to = moment().utc().add(1, 'day').format('YYYY-MM-DD');
        this.today = new ServerTimeRange((): ServerTimeRangeType => ({
            from: getMilisecond(getCurrent().startOf('day')),
            to: getMilisecond(getCurrent().endOf('day'))
        }));

        // case 'tomorrow':
        //     startTime.from = moment().utc().add(1, 'day').format('YYYY-MM-DD');
        //     startTime.to = moment().utc().add(2, 'day').format('YYYY-MM-DD');
        this.tomorrow = new ServerTimeRange((): ServerTimeRangeType => ({
            from: getMilisecond(getCurrent().add(1, 'day').startOf('day')),
            to: getMilisecond(getCurrent().add(1, 'day').endOf('day'))
        }));

        // case 'weekend':
        //     startTime.from = moment().utc().endOf('isoWeek').subtract(2, 'days').format('YYYY-MM-DD');
        //     startTime.to = moment().utc().endOf('isoWeek').add(1, 'day').format('YYYY-MM-DD');
        this.weekend = new ServerTimeRange((): ServerTimeRangeType => ({
            from: getMilisecond(getCurrent().endOf('isoWeek').subtract(2, 'days')),
            to: getMilisecond(getCurrent().endOf('isoWeek')),
        }));


        // case 'current-week':
        //     startTime.from = moment().utc().startOf('isoWeek').format('YYYY-MM-DD');
        //     startTime.to = moment().utc().endOf('isoWeek').add(1, 'day').format('YYYY-MM-DD');
        this.currentWeek = new ServerTimeRange((): ServerTimeRangeType => ({
            from: getMilisecond(getCurrent().startOf('isoWeek')),
            to: getMilisecond(getCurrent().endOf('isoWeek')),
        }));

    
        // case 'next-week':
        //     startTime.from = moment().utc().add(1, 'week').startOf('isoWeek').format('YYYY-MM-DD');
        //     startTime.to = moment().utc().add(1, 'week').endOf('isoWeek').add(1, 'day').format('YYYY-MM-DD');
        this.nextWeek = new ServerTimeRange((): ServerTimeRangeType => ({
            from: getMilisecond(getCurrent().add(1, 'week').startOf('isoWeek')),
            to: getMilisecond(getCurrent().add(1, 'week').endOf('isoWeek')),
        }));

        this.fromNowToNext24h = new ServerTimeRange((): ServerTimeRangeType => ({
            from: getMilisecond(getCurrent()),
            to: getMilisecond(getCurrent().add(24, 'hour'))
        }));

        this.fromNowToNextWeek = new ServerTimeRange((): ServerTimeRangeType => ({
            from: getMilisecond(getCurrent()),
            to: getMilisecond(getCurrent().add(1, 'week'))
        }));
    }

}
