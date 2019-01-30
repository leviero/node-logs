const Logger = require('./index')

const log = new Logger()


function wawawa() {
log.info(undefined, {b: 1, a: 0})
log.debug(undefined, {b: 1, a: 0})
log.error(undefined, {b: 1, a: 0})
log.warning(undefined, {b: 1, a: 0})
log.fatal(undefined, {b: 1, a: 0})
// log.blah(undefined, {b: 1, a: 0})
}

wawawa()
