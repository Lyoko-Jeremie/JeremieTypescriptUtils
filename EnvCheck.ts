import {EnvKey, EnvKeyT, EnvReader} from "./EnvReader";
import {getLogger} from "./LogSystem";
import {removeUndefinedDeep} from "./DeepCleanJsonObject";

const console = getLogger('EnvCheck');

export function envCheck() {
    // enable check mode
    EnvReader.envCheckModeResult = [];

    const R = EnvKey.reduce((acc, key) => {
        acc[key] = EnvReader.get(key);
        return acc;
    }, {} as { [key in EnvKeyT]: string | undefined });

    const checkResult = EnvReader.envCheckModeResult;

    // disable check mode
    EnvReader.envCheckModeResult = undefined;

    console.log(R);
    console.log(removeUndefinedDeep(checkResult));

    const r = {
        env: R,
        check: checkResult,
    };
    lastEnvCheckResult = r;
    return r;
}

export let lastEnvCheckResult: ReturnType<typeof envCheck> | undefined;
