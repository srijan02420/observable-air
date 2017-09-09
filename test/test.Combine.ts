/**
 * Created by tushar on 26/02/17.
 */

import * as assert from 'assert'
import {combine} from '../src/operators/Combine'
import {EVENT} from '../src/testing/Events'
import {marble} from '../src/testing/Marble'
import {TestScheduler} from '../src/testing/TestScheduler'

test('combine', () => {
  const SH = TestScheduler.of()

  const {results} = SH.start(() => {
    return combine((a, b, c) => a + b + c, [
      SH.Hot(marble('a-b-c-d|')),
      SH.Hot(marble('-p-q-r-s|')),
      SH.Hot(marble('---x-y-z--|'))
    ])
  })
  assert.deepEqual(results, [
    EVENT.next(230, 'bqx'),
    EVENT.next(240, 'cqx'),
    EVENT.next(250, 'crx'),
    EVENT.next(250, 'cry'),
    EVENT.next(260, 'dry'),
    EVENT.next(270, 'dsy'),
    EVENT.next(270, 'dsz'),
    EVENT.complete(300)
  ])
})
