require('babel-polyfill')

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
  return JSON.stringify(
    {
      message: msg,
      src_line: __stack[2].getLineNumber(),
      src_file: this.filename,
      context,
      level,
      time: new Date().toISOString(),
      backtrace
    },
    getCircularReplacer()
  )
}

function makeMethod(name) {
  return function(msg = __stack[1].getFunctionName(), context = {}, backtrace) {
    const isValid =
      typeof msg === 'string' &&
      (typeof context === 'object' || typeof context === 'string')
    if (!isValid) {
      throw new TypeError('invalid arguments')
    } else {
      console.log(
        _log.call(this, {
          level: name,
          msg,
          context: typeof context === 'string' ? { data: context } : context,
          backtrace
        })
      )
    }
  }
}

const METHODS = ['info', 'debug', 'warning', 'error', 'fatal']

class Logger {
  constructor(filename = __stack[1].getFileName()) {
    this.filename = filename
    METHODS.map(method => (Logger.prototype[method] = makeMethod(method)))
  }
  static get _methods() {
    return METHODS
  }
  static get _log() {
    return _log
  }
}

module.exports = new Proxy(Logger, {
  apply(target, thisArg, argumentsList) {
    _log({
      msg: "[DEPRECATED]: always use 'new' for instantiation",
      level: 'warning'
    })
    return new target(argumentsList)
  }
})
