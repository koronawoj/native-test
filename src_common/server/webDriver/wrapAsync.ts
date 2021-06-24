import express from 'express';

export type HandlerType = (req: express.Request, res: express.Response) => void;

export type HandlerAsyncType = (req: express.Request, res: express.Response) => Promise<void>;

export const createErrorMessageFromNodejs = (message: string): string => {
    return JSON.stringify({
        type: 'error from nodejs',
        message: message
    });
};

const errorToString = (err: unknown): string => {
    try {
        // tslint:disable-next-line
        if (typeof err === 'object' && err !== null && typeof err.toString === 'function') {
            const message = err.toString();

            // tslint:disable-next-line
            if (typeof message === 'string') {
                return `wrapAsync:-> ${message}`;
            }
        }
        
        return 'wrapAsync -> errorToString: conversion error 1';
    } catch (err) {
        return 'wrapAsync -> errorToString: conversion error 2';
    }
};

export const wrapAsync = (handler: HandlerAsyncType): HandlerType => {
    return (req: express.Request, res: express.Response): void => {
        handler(req, res).catch((err) => {
            console.error(err);
            const body = createErrorMessageFromNodejs(errorToString(err));
            res.status(500).send(body);
        });
    };
};
