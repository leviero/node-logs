Object.defineProperty(global, '__stack', {
  get: function() {
    var orig = Error.prepareStackTrace
    Error.prepareStackTrace = function(_, stack) {
      return stack
    }
    var err = new Error()
    Error.captureStackTrace(err, arguments.callee)
    var stack = err.stack
    Error.prepareStackTrace = orig
    return stack
  }
})

Object.defineProperty(global, '__line', {
  get: function() {
    return __stack[1].getLineNumber()
  }
})

Object.defineProperty(global, '__function', {
  get: function() {
    return __stack[1].getFunctionName()
  }
})

const getCircularReplacer = () => {
  const seen = new WeakSet()
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return
      }
      seen.add(value)
    }
    return value
  }
}

function _log({ msg, level, context, backtrace }) {
  console.log(
    JSON.stringify({
      message: msg,
      src_line: __stack[2].getLineNumber(),
      src_file: this.filename,
      context:
        typeof context === 'string'
          ? { data: context }
          : {
              ...context,
              request: context.request
                ? JSON.stringify(context.request, getCircularReplacer())
                : undefined,
              response: context.response
                ? JSON.stringify(context.response, getCircularReplacer())
                : undefined
            },
      level,
      time: new Date().toISOString(),
      backtrace
    })
  )
}

function makeMethod(name) {
  return function(msg = __stack[1].getFunctionName(), context = {}, backtrace) {
    _log.call(this, { level: name, msg, context, backtrace })
  }
}

const METHODS = ['info', 'debug', 'warning', 'error', 'fatal']

class Logger {
  constructor(filename = __stack[1].getFileName()) {
    this.filename = filename
    METHODS.map(method => (Logger.prototype[method] = makeMethod(method)))
  }
}

module.exports = Logger
