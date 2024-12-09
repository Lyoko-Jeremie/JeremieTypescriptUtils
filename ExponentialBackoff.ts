export class ExponentialBackoff {

    // 指数退避算法
    // https://cloud.google.com/memorystore/docs/redis/exponential-backoff?hl=zh-cn
    protected backoff_retry_times: number = 1;

    public last_time_interval: number = 1000;

    // reset retry times to 1 , when success
    public resetRetryTimes() {
        this.backoff_retry_times = 1;
    }

    // get next time interval
    // call this to get the time interval , when failed OR start send
    // F(next_time_interval) = last_time_interval * 2 + random_number_milliseconds
    public get exponentialBackoffTime() {
        // min(((2^n)+random_number_milliseconds), maximum_backoff)
        const t = Math.min(
            this.last_time_interval * Math.pow(2, this.backoff_retry_times) +
            Math.random() * this.random_number_milliseconds,
            this.maximum_backoff_milliseconds,
        );
        this.backoff_retry_times += 1;
        this.last_time_interval = t;
        return t;
    }

    // check if reach max retry times
    public isReachMaxRetryTimes() {
        return this.backoff_retry_times > this.max_retry_times
    }

    constructor(
        public max_retry_times: number = Number.MAX_SAFE_INTEGER,
        protected maximum_backoff_milliseconds: number = 32000,
        protected random_number_milliseconds: number = 1000,
    ) {
    }

}
