export const assertNever = (label: string, value: never): never => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw Error(`Incorrect assertNever ${label} ${value}`);
};
