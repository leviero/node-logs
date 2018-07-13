'use strict'
module.exports = logger
function logger() {
    return {
        info: getLogger('info'),
        debug: getLogger('debug'),
        warning: getLogger('warning'),
        error: getLogger('error'),
        fatal: getLogger('fatal')
    }

    // private function
    function getLogger(level) {
        let {callerFile, callerLine} = getCallerFileAndLine()
        return function (message, fields, backtrace, src_file, src_line) {
            let data = {
                message,
                level,
                fields,
                src_file: src_file || callerFile,
                src_line: src_line || callerLine,
                time: (new Date()).toISOString()
            }

            if (backtrace) data.backtrace = backtrace

            console.log(JSON.stringify(data))
            return data
        }
    }

    function getCallerFileAndLine() {
        let originalPrepMethod = Error.prepareStackTrace
        let callerFile, callerLine
        try {
            let err = new Error()
            Error.prepareStackTrace = function returnStack (err, stack) { return stack }
            let currentFile = err.stack.shift().getFileName()
            let stack

            while (err.stack.length) {
                stack = err.stack.shift()
                callerFile = stack.getFileName()
                callerLine = stack.getLineNumber()

                if (currentFile !== callerFile) break
            }
        } catch (e) {}

        Error.prepareStackTrace = originalPrepMethod
        return { callerFile, callerLine }
    }
}

