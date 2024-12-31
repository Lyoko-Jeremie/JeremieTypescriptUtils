// import {CustomIterableIterator} from "./CustomIterableIterator";
import {CustomMapIterator} from "./CustomMapIterator";

export abstract class CustomReadonlyMapHelper<K, V> implements ReadonlyMap<K, V> {

    abstract get size(): number;

    abstract get(key: K): V | undefined;

    abstract has(key: K): boolean;

    abstract entries(): ReturnType<ReadonlyMap<K, V>['entries']>;

    [Symbol.iterator](): ReturnType<ReadonlyMap<K, V>['entries']> {
        return this.entries();
    }

    forEach(callback: (value: V, key: K, map: CustomReadonlyMapHelper<K, V>) => void, thisArg?: any): void {
        for (const nn of this.entries()) {
            callback(this.get(nn[0])!, nn[0], this);
        }
    }

    keys()/*: ReturnType<ReadonlyMap<K, V>['keys']>*/ {
        return new CustomMapIterator<K, typeof this, [K, V][]>(
            this,
            (index, p, ito) => {
                return {
                    done: index >= this.size,
                    value: ito.cache[index]?.[0],
                };
            },
            Array.from(this.entries()),
        );
    }

    values()/*: ReturnType<ReadonlyMap<K, V>['values']>*/ {
        return new CustomMapIterator<V, typeof this, [K, V][]>(
            this,
            (index, p, ito) => {
                return {
                    done: index >= this.size,
                    value: ito.cache[index]?.[1],
                };
            },
            Array.from(this.entries()),
        );
    }

}
