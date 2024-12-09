export class CustomIterableIterator<T, Parent, CacheType> implements IterableIterator<T> {
    index = 0;

    constructor(
        public parent: Parent,
        public nextF: (index: number, p: Parent, ito: CustomIterableIterator<T, Parent, CacheType>) => IteratorResult<T>,
        public cache: CacheType,
    ) {
    }

    [Symbol.iterator](): IterableIterator<T> {
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
}
