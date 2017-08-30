/**
 * Created by tushar.mathur on 05/10/16.
 */

import {IObserver} from './Observer'
import {IScheduler} from './Scheduler'
import {ISubscription} from './Subscription'

export type SubscriberFunctionReturnType = ISubscription | void | (() => void)

export interface ISubscriberFunction<T> {
  (observer: IObserver<T>, scheduler: IScheduler): SubscriberFunctionReturnType
}
