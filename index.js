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
        return function (message, fields, backtrace, src_file, src_line) {
            let callerInfo = getCallerFileAndLine()
            let data = {
                message,
                level,
                fields,
                src_file: src_file || callerInfo.callerFile,
                src_line: src_line || callerInfo.callerLine,
                time: (new Date()).toISOString()
            }

            if (backtrace) data.backtrace = backtrace

            console.log(JSON.stringify(data))
            return data
        }
    }

    function getCallerFileAndLine() {
        let originalPrepMethod = Error.prepareStackTrace
        let callerInfo = {}
        try {
            let err = new Error()
            Error.prepareStackTrace = function returnStack (err, stack) { return stack }
            let currentFile = err.stack.shift().getFileName()
            let stack

            while (err.stack.length) {
                stack = err.stack.shift()
                callerInfo.callerFile = stack.getFileName()
                callerInfo.callerLine = stack.getLineNumber()

                if (currentFile !== callerInfo.callerFile) break
            }
        } catch (e) {}

        Error.prepareStackTrace = originalPrepMethod
        return callerInfo
    }
}

