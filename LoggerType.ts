// @ts-ignore   https://github.com/fullstack-build/tslog/issues/267
import {Logger, BaseLogger, ISettingsParam, ILogObjMeta} from 'tslog';
// export class CustomLoggerGenerator<LogObj> extends BaseLogger<LogObj> {
//     constructor(LevelId: number, LevelName: string, settings?: ISettingsParam<LogObj>, logObj?: LogObj) {
//         super(settings, logObj, 5);
//         this.LevelName = LevelName;
//         this.LevelId = LevelId;
//     }
//
//     readonly LevelName: string;
//     readonly LevelId: number;
//
//     /**
//      * Logs a _CUSTOM_ message.
//      * @param args  - Multiple log attributes that should be logged.
//      * @return LogObject with meta property, when log level is >= minLevel
//      */
//     public custom(...args: unknown[]): LogObj & ILogObjMeta | undefined {
//         return super.log(this.LevelId, this.LevelName, ...args);
//     }
//
// }

export class CustomLoggerGenerator<LogObj extends any> extends Logger<LogObj> {

    public customLog(...args: unknown[]): LogObj & ILogObjMeta | undefined {
        return this.log(3, 'LOG', ...args);
    }

}

// https://github.com/fullstack-build/tslog/blob/c4e6eadc85ed79763792fb8a3049e2d50c88b2dc/src/index.ts#L12
// https://github.com/fullstack-build/tslog/blob/c4e6eadc85ed79763792fb8a3049e2d50c88b2dc/src/index.ts#L63
function CustomLogLevelLogFunction<LogObj>(this: BaseLogger<LogObj>, LevelId: number, LevelName: string, ...args: unknown[]): LogObj & ILogObjMeta | undefined {
    return this.log(LevelId, LevelName, ...args);
}

export class LoggerType {
    constructor(
        logger: Logger<any>
    ) {
        this.realLogger = logger;
        this.silly = logger.silly.bind(logger);
        this.trace = logger.trace.bind(logger);
        this.debug = logger.debug.bind(logger);
        this.info = logger.info.bind(logger);
        // https://github.com/fullstack-build/tslog/blob/c4e6eadc85ed79763792fb8a3049e2d50c88b2dc/src/index.ts#L64
        // levelId same as logger.info
        // log file line info cannot work by issue https://github.com/fullstack-build/tslog/issues/282
        // this.log = CustomLogLevelLogFunction.bind(logger, 3, 'log');
        // this.log = (logger as CustomLoggerGenerator<any>).customLog.bind(logger);
        this.log = logger.info.bind(logger);
        this.warn = logger.warn.bind(logger);
        this.error = logger.fatal.bind(logger);
    }

    readonly realLogger: Logger<any>;

    readonly silly: Logger<any>['silly'];
    readonly trace: Logger<any>['trace'];
    readonly debug: Logger<any>['debug'];
    readonly info: Logger<any>['info'];
    readonly log: Logger<any>['info'];
    readonly warn: Logger<any>['warn'];
    readonly error: Logger<any>['fatal'];

    readonly clear = console.clear.bind(console);
}

export type GetLoggerFunctionType = (name?: string, parentLogger?: LoggerType) => LoggerType;
