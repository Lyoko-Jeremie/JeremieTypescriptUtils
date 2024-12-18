export abstract class CustomReadonlyMapHelper<K, V> implements ReadonlyMap<K, V> {

    abstract get size(): number;

    abstract get(key: K): V | undefined;

    abstract has(key: K): boolean;

    abstract entries(): ReturnType<ReadonlyMap<K, V>['entries']>;

    [Symbol.iterator]() {
        return this.entries();
    }

    forEach(callback: (value: V, key: K, map: ReadonlyMap<K, V>) => void, thisArg?: any): void {
        for (const nn of this.entries()) {
            callback(nn[1], nn[0], this);
        }
    }

    keys(): ReturnType<ReadonlyMap<K, V>['keys']> {
        return this.entries().map(T => T[0]);
    }

    values(): ReturnType<ReadonlyMap<K, V>['values']> {
        return this.entries().map(T => T[1]);
    }

}

// ================ Example ================

class A extends CustomReadonlyMapHelper<string, number> {
    data: { k: string, v: number }[] = [];

    entries(): ReturnType<ReadonlyMap<string, number>["entries"]> {
        return this.data.entries().map((n) => [n[1].k, n[1].v]);
    }

    get(key: string): number | undefined {
        return this.data.find(({k}) => k === key)?.v;
    }

    has(key: string): boolean {
        return !!this.data.find(({k}) => k === key);
    }

    get size(): number {
        return this.data.length;
    }

}

class B extends CustomReadonlyMapHelper<string, number> {
    data: Set<{ k: string, v: number }> = new Set();

    entries(): ReturnType<ReadonlyMap<string, number>["entries"]> {
        return this.data.entries().map((n) => [n[1].k, n[1].v]);
    }

    get(key: string): number | undefined {
        return this.data.values().find(({k}) => k === key)?.v;
    }

    has(key: string): boolean {
        return !!this.data.values().find(({k}) => k === key);
    }

    get size(): number {
        return this.data.size;
    }

}

class C extends CustomReadonlyMapHelper<string, number> {
    data: Map<string, { k: string, v: number }> = new Map();

    entries(): ReturnType<ReadonlyMap<string, number>["entries"]> {
        return this.data.entries().map((n) => [n[1].k, n[1].v]);
    }

    get(key: string): number | undefined {
        return this.data.get(key)?.v;
    }

    has(key: string): boolean {
        return this.data.has(key);
    }

    get size(): number {
        return this.data.size;
    }

}
