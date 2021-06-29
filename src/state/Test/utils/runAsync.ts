export const runAsync = (runPromise: () => Promise<void>) => {
    setTimeout(() => {
        runPromise().catch((err) => {
            console.error(err);
        });
    }, 0);
};
