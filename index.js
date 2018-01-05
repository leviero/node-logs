'use strict'
function getLogger(level) {
    return function (message, fields, src_file, src_line, backtrace) {
        let data = {
            message,
            level,
            fields,
            src_file,
            src_line,
            time: (new Date()).toISOString()
        }

        if (backtrace) data.backtrace = backtrace

        console.log(JSON.stringify(data))
        return data
    }
}

function logger() {
    return {
        info: getLogger('info'),
        debug: getLogger('debug'),
        warning: getLogger('warning'),
        error: getLogger('error'),
        fatal: getLogger('fatal')
    }
}

module.exports = logger
