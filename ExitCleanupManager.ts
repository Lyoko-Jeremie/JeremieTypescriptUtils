let cleanupCallbacks: Set<(() => void)> = new Set();

export function registerExitCleanup(callback: () => void) {
    cleanupCallbacks.add(callback);
}

export function unregisterExitCleanup(callback: () => void) {
    cleanupCallbacks.delete(callback);
}

function callExitCleanup(eventType: string) {
    for (const callback of cleanupCallbacks) {
        try {
            callback();
        } catch (e) {
            // ignore
            console.error(`Error in exit cleanup callback:`, e);
        }
    }
    process.exit(0);
}

;[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, callExitCleanup.bind(null, eventType));
});

