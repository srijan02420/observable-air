/**
 * Created by tushar.mathur on 27/09/16.
 */

import * as t from 'assert'
import {scan} from '../src/operators/Scan'
import {interval} from '../src/sources/Interval'
import {EVENT, EventError} from '../src/testing/Events'
import {toMarble} from '../src/testing/Marble'
import {createTestScheduler} from '../src/testing/TestScheduler'
import {ERROR_MESSAGE, thrower} from '../src/testing/Thrower'
const {error} = EVENT

describe('interval()', () => {
  it('should emit values every t ms', () => {
    const sh = createTestScheduler()
    const {results} = sh.start(
      () => scan(i => i + 1, -1, interval(10)),
      200,
      250
    )
    t.strictEqual(toMarble(results), '-0123')
  })
  it('should catch exceptions', () => {
    const sh = createTestScheduler()
    const observer = sh.Observer<void>()
    thrower(interval(100)).subscribe(observer, sh)
    sh.advanceBy(100)
    t.deepEqual(observer.results, [error(100, Error(ERROR_MESSAGE))])
    t.strictEqual(
      (observer.results[0] as EventError).value.message,
      ERROR_MESSAGE
    )
  })
})
