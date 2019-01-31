const tap = require('tap')
const Logger = require('./src/index')

tap.test('instantiation', t => {
  const log = new Logger()
  t.type(log, Logger)
  t.ok(new Logger())
  t.ok(new Logger(__filename))
  t.doesNotThrow(Logger)
  t.end()
})

tap.test('log format', t => {
  const methods = Logger._methods
  methods.map(m => {
    t.matchSnapshot(
      Logger._log({ msg: 'test', level: m, context: { a: 1, b: 2, c: '3' } }),
      m
    )
  })
  t.end()
})

tap.test('levels', t => {
  const log = new Logger()
  const methods = Logger._methods
  t.matchSnapshot(methods, 'levels')
  methods.map(m => t.type(log[m], 'function'))
  t.end()
})
