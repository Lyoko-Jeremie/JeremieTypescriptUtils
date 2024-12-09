import bluebird from 'bluebird';
import {getLogger, LoggerType} from "./LogSystem";

const console = getLogger('BluebirdWithResolvers');

type ResolveFunctionType<T> = Parameters<ConstructorParameters<typeof bluebird<T>>[0]>[0];
type RejectFunctionType<T> = Parameters<ConstructorParameters<typeof bluebird<T>>[0]>[0];

export class BluebirdWithResolvers<T> implements PromiseWithResolvers<T> {
    static withResolvers<T>(logger?: LoggerType) {
        return new BluebirdWithResolvers<T>();
    }

    protected resolveFunction!: ResolveFunctionType<T>;
    protected rejectFunction!: RejectFunctionType<T>;
    protected _promise: bluebird<T>;

    constructor(
        protected logger?: LoggerType,
    ) {
        if (!logger) {
            this.logger = console;
        }
        this._promise = new bluebird<T>((resolve, reject) => {
            this.resolveFunction = resolve;
            this.rejectFunction = reject;
        });
    }

    get promiseBluebird(): bluebird<T> {
        return this._promise;
    }

    get promise(): Promise<T> {
        return this._promise;
    }

    reject(reason: any): void {
        if (this._promise.isFulfilled()) {
            console.warn('BluebirdWithResolvers.reject: promise is already fulfilled');
            return;
        }
        this.rejectFunction(reason);
    }

    resolve(value: PromiseLike<T> | T): void {
        if (this._promise.isFulfilled()) {
            console.warn('BluebirdWithResolvers.resolve: promise is already fulfilled');
            return;
        }
        this.resolveFunction(value);
    }


}
