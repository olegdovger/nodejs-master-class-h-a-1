const environments = {};

environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: 'staging'
}
environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: 'production'
}

const NODE_ENV = process.env.NODE_ENV
const currentEnvironment = typeof(NODE_ENV) === 'string' ? NODE_ENV.toLowerCase() : ''

let envObject = environments[currentEnvironment]

const environmentExport = typeof(envObject) === 'object' ? envObject : environments.staging

module.exports = environmentExport
