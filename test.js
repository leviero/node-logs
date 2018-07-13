'use strict'
const path = require('path')
const tap = require('tap')
const log = require('./index.js')()

tap.test('get logger', function(childTest) {
    let keys = Object.keys(log)
    childTest.same(keys, ['info', 'debug', 'warning', 'error', 'fatal'])
    childTest.end()
})

tap.test('check log level', function(childTest) {
    let infoLog = log.info('INFO', {})
    let debugLog = log.debug('DEBUG', {})
    let warningLog = log.warning('WARNING', {})
    let errorLog = log.error('ERROR', {})
    let fatalLog = log.fatal('FATAL', {})
    childTest.equal(infoLog.level, 'info')
    childTest.equal(debugLog.level, 'debug')
    childTest.equal(warningLog.level, 'warning')
    childTest.equal(errorLog.level, 'error')
    childTest.equal(fatalLog.level, 'fatal')
    childTest.end()
})

tap.test('check log format', function(childTest) {
    const message = 'ERROR'
    const fields = {}
    const src_file = path.relative(process.cwd(), __filename)
    const backtrace = {}
    let errorLog = log.info(message, fields, backtrace, src_file, null)
    childTest.equal(errorLog.message, message)
    childTest.equal(errorLog.fields, fields)
    childTest.equal(errorLog.src_file, src_file)
    childTest.equal(errorLog.backtrace, backtrace)
    childTest.end()
})
