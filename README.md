# lalalogs
This project is created in order to standardize the logs format across all node-js projects used in lalamove

## Install
```
npm install --save lalalogs
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
const Logger = require('lalalogs')
const log = new Logger()

// info log
log.info(
    'blah blah blah', // string message
    { name: 'Chen' } // custom fields
)

// debug log
log.debug(
    'blah blah blah', // string message
    { name: 'Chen' }, // custom fields
)

// warning log
log.warning(
    'blah blah blah', // string message
    { name: 'Chen' }, // custom fields
)

// error log
log.error(
    'blah blah blah', // string message
    { name: 'Chen' }, // custom fields
    err.stack // error stack trace object
)

// fatal log
log.fatal(
    'blah blah blah', // string message
    { name: 'Chen' }, // custom fields
    err.stack // error stack trace object
)
```

## Licensing
The code in this project is licensed under MIT license.
