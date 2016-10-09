/**
 * Created by tushar.mathur on 28/09/16.
 */

import {IObservable} from '../types/core/IObservable';
import {ISubscription} from '../types/core/ISubscription';
import {IObserver} from '../types/core/IObserver';
import {IScheduler} from '../types/IScheduler';
import {DefaultScheduler} from '../scheduling/DefaultScheduler';
import {ILazySubscription} from '../types/ILazySubscription';
import {SafeExecutor} from '../lib/SafeExecutor';

const unsubscribe = function () {
}
const subscription = {unsubscribe, closed: true};

class FromRunner <T> implements ILazySubscription {
  closed: boolean;
  private schedule: ISubscription;

  constructor (private array: Array<T>, private sink: IObserver<T>, private scheduler: IScheduler) {
    this.closed = false
  }

  run () {
    this.schedule = this.scheduler.scheduleASAP(() => this.executeSafely())
    return this
  }

  executeSafely () {
    const r = SafeExecutor(() => this.execute())
    if (r.hasError()) this.sink.error(r.error)
  }

  execute () {
    var l = this.array.length;
    var sink = this.sink;
    for (var i = 0; i < l && !this.closed; ++i) {
      sink.next(this.array[i])
    }
    sink.complete()
  }

  unsubscribe (): void {
    this.schedule.unsubscribe()
    this.closed = true
  }
}

export class FromObservable<T> implements IObservable<T> {
  constructor (private array: Array<T>) {
  }

  subscribe (observer: IObserver<T>,
             scheduler: IScheduler = new DefaultScheduler()): ISubscription {

    return new FromRunner<T>(this.array, observer, scheduler).run()
  }
}

export function fromArray<T> (list: Array<T>): IObservable<T> {
  return new FromObservable(list)
}
