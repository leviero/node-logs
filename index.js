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
        return function (message, context, backtrace, src_file, src_line) {
            let callerInfo = getCallerFileAndLine()

            // normally, request and response in the context object can be a huge object.
            // when the logs are processed by kubernetes, it result to thousands of fields depending on your application
            // Thus results in performance penalty from the indexs. thus on e solution is to espace it and let k8s treat it as string
            if ("request" in context){
                context.request = JSON.stringify(context.request).replace(/\{/g, '\\{').replace(/}/g, '\\}');
            }

            if ("response" in context) {
                context.response = JSON.stringify(context.response).replace(/\{/g, '\\{').replace(/}/g, '\\}');
            }

            let data = {
                message,
                level,
                context,
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

