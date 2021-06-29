/** Essentials */
export type Primitive = string | number | boolean | undefined | null;

/** Like Partial but recursive */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Array<infer U>
      ? Array<DeepPartial<U>>
      : T[P] extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : DeepPartial<T[P]>
};

/** Like Required but recursive */
export type DeepRequired<T> = T extends Primitive
    ? NonNullable<T>
    : T extends any[]
    ? DeepRequiredArray<NonNullable<T[number]>>
    : T extends {}
    ? { [K in keyof T]-?: DeepRequired<NonNullable<T[K]>> }
    : T;

export interface DeepRequiredArray<T> extends Array<DeepRequired<T>> {}

/** Like Readonly but recursive */
export type DeepReadonly<T> = T extends Primitive
    ? T
    : T extends (any[] | ReadonlyArray<any>)
    ? DeepReadonlyArray<T[number]>
    : T extends Function
    ? T
    : DeepReadonlyObject<T>;

export type DeepReadonlyObject<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> };

export interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}


/*
https://github.com/krzkaczor/ts-essentials/blob/master/lib/types.ts
https://gist.github.com/brieb/48698aca8565310db4453b9ff875dee3
*/