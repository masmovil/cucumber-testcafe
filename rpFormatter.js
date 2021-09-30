const { createRPFormatterClass } = require('@reportportal/agent-js-cucumber')
const config = require('./rpConfig.json')

module.exports = createRPFormatterClass(config)
