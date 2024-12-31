export class CustomMapIterator<T, Parent, CacheType> implements MapIterator<T>, IterableIterator<T> {
    index = 0;

    constructor(
        public parent: Parent,
        public nextF: (index: number, p: Parent, ito: CustomMapIterator<T, Parent, CacheType>) => IteratorResult<T>,
        public cache: CacheType,
    ) {
    }

    [Symbol.iterator](): MapIterator<T> {
        return this;
    }

    next(...args: [] | [undefined]): IteratorResult<T> {
        const r = this.nextF(
            this.index,
            this.parent,
            this,
        );
        ++this.index;
        return r;
    }

    // MapIterator 接口实现
    map<U>(fn: (value: T, index: number) => U): MapIterator<U> {
        return new CustomMapIterator<U, Parent, CacheType>(
            this.parent,
            (index, parent, ito) => {
                const result = this.nextF(index, parent, this);
                if (result.done) return result;
                return {value: fn(result.value, index), done: false};
            },
            this.cache
        );
    }

    filter(predicate: (value: T, index: number) => boolean): MapIterator<T> {
        return new CustomMapIterator<T, Parent, CacheType>(
            this.parent,
            (index, parent, ito) => {
                while (true) {
                    const result = this.nextF(index, parent, this);
                    if (result.done) return result;
                    if (predicate(result.value, index)) {
                        return result;
                    }
                    ++this.index;
                }
            },
            this.cache
        );
    }

    forEach(fn: (value: T, index: number) => void): void {
        let result = this.next();
        while (!result.done) {
            fn(result.value, this.index - 1);
            result = this.next();
        }
    }

    reduce<U>(reducer: (acc: U, value: T, index: number) => U): U;
    reduce<U>(reducer: (acc: U, value: T, index: number) => U, initialValue: U): U;
    reduce<U>(reducer: (acc: U, value: T, index: number) => U, initialValue?: U): U {
        if (initialValue === undefined) {
            let result = this.next();
            if (result.done) {
                // return undefined;
                throw new TypeError("Reduce of empty iterator with no initial value");
            }
            initialValue = result.value as any as U;
        }

        let accumulator = initialValue;
        let result = this.next();
        while (!result.done) {
            accumulator = reducer(accumulator, result.value, this.index - 1);
            result = this.next();
        }
        return accumulator;
    }

    some(predicate: (value: T, index: number) => boolean): boolean {
        let result = this.next();
        while (!result.done) {
            if (predicate(result.value, this.index - 1)) {
                return true;
            }
            result = this.next();
        }
        return false;
    }

    every(predicate: (value: T, index: number) => boolean): boolean {
        let result = this.next();
        while (!result.done) {
            if (!predicate(result.value, this.index - 1)) {
                return false;
            }
            result = this.next();
        }
        return true;
    }

    find(predicate: (value: T, index: number) => boolean): T | undefined {
        let result = this.next();
        while (!result.done) {
            if (predicate(result.value, this.index - 1)) {
                return result.value;
            }
            result = this.next();
        }
        return undefined;
    }

    findIndex(predicate: (value: T) => boolean): number {
        let index = 0;
        let result = this.next();
        while (!result.done) {
            if (predicate(result.value)) {
                return index;
            }
            index++;
            result = this.next();
        }
        return -1;
    }

    includes(searchElement: T): boolean {
        let result = this.next();
        while (!result.done) {
            if (result.value === searchElement) {
                return true;
            }
            result = this.next();
        }
        return false;
    }

    drop(count: number): MapIterator<T> {
        return new CustomMapIterator<T, Parent, CacheType>(
            this.parent,
            (index, parent, ito) => {
                // 跳过前 count 个元素
                while (this.index < count) {
                    this.next();
                }
                return this.nextF(index, parent, this);
            },
            this.cache
        );
    }

    flatMap<U>(callback: (value: T, index: number) => (Iterator<U> | Iterable<U>)): MapIterator<U> {
        let currentIterator: Iterator<U> | null = null;
        let currentIndex = 0;

        return new CustomMapIterator<U, Parent, CacheType>(
            this.parent,
            (_, parent, ito) => {
                while (true) {
                    // 如果有当前迭代器，尝试获取下一个值
                    if (currentIterator) {
                        const result = currentIterator.next();
                        if (!result.done) {
                            return result;
                        }
                        currentIterator = null;
                    }

                    // 获取下一个源值
                    const sourceResult = this.next();
                    if (sourceResult.done) {
                        return {value: undefined as any, done: true};
                    }

                    // 创建新的迭代器
                    const iterableOrIterator = callback(sourceResult.value, currentIndex++);
                    currentIterator = Symbol.iterator in iterableOrIterator
                        ? (iterableOrIterator as Iterable<U>)[Symbol.iterator]()
                        : iterableOrIterator as Iterator<U>;
                }
            },
            this.cache
        );
    }

    take(limit: number): MapIterator<T> {
        return new CustomMapIterator<T, Parent, CacheType>(
            this.parent,
            (index, parent, ito) => {
                if (index >= limit) {
                    return {value: undefined as any, done: true};
                }
                return this.nextF(index, parent, this);
            },
            this.cache
        );
    }

    toArray(): T[] {
        const result: T[] = [];
        let item = this.next();
        while (!item.done) {
            result.push(item.value);
            item = this.next();
        }
        return result;
    }

    readonly [Symbol.toStringTag]: string = 'CustomMapIterator';

    [Symbol.dispose](): void {
        this.index = 0;
        this.cache = undefined as any;
        this.parent = undefined as any;
    }

}

// // 使用示例
// const iterator = new CustomMapIterator<number, number[], null>(
//     [1, 2, 3, 4, 5],
//     (index, parent, ito) => {
//         if (index >= parent.length) {
//             return {value: undefined as any, done: true};
//         }
//         return {value: parent[index], done: false};
//     },
//     null
// );
//
// // 链式调用示例
// const result = iterator
//     .map(x => x * 2)
//     .filter(x => x > 5);
