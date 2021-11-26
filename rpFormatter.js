const { createRPFormatterClass } = require('@reportportal/agent-js-cucumber')
const config = require('../../configs/reportPortalConfig.js')
module.exports = createRPFormatterClass(config.default)

