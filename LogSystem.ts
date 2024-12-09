// @ts-ignore   https://github.com/fullstack-build/tslog/issues/267
import {Logger} from 'tslog';
import {EnvReader} from "./EnvReader";
import {CustomLoggerGenerator, GetLoggerFunctionType, LoggerType} from "./LoggerType";
import {assert, Equals} from "tsafe";

export {LoggerType, CustomLoggerGenerator};

function wrapLogger(logger: Logger<any>): LoggerType {
    return new LoggerType(logger);
}

let loggerRoot: LoggerType;

function getLoggerRootInstance() {
    if (!loggerRoot) {
        loggerRoot = wrapLogger(new CustomLoggerGenerator({
            name: "root",
            minLevel: EnvReader.get('LogSystemMiniLogLevel', 1),
            prettyLogTimeZone: 'local',
            hideLogPositionForProduction: EnvReader.getBool('LogSystemForProduction', false),
        }));
    }
    return loggerRoot;
}

const loggerCache: Map<string, LoggerType[]> = new Map();

export function getLogger(name?: string, parentLogger?: LoggerType): LoggerType {
    if (!name) {
        return getLoggerRootInstance();
    }
    if (name.includes(':')) {
        const names = name.split(':');
        let lastLevel = parentLogger;
        for (const n of names) {
            lastLevel = getLogger(n, lastLevel);
        }
        if (lastLevel) {
            return lastLevel;
        }
    }
    if (loggerCache.has(name)) {
        if (!parentLogger) {
            const c = loggerCache.get(name)!;
            if (c.length >= 1) {
                return c[0];
            }
        } else {
            // check if parentLogger is the same as the parent of the cached logger
            const cachedLoggerList = loggerCache.get(name)!;
            if (parentLogger.realLogger.settings.name) {
                for (const l of cachedLoggerList) {
                    if (l.realLogger.settings.name && l.realLogger.settings.parentNames?.includes(parentLogger.realLogger.settings.name)) {
                        return l;
                    }
                }
            } else {
                // create new one
                const logger = wrapLogger((parentLogger ?? getLoggerRootInstance()).realLogger.getSubLogger({name: name}));
                cachedLoggerList.push(logger);
                loggerCache.set(name, cachedLoggerList);
                return logger;
            }
        }
    }
    const logger = wrapLogger((parentLogger ?? getLoggerRootInstance()).realLogger.getSubLogger({name: name}));
    loggerCache.set(name, [logger]);
    return logger;
}

assert<Equals<typeof getLogger, GetLoggerFunctionType>>();

export function debugLoggerCache() {
    console.log(Array.from(loggerCache.keys()));
}
