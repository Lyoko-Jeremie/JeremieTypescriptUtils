import {UtilTimer} from "./UtilTimer";
import {ExponentialBackoff} from "./ExponentialBackoff";
import {ConsoleLogLike} from "./ConsoleLogLike";

// const console = getLogger('Utils:RetrySender');

export class RetrySender extends UtilTimer {

    protected exponentialBackoff: ExponentialBackoff;

    constructor(
        console: ConsoleLogLike,
        max_retry_times: number = Number.MAX_SAFE_INTEGER,
        timeInterval: number = 1000,
    ) {
        super(async () => {
            return this.sendTaskCallbackFunction();
        }, console, timeInterval);
        this.exponentialBackoff = new ExponentialBackoff(max_retry_times);
    }

    private async sendTaskCallbackFunction() {
        if (!this.isRunning) {
            return;
        }
        this.timeIntervalMs = this.exponentialBackoff.exponentialBackoffTime;

        if (!this.waitResponse) {
            this.console.error('RetrySender.waitOk is not set');
            throw new Error('RetrySender.waitOk is not set');
            return;
        }

        const rr = this.waitResponse().catch(E => {
            this.console.error('RetrySender sendTaskCallbackFunction', E);
            return false;
        });

        if (!this.doSend) {
            this.console.error('RetrySender.doSend is not set');
            throw new Error('RetrySender.doSend is not set');
            return;
        }

        const s = await this.doSend().catch(E => {
            this.console.error(E);
            return false;
        });

        if (!s) {
            this.console.log('RetrySender send failed');
            // this.doSend = undefined;
            // this.waitResponse = undefined;
            return;
        }

        const r = await rr;
        if (r) {
            this.stop();
            this.exponentialBackoff.resetRetryTimes();
            this.timeIntervalMs = 1000;
            // this.doSend = undefined;
            // this.waitResponse = undefined;
        } else {
            // ignore, continue retry
            if (this.exponentialBackoff.isReachMaxRetryTimes()) {
                this.stop();
                this.exponentialBackoff.resetRetryTimes();
                this.timeIntervalMs = 1000;
                // this.doSend = undefined;
                // this.waitResponse = undefined;
                if (this.when_max_retry) {
                    this.when_max_retry();
                }
            }
        }
    }

    private doSend?: (() => Promise<boolean>);
    private waitResponse?: (() => Promise<boolean>);
    private when_max_retry?: (() => void);

    public async startSend(
        doSend: () => Promise<boolean>,
        waitResponse: () => Promise<boolean>,
        when_max_retry?: (() => void),
    ) {
        this.when_max_retry = when_max_retry;
        if (doSend) {
            this.doSend = doSend;
        }
        if (waitResponse) {
            this.waitResponse = waitResponse;
        }
        if (!this.doSend) {
            this.console.error('RetrySender startSend.doSend is not set');
            throw new Error('RetrySender startSend.doSend is not set');
            return;
        }
        if (!this.waitResponse) {
            this.console.error('RetrySender startSend.waitOk is not set');
            throw new Error('RetrySender startSend.waitOk is not set');
            return;
        }

        if (this.isRunning) {
            return;
        }
        this.exponentialBackoff.resetRetryTimes();
        this.timeIntervalMs = 1000;

        this.start();
    }

}
