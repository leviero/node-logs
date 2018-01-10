# node-logs
This project is created in order to standardize the logs format across all node-js projects used in lalamove

## Install
```
npm install node-logs
```

## Configuration
Before using this logs module, if you need to output the line number you need to define the global object in your project. You can copy the code below:
```
if (typeof __stack === 'undefined') {
    Object.defineProperty(global, '__stack', {
        get: function() {
            var orig
            try {
                orig = Error.prepareStackTrace
                Error.prepareStackTrace = function(_, stack) {
                    return stack
                }
                var err = new Error()
                Error.captureStackTrace(err, arguments.callee)
            } catch (err) {
                var stack = err.stack
                Error.prepareStackTrace = orig
                return stack
            }
        }
    })

    Object.defineProperty(global, '__line', {
        get: function() {
            return __stack[2].getLineNumber()
        }
    })
}
```

## Features

### Log format

The output of the log will be printed out to the standard output in the format below:
```
{
    "message": "", // string describing what happened
    "src_file": "", // file path
    "src_line": "", // line number
    "context": {}, // custom field here
    "level": "", // debug/info/warning/error/fatal
    "time": "", // ISO8601.nanoseconds+TZ (in node only support precision up to milliseconds)
    "backtrace": "" // err stack
}
```

### Usage
```
const log = require('node-logs')

// info log
log.info(
    'info', // string message
    { data }, // custom fields
    path.relative(process.cwd(), __filename), // filename path
    __line // line number
)

// debug log
log.debug(
    'debug', // string message
    { data }, // custom fields
    path.relative(process.cwd(), __filename), // filename path
    __line // line number
)

// warning log
log.warning(
    'warning', // string message
    { data }, // custom fields
    path.relative(process.cwd(), __filename), // filename path
    __line // line number
)

// error log
log.error(
    'error', // string message
    { data }, // custom fields
    path.relative(process.cwd(), __filename), // filename path
    __line, // line number
    err.stack // error stack trace object
)

// fatal log
log.fatal(
    'fatal', // string message
    { data }, // custom fields
    path.relative(process.cwd(), __filename), // filename path
    __line, // line number
    err.stack // error stack trace object
)
```

## Licensing
The code in this project is licensed under MIT license.
