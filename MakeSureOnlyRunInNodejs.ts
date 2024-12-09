import * as childProcess from 'child_process';
import * as os from 'os';

export function createNodeOnlyFunction() {
    // 使用 Node.js 特定的类型和模块
    const cpuArchitecture: NodeJS.Architecture = os.arch() as any;

    // 使用仅在 Node.js 中存在的全局对象和属性
    if (typeof process === 'undefined' || typeof global === 'undefined') {
        throw new Error('This code can only run in a Node.js environment');
    }

    // 使用 Node.js 特定的同步 API
    const pid: number = process.pid;
    const platform: NodeJS.Platform = process.platform;

    // 包含一个 Node.js 特定的同步操作
    const cpuCores = os.cpus().length;

    return {
        getPlatformInfo: () => {
            // 使用仅在 Node.js 中可用的函数
            const execSync = childProcess.execSync;

            // 这个函数调用会在非 Node.js 环境中直接抛出错误
            const test = execSync('ping').toString();

            return {
                architecture: cpuArchitecture,
                platform: platform,
                pid: pid,
                cpuCores: cpuCores,
                test: test
            };
        }
    };
}

// 通过多层检查确保只能在 Node.js 环境中运行
export function ensureNodeEnvironment() {
    if (typeof global === 'undefined') {
        throw new Error('Global object is not defined');
    }

    if (typeof process === 'undefined' || !process.versions) {
        throw new Error('process object is not available');
    }

    if (!process.versions.node) {
        throw new Error('Not running in Node.js environment');
    }
}

// 立即调用的环境检查函数
ensureNodeEnvironment();
createNodeOnlyFunction();
