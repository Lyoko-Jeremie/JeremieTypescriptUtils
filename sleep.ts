export async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function sleepWithCancel(ms: number): [PromiseWithResolvers<any>, ReturnType<typeof setTimeout>] {
    let cancelHandle: ReturnType<typeof setTimeout>;
    const p = Promise.withResolvers();
    cancelHandle = setTimeout(p.resolve, ms);
    return [p, cancelHandle];
}
