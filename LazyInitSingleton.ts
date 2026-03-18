/**
 * 一个通用的延迟初始化单例类。
 * 此类确保某个类型的实例仅在首次访问时创建。
 * 它还提供了管理相关数据和在需要时销毁实例的机制。
 *
 * @template T - 单例实例的类型。
 * @template I - 内部数据对象的类型（默认为空对象）。
 */
export class LazyInitSingleton<T, I extends Record<string, any> = Record<string, any>> {

    /**
     * 与单例实例关联的内部数据。
     * 可用于存储附加信息或状态。
     */
    protected innerData: Partial<I> = {};

    /**
     * @param factory - 一个函数，用于创建单例实例。
     *                  它接收innerData，可以将后续访问需要的临时数据放在innerData中。
     * @param destroyData - 一个可选函数，用于在销毁实例时清理factory使用的innerData。
     */
    constructor(
        protected factory: (innerData: Partial<I>) => T,
        protected destroyData?: (data: Partial<I>) => any,
    ) {
    }

    /**
     * 静态工厂方法，通过 factory 参数的类型标注自动推导 I 的类型，
     * 避免在使用处手动标注类型参数，也无需额外的占位参数。
     *
     * 用法示例：
     * ```ts
     * const config = LazyInitSingleton.create(
     *   (innerData: { data?: { ballSize: number } }) => {
     *     innerData.data = { ballSize: 0.2 };
     *     return innerData.data!;
     *   },
     *   (innerData) => { innerData.data = undefined; },
     * );
     * ```
     * TypeScript 从 factory 参数的类型标注推导 I，destroyData 的参数类型自动跟随。
     *
     * @template T - 单例实例的类型（由 factory 返回值自动推导）。
     * @template I - 内部数据对象的类型（由 factory 参数的类型标注自动推导）。
     * @param factory - 创建单例实例的工厂函数，其参数需标注类型以触发推导。
     * @param destroyData - 可选的销毁函数。
     */
    static create<T, I extends Record<string, any>>(
        factory: (innerData: Partial<I>) => T,
        destroyData?: (data: Partial<I>) => any,
    ): LazyInitSingleton<T, I> {
        return new LazyInitSingleton<T, I>(factory, destroyData);
    }

    /**
     * 延迟初始化的单例实例。
     */
    private _instance?: T;

    /**
     * 获取单例实例，如果尚未创建，则创建它。
     */
    get instance(): T {
        if (!this._instance) {
            this._instance = this.factory(this.innerData);
        }
        return this._instance;
    }

    /**
     * 检查单例实例是否已初始化。
     */
    get isInitialized(): boolean {
        return !!this._instance;
    }

    /**
     * 获取单例实例（`instance` 的别名）。
     */
    get data(): T {
        return this.instance;
    }

    /**
     * 获取单例实例（`instance` 的别名）。
     */
    get value(): T {
        return this.instance;
    }

    /**
     * 获取单例实例（`instance` 的别名）。
     */
    get() {
        return this.instance;
    }

    /**
     * 销毁单例实例，并在提供销毁函数时清理内部数据。
     */
    destroy() {
        if (this._instance) {
            if (this.destroyData) {
                this.destroyData(this.innerData);
            }
            this._instance = undefined;
        }
    }
}
