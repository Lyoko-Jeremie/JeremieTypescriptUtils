import {ConsoleLogLike} from "./ConsoleLogLike";

function sleep(ms: number): [PromiseWithResolvers<any>, ReturnType<typeof setTimeout>] {
    let cancelHandle: ReturnType<typeof setTimeout>;
    const p = Promise.withResolvers();
    cancelHandle = setTimeout(p.resolve, ms);
    return [p, cancelHandle];
}

// const console = getLogger('UtilTimer');

export class UtilTimer {
    protected isRunning: boolean = false;

    // can replace by subclass
    protected timerError: ((E: any) => any) = (E: any) => {
        try {
            this.console.error('UtilTimer timerError: ', E);
        } catch (e) {
            // cannot serialize E
            console.error(`UtilTimer timerError: [${E?.error || E}]`);
        }
    };

    start() {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        this.run().catch(E => this.timerError(E));
    }

    stop() {
        this.isRunning = false;
        if (this.sleepCancelHandle) {
            clearTimeout(this.sleepCancelHandle);
            this.sleepCancelHandle = undefined;
        }
    }

    protected sleepCancelHandle?: ReturnType<typeof sleep>[1];

    private async run() {
        while (this.isRunning) {
            if (!this.isRunning) {
                break;
            }
            await this.callback();
            if (!this.isRunning) {
                break;
            }
            const hh = sleep(this.timeIntervalMs);
            this.sleepCancelHandle = hh[1];
            await hh[0].promise;
            if (!this.isRunning) {
                break;
            }
        }
    }

    constructor(
        public callback: () => Promise<any>,
        public console: ConsoleLogLike,
        public timeIntervalMs: number = 1000,
    ) {
    }
}

