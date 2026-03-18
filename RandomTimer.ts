export type RandomTimerCallbackFunction = () => void;

export class RandomTimer {
  private callback: RandomTimerCallbackFunction;
  private minDelay: number;
  private maxDelay: number;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private isRunning: boolean = false;

  /**
   * @param callback 每次延迟结束后需要执行的回调函数
   * @param minDelay 最小延迟时间 (毫秒)
   * @param maxDelay 最大延迟时间 (毫秒)
   */
  constructor(callback: RandomTimerCallbackFunction, minDelay: number, maxDelay: number) {
    if (minDelay < 0 || maxDelay < minDelay) {
      throw new Error('无效的延迟参数：minDelay 必须大于等于 0，且 maxDelay 必须大于等于 minDelay。');
    }
    this.callback = callback;
    this.minDelay = minDelay;
    this.maxDelay = maxDelay;
  }

  /**
   * 启动随机延迟调用
   * @param executeImmediately 是否在启动时立即执行一次回调 (默认为 false)
   */
  public start(executeImmediately: boolean = false): void {
    if (this.isRunning) {
      console.warn('RandomTimer 已经在运行中。');
      return;
    }

    this.isRunning = true;

    if (executeImmediately) {
      this.callback();
    }

    this.scheduleNext();
  }

  /**
   * 停止调用并清除待执行的定时器
   */
  public stop(): void {
    this.isRunning = false;
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * 获取当前是否正在运行
   */
  public get isActive(): boolean {
    return this.isRunning;
  }

  /**
   * 调度下一次执行
   */
  private scheduleNext(): void {
    if (!this.isRunning) {
      return;
    }

    const delay = this.getRandomDelay();

    this.timeoutId = setTimeout(() => {
      this.callback();
      // 在回调执行完毕后，递归调度下一次任务
      this.scheduleNext();
    }, delay);
  }

  /**
   * 生成 minDelay 到 maxDelay 之间的随机整数
   */
  private getRandomDelay(): number {
    return Math.floor(Math.random() * (this.maxDelay - this.minDelay + 1)) + this.minDelay;
  }
}
