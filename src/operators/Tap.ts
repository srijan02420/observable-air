/**
 * Created by tushar.mathur on 02/10/16.
 */

import {Observable} from '../types/core/IObservable'
import {Observer} from '../types/core/IObserver'
import {Subscription} from '../types/core/ISubscription'
import {IScheduler} from '../types/IScheduler'
import {Curry} from '../lib/Curry'

export type TTapper<T> = (value: T) => void
export type TSource<T> = Observable<T>
export type TResult<T> = Observable<T>

export class TapObserver<T> implements Observer<T> {
  constructor (private tapper: TTapper<T>, private observer: Observer<T>) {

  }

  next (val: T): void {
    this.tapper(val)
    this.observer.next(val)
  }

  error (err: Error): void {
    this.observer.error(err)
  }

  complete (): void {
    this.observer.complete()
  }

}

export class TapObservable<T> implements TResult<T> {
  constructor (private tapper: TTapper<T>, private source: TSource<T>) {

  }

  subscribe (observer: Observer<T>, scheduler: IScheduler): Subscription {
    return this.source.subscribe(new TapObserver(this.tapper, observer), scheduler)
  }
}

export const tap = Curry(function (tapper: {(f: any): void}, source: Observable < any >) {
    return new TapObservable(tapper, source)
  }
) as Function &
  {<T> (mapper: TTapper<T>, source: TSource<T>): TResult<T>} &
  {<T> (mapper: TTapper<T>): {(source: TSource<T>): TResult<T>}}

