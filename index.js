const http = require('http')
const https = require('https')
const url = require('url')
const fs = require('fs')
const { StringDecoder } = require('string_decoder')
const config = require('./config')

const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res)
})

httpServer.listen(config.httpPort, _ => {
  console.log(`The server is listening now on port ${config.httpPort}`)
})
const httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem')
}
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res)
})

httpsServer.listen(config.httpsPort, _ => {
  console.log(`The server is listening now on port ${config.httpsPort}`)
})

const unifiedServer = function (req, res) {
  const parsedUrl = url.parse(req.url, true)
  const originalPath = parsedUrl.pathname

  const path = originalPath.replace(/^\/+|\/+$/g, '')
  const method = req.method.toLowerCase()
  const queryObject = parsedUrl.query
  const headers = req.headers

  const decoder = new StringDecoder('utf-8')

  let buffer = ''

  req.on('data', data => {
    buffer += decoder.write(data)
  })

  req.on('end', _ => {
    buffer += decoder.end()

    let chosenHandler = typeof(router[path]) !== 'undefined' ? router[path] : handlers.notFound

    let data = {
      path,
      queryObject,
      method,
      headers,
      payload: buffer
    }

    chosenHandler(data, function (statusCode, payload) {
      statusCode = typeof(statusCode) === 'number' ? statusCode : 200
      payload = typeof(payload) === 'object' ? payload : {}

      let payloadString = JSON.stringify(payload)

      res.setHeader('Content-Type', 'application/json')
      res.writeHead(statusCode)
      res.end(payloadString)
    })

    console.log(buffer)
    // console.log(JSON.stringify(qStringObject, null, 2))

    res.end('Hello world\n', buffer)
  })
}

const handlers = {}

handlers.ping = function(data, callback) {
  callback(200)
}

handlers.hello = function(data, callback) {
  callback(200, { 'greeting': 'Hello to everyone ! ;)' })
}

handlers.notFound  = function (data, callback) {
  callback(404)
}

const router = {
  'ping': handlers.ping,
  'hello': handlers.hello
}
