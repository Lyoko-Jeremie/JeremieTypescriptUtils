export interface ConsoleLogLike {

    readonly trace: typeof console.trace;
    readonly debug: typeof console.debug;
    readonly info: typeof console.info;
    readonly log: typeof console.log;
    readonly warn: typeof console.warn;
    readonly error: typeof console.error;

    readonly clear: typeof console.clear;

}
