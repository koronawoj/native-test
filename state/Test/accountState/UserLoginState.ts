import { MobxValue } from '../utils/MobxValue';
import { getJwtFromRawCookie } from 'src/appState/lib/getJwtFromRawCookie';
import jwt from 'jsonwebtoken';
import { action, computed, observable } from 'mobx';

import { buildValidator } from '../utils/buildValidator';
import * as t from 'io-ts';
import moment from 'moment';

class ConnectWrapperTimer {
    public connect(self: MobxValue<number>): NodeJS.Timeout {
        const timer  = setInterval((): void => {
            const currentTimeDate = new Date();

            self.setValue(currentTimeDate.getTime());
        }, 1000);
        return timer;
    }

    public dispose(timer: NodeJS.Timeout): void {
        clearInterval(timer);
    }
}

const currentTime: MobxValue<number> = MobxValue.create({
    initValue: 0,
    connect: new ConnectWrapperTimer(),
});

const JwtDataIO = t.interface({
    sub: t.string,
    nbf: t.number,
    sc: t.string
});

export type JwtDataType = t.TypeOf<typeof JwtDataIO>;

const decodeJwtData = buildValidator('JwtDataIO', JwtDataIO, true);

const getToken = (): string | null => {

    // for CI it;s error, but we need it for build image ind docker
    // tslint:disable-next-line: strict-type-predicates
    if (typeof document !== 'undefined') {
        return getJwtFromRawCookie(document.cookie);
    }

    return null;
};

class ConnectWrapper {
    public connect(cookie: MobxValue<string | null>): NodeJS.Timeout {
        const timer = setInterval(() => {
            cookie.setValue(getToken());
        }, 1000);

        return timer;
    }

    public dispose(timer: NodeJS.Timeout): void {
        clearInterval(timer);
    }
}

export class UserLoginState {
    @observable public isNewCustomer: boolean = false;

    private readonly cookie: MobxValue<string | null>;

    public constructor() {
        this.cookie = MobxValue.create({
            initValue: getToken(),
            connect: new ConnectWrapper()
        });
    }

    @action public setNewCustomer = (): void => {
        this.isNewCustomer = true;
    }

    @computed.struct public get userId(): number | null {
        const cookieEncoded = this.cookie.getValue();
        if (cookieEncoded !== null) {
            const data = jwt.decode(cookieEncoded);
            const decodedData = decodeJwtData(data);

            if (decodedData instanceof Error) {
                console.error(decodedData);
                return null;
            }

            if (decodedData.sub === '') {
                return null;
            }

            const subNum = parseInt(decodedData.sub, 10);

            if (isNaN(subNum)) {
                console.error('userId NaN');
                return null;
            }

            return subNum;
        }

        return null;
    }

    @computed.struct public get userIpCountry(): string | null {
        const decodedData = this.decodedJwtData;
        if (decodedData instanceof Error) {
            console.error(decodedData);
            return null;
        }

        if (decodedData === null || decodedData.sc === '') {
            return null;
        }

        return decodedData.sc;
    }

    @computed.struct public get isAuthorized(): boolean {
        return this.userId !== null;
    }


    @computed.struct public get decodedJwtData(): JwtDataType | null {
        const cookieEncoded = this.cookie.getValue();
        if (cookieEncoded !== null) {
            const data = jwt.decode(cookieEncoded);
            const decodedData = decodeJwtData(data);

            if (decodedData instanceof Error) {
                console.error(decodedData);
                return null;
            }

            return decodedData;
        }

        return null;
    }

    @computed.struct public get loggedTime(): number | null {

        if (this.decodedJwtData !== null) {
            return this.decodedJwtData.nbf * 1000;
        }
        return null;
    }

    @computed public get loggedCounter(): string {
        if (this.loggedTime !== null) {
            const diffMs = Math.floor((currentTime.getValue() - this.loggedTime) / 1000);
            const duration = moment.duration(diffMs, 'seconds');
            const seconds = duration.seconds();
            const minutes = duration.minutes();
            const hours = duration.hours();

            let displayTime = '';

            if (hours > 0) {
                displayTime = `${hours}h `;
            }
            if (minutes > 0) {
                displayTime = `${displayTime}${minutes}m `;
            }
            if (seconds > 0) {
                displayTime = `${displayTime}${seconds}s `;
            }

            return displayTime;
        }
        return '0s';
    }
}
