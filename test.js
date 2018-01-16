'use strict'
const path = require('path')
const tap = require('tap')
const log = require('./index.js')()

Object.defineProperty(global, '__line', {
    get: function() {
        let __stack = (function() {
            let orig
            try {
                orig = Error.prepareStackTrace
                Error.prepareStackTrace = (_, stack) => stack
                let err = new Error
                Error.captureStackTrace(err, arguments.callee)
            } catch (err) {
                let stack = err.stack
                Error.prepareStackTrace = orig
                return stack
            }
        })()

        return __stack[2].getLineNumber()
    }
})

tap.test('get logger', function(childTest) {
    let keys = Object.keys(log)
    childTest.same(keys, ['info', 'debug', 'warning', 'error', 'fatal'])
    childTest.end()
})

tap.test('check log level', function(childTest) {
    let infoLog = log.info('INFO', {}, path.relative(process.cwd(), __filename), __line)
    let debugLog = log.debug('DEBUG', {}, path.relative(process.cwd(), __filename), __line)
    let warningLog = log.warning('WARNING', {}, path.relative(process.cwd(), __filename), __line)
    let errorLog = log.error('ERROR', {}, path.relative(process.cwd(), __filename), __line)
    let fatalLog = log.fatal('FATAL', {}, path.relative(process.cwd(), __filename), __line)
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
    const src_line = __line
    const backtrace = {}
    let errorLog = log.info(message, fields, src_file, src_line, backtrace)
    childTest.equal(errorLog.message, message)
    childTest.equal(errorLog.fields, fields)
    childTest.equal(errorLog.src_file, src_file)
    childTest.equal(errorLog.src_line, src_line)
    childTest.equal(errorLog.backtrace, backtrace)
    childTest.end()
})
