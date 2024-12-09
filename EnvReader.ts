import {get, isNil, isNumber, isString, parseInt, isBoolean} from 'lodash';
import {assert, Equals, is} from "tsafe";
import numeral from 'numeral';
import {EnvConfigStorage} from "./EnvConfigStorage";

export const EnvKey = [
    'EnvConfigFilePath',

    'AuthLoginUrl',
    'AuthLoginUserName',
    'AuthLoginPassword',
    'AuthLoginFlushTimeMs',

    'RemoteProtocolUserId',
    'RemoteProtocolUserRealName',
    'RemoteProtocolOrgName',

    'RedisDatabaseTableDefaultUrl',

    'RedisDatabaseTable_airplaneControlState_url',
    'RedisDatabaseTable_airplaneControlState_databaseName',

    'RedisDatabaseTable_airplaneBaseState_url',
    'RedisDatabaseTable_airplaneBaseState_databaseName',

    'RedisDatabaseTable_airplaneVideoInfo_url',
    'RedisDatabaseTable_airplaneVideoInfo_databaseName',

    'RedisDatabaseTable_djiHmsStateChange_url',
    'RedisDatabaseTable_djiHmsStateChange_databaseName',

    'RedisDatabaseTable_th3dRegisterAirplaneInfoCache_url',
    'RedisDatabaseTable_th3dRegisterAirplaneInfoCache_databaseName',

    'RedisDatabaseTable_takeOffApprovalInfo_url',
    'RedisDatabaseTable_takeOffApprovalInfo_databaseName',

    'RedisDatabaseTable_airplaneWayLineInfo_url',
    'RedisDatabaseTable_airplaneWayLineInfo_databaseName',

    'RedisDatabaseTable_airplaneLiveDeviceStatus_url',
    'RedisDatabaseTable_airplaneLiveDeviceStatus_databaseName',

    'RedisDatabaseTable_commandSafeLogger_url',
    'RedisDatabaseTable_commandSafeLogger_databaseName',

    'RedisDatabaseTable_BackupSaveData_url',
    'RedisDatabaseTable_BackupSaveData_databaseName',

    'DjiMqttUrl',
    'DjiMqttUsername',
    'DjiMqttPassword',
    'DjiMqttAuth',
    'DjiMqttFakeSend',
    'DjiMqttLogLevel',
    'DjiMqttLogLevelSend',

    'RemoteMqttUrl',
    'RemoteMqttTopicUserName',
    'RemoteMqttUsername',
    'RemoteMqttPassword',
    'RemoteMqttAuth',
    'RemoteMqttFakeSend',
    'RemoteMqttLogLevel',
    'RemoteMqttLogLevelSend',
    'DisableMiddleServerRemote',

    'AirplaneInitInfoDatabaseHost',
    'AirplaneInitInfoDatabasePort',
    'AirplaneInitInfoDatabaseUserName',
    'AirplaneInitInfoDatabasePassword',
    'AirplaneInitInfoDatabaseDatabaseName',

    'MariaDBDjiHmsStateChangeDatabaseHost',
    'MariaDBDjiHmsStateChangeDatabasePort',
    'MariaDBDjiHmsStateChangeDatabaseUserName',
    'MariaDBDjiHmsStateChangeDatabasePassword',
    'MariaDBDjiHmsStateChangeDatabaseDatabaseName',

    'WayLineDecoderServerUrl',

    'LogSystemMiniLogLevel',
    'LogSystemDisableOsdCheckOkLog',
    'LogSystemForProduction',

    'DefaultGpsPointLat',
    'DefaultGpsPointLng',

    'UrlAvailableOnlineVideoDeviceInfo',    // 'http://127.0.0.1:9000/manage/api/v1/live/capacity'
    'UrlAnyAvailableVideoDeviceInfo',    // 'http://127.0.0.1:9000/manage/api/v1/live/capacities'
    'UrlGetLiveStreamRtmpUrl',              // 'http://127.0.0.1:9000/manage/api/v1/livestream/rtmp'
    'UrlLiveStreamRtmpUrl',                 // 'rtmp://192.168.16.159/live/livestream/'
    'UrlVideoStreamStartRequest',           // 'http://127.0.0.1:9000/manage/api/v1/live/streams/start'
    'UrlVideoStreamStopRequest',           // 'http://127.0.0.1:9000/manage/api/v1/live/streams/stop'
    'UrlLiveStreamRtmpUrlBackup',                 // 'rtmp://192.168.66.27/live/livestream/'

    'HttpFrontEndpointServerListenPort',    // '12566'
    'HttpFrontEndpointServerListenHostname', // '::' / '0.0.0.0'

    'HttpRemoteControlServerListenPort',    // '12568'
    'HttpRemoteControlServerListenHostname', // '::' / '0.0.0.0'

    'DebugLogHttpFrontEndpoint',

    'FlyTaskControlUrl',                    // 'http://172.25.219.118:8080'
    'FlyTaskControlPolyfillUrl',                    // 'http://172.25.219.118:9000'

    'HmsJsonFilePath',

    'RemoteParams_uavInteractName',
    'RemoteParams_uavInteractTel',

    'StorageDir',       // './db'

    'EnableJwtMiddleware',
    'JwtMiddleware_TOKEN_SECRET',   // TOKEN_SECRET=SingflyCloudServer
    'JwtMiddleware_ALGORITHM',      // ISSUER=Singfly
    'JwtMiddleware_ISSUER',         // SUBJECT=CloudServer
    'JwtMiddleware_SUBJECT',        // EXPIRES_IN=86400
    'JwtMiddleware_EXPIRES_IN',     // ALGORITHM=HS256

    'CommandSafeLoggerStorageTime',     // 60 * 60 * 24 * 365 * 3,   // 3 years
    'DjiHmsStateChangeStorageTime',     // 60 * 60 * 24,   // 1 day
] as const;

export type EnvKeyT = typeof EnvKey[number];

enum EnvReadTypeEnum {
    GET = 'GET',
    GET_DEFAULT_NUMBER = 'GET_DEFAULT_NUMBER',
    GET_DOUBLE = 'GET_DOUBLE',
    GET_BOOL = 'GET_BOOL',
}

type EnvCacheValueType = string | number | boolean | undefined;

interface EnvCacheValueInfo<T extends EnvCacheValueType> {
    key: EnvKeyT;
    type: EnvReadTypeEnum;
    value: T;
}

export interface EnvCacheReadAllResultItem {
    key: EnvKeyT,
    values: {
        type: EnvReadTypeEnum,
        value: EnvCacheValueInfo<any>,
    }[],
}

class EnvCache {
    protected cache: Map<EnvKeyT, Map<EnvReadTypeEnum, EnvCacheValueInfo<any>>> = new Map();

    save(key: EnvKeyT, type: EnvReadTypeEnum.GET_BOOL, value: boolean | undefined): void;
    save(key: EnvKeyT, type: EnvReadTypeEnum.GET_DOUBLE, value: number | undefined): void;
    save(key: EnvKeyT, type: EnvReadTypeEnum.GET_DEFAULT_NUMBER, value: number | undefined): void;
    save(key: EnvKeyT, type: EnvReadTypeEnum.GET, value: string | undefined): void;
    save(key: EnvKeyT, type: EnvReadTypeEnum, value: EnvCacheValueType): void {
        if (!this.cache.has(key)) {
            this.cache.set(key, new Map());
        }
        this.cache.get(key)!.set(type, {
            key: key,
            type: type,
            value: value,
        });
    }

    /**
     * @return undefined if not exists, otherwise return the real value
     */
    read(key: EnvKeyT, type: EnvReadTypeEnum.GET_BOOL): EnvCacheValueInfo<boolean> | undefined;
    read(key: EnvKeyT, type: EnvReadTypeEnum.GET_DOUBLE): EnvCacheValueInfo<number> | undefined;
    read(key: EnvKeyT, type: EnvReadTypeEnum.GET_DEFAULT_NUMBER): EnvCacheValueInfo<number> | undefined;
    read(key: EnvKeyT, type: EnvReadTypeEnum.GET): EnvCacheValueInfo<string> | undefined;
    read(key: EnvKeyT, type: EnvReadTypeEnum): EnvCacheValueInfo<any> | undefined {
        if (this.cache.has(key)) {
            return this.cache.get(key)!.get(type);
        }
        return undefined;
    }

    readAll(): EnvCacheReadAllResultItem[] {
        const r: EnvCacheReadAllResultItem[] = [];
        for (const [key, value] of this.cache.entries()) {
            const values: {
                type: EnvReadTypeEnum,
                value: EnvCacheValueInfo<any>,
            }[] = [];
            for (const [type, info] of value.entries()) {
                values.push({
                    type: type,
                    value: info,
                });
            }
            r.push({
                key: key,
                values: values,
            });
        }
        return r;
    }

}

const isTruthy = (T: string | undefined) => !isNil(T) && T !== '' && T !== '0' && !!T && (isString(T) && T.toLowerCase() !== 'false');

export interface EnvCheckModeResultType {
    K: string;
    env?: string;
    conf?: string;
    default?: string;
}

export class EnvReaderManager {

    envCheckModeResult: undefined | EnvCheckModeResultType[] = undefined;

    envCache = new EnvCache();

    envConfigStorage: EnvConfigStorage;

    constructor(
        public configFilePath: string,
    ) {
        this.envConfigStorage = new EnvConfigStorage(
            configFilePath,
        );
        this.envCache.save('EnvConfigFilePath', EnvReadTypeEnum.GET, configFilePath);
    }

    // get env(): typeof process['env'] {
    //     return process.env;
    // }

    envStorageGet<T>(key: string, defaultValue?: T): string | undefined | T ;
    envStorageGet(key: string, defaultValue?: string): string | undefined {
        const enV: string | undefined = get(process.env, key, defaultValue);
        const enC: string | undefined = this.envConfigStorage.envStorageGet(key, defaultValue);
        if (this.envCheckModeResult) {
            this.envCheckModeResult.push({
                K: key,
                env: enV,
                conf: enC,
                default: defaultValue,
            });
        }
        return enV ?? enC ?? defaultValue;
    }

    get(key: EnvKeyT): string | undefined ;
    get<T>(key: EnvKeyT, defaultValue: T): T ;
    get(key: EnvKeyT, defaultValue: string): string ;
    get<T extends any>(key: EnvKeyT, defaultValue?: string | T): string | undefined | T {
        if (isNumber(defaultValue)) {
            assert(is<number>(defaultValue));
            const c = this.envCache.read(key, EnvReadTypeEnum.GET_DEFAULT_NUMBER);
            if (c !== undefined) {
                return (c.value ?? defaultValue) as T;
            }
            const v: string | undefined = this.envStorageGet(key);
            if (v === undefined) {
                this.envCache.save(key, EnvReadTypeEnum.GET_DEFAULT_NUMBER, undefined);
                return defaultValue;
            } else {
                const R = parseInt(v);
                this.envCache.save(key, EnvReadTypeEnum.GET_DEFAULT_NUMBER, R);
                return R as T;
            }
        }
        const c = this.envCache.read(key, EnvReadTypeEnum.GET);
        if (c !== undefined) {
            return c.value ?? defaultValue;
        }
        const v = this.envStorageGet(key, defaultValue);
        if (isString(v) && v !== '') {
            if (isBoolean(defaultValue)) {
                const R = isTruthy(v);
                this.envCache.save(key, EnvReadTypeEnum.GET_BOOL, R);
                return R as T;
            }
            this.envCache.save(key, EnvReadTypeEnum.GET, v);
            return v;
        } else {
            this.envCache.save(key, EnvReadTypeEnum.GET, undefined);
            return defaultValue;
        }
    }

    getDouble(key: EnvKeyT, defaultValue: number): number {
        const c = this.envCache.read(key, EnvReadTypeEnum.GET_DOUBLE);
        if (c !== undefined) {
            return c.value ?? defaultValue;
        }
        const v = this.envStorageGet(key, undefined);
        if (isString(v) && v !== '') {
            const R = numeral(v).value() ?? defaultValue;
            this.envCache.save(key, EnvReadTypeEnum.GET_DOUBLE, R);
            return R;
        } else {
            this.envCache.save(key, EnvReadTypeEnum.GET_DOUBLE, undefined);
            return defaultValue;
        }
    }

    getBool(key: EnvKeyT, defaultValue: boolean): boolean {
        const c = this.envCache.read(key, EnvReadTypeEnum.GET_BOOL);
        if (c !== undefined) {
            return c.value ?? defaultValue;
        }
        const v = this.envStorageGet(key, undefined);
        if (isString(v) && v !== '') {
            const R = isTruthy(v);
            this.envCache.save(key, EnvReadTypeEnum.GET_BOOL, R);
            return R;
        } else {
            this.envCache.save(key, EnvReadTypeEnum.GET_BOOL, undefined);
            return defaultValue;
        }
    }

}

export let EnvReader: EnvReaderManager;

export function initEnvReader(
    configFilePath: string,
) {
    EnvReader = new EnvReaderManager(
        configFilePath,
    );
    EnvReader.envConfigStorage.loadFileSync();
}

// console.log('EnvReader RemoteMqttFakeSend', EnvReader.getBool('RemoteMqttFakeSend', false));
// console.log('EnvReader DjiMqttFakeSend', EnvReader.getBool('DjiMqttFakeSend', false));
