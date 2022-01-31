const { createRPFormatterClass } = require('@reportportal/agent-js-cucumber')
const config = require('../../shared/configs/reportPortalConfig.js')
module.exports = createRPFormatterClass(config.default)
