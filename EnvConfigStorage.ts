import fs from "fs";
// import {GetLoggerFunctionType, LoggerType} from "./LoggerType";
import JSON5 from 'json5';
import {isPlainObject, pickBy, isString} from 'lodash';

export class EnvConfigStorage {
    // protected _logger?: LoggerType;
    // get logger(): LoggerType {
    //     if (!this._logger) {
    //         this._logger = this.getLogger('EnvConfigStorage');
    //     }
    //     return this._logger;
    // }

    constructor(
        public configFilePath: string,
        // public getLogger: GetLoggerFunctionType,
    ) {
    }

    loadFileSync() {
        try {
            const fileString = fs.readFileSync(this.configFilePath, 'utf8');
            let data = JSON5.parse(fileString) as Record<string, string>;
            data = data as Record<string, string>;
            if (!isPlainObject(data)) {
                throw new Error('Invalid JSON5 data');
            }
            this.configData = pickBy(data, (v, k) => isString(v) && v.trim() !== '');
        } catch (e) {
            // this.logger.error('EnvConfigStorage loadFileSync Error', e);
            console.error('============================ EnvConfigStorage loadFileSync Error ============================');
            console.error(e);
            console.error('============================ EnvConfigStorage loadFileSync Error ============================');
        }
    }

    protected configData: Record<string, string> = {};

    envStorageGet<T>(key: string, defaultValue?: T): string | undefined | T ;
    envStorageGet(key: string, defaultValue?: string): string | undefined {
        return this.configData[key] ?? defaultValue;
    }
}
