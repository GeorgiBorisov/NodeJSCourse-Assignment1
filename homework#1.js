const http = require('http')
const url = require('url')
const {StringDecoder} = require('string_decoder')
const port = 3030
let handlers = {}
const server = http.createServer((req, res) => {
    let requestedUrl = url.parse(req.url)
    let path = requestedUrl.pathname
    let trimmedPath = path.replace(/^\/+|\/+$/g, '')
    let decoder = new StringDecoder('utf-8')
    req.on('data', (data) => {
        dataBuffer += decoder.write(data)
    })
    req.on('end', () => {
        dataBuffer += decoder.end()
        let chosenUrl = typeof(routes[trimmedPath]) !== 'undefined' ? routes[trimmedPath] : handlers.notFound      
        chosenUrl((status, message) => {
            status = typeof(status) == 'number' ? status : 200
            message = typeof(message) == 'object' ? message : {}
            let messageBody = JSON.stringify(message)
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(status)
            res.end(messageBody)
        })
    })
})
server.listen(port,() => {
    console.log(`Server listenninng on ${port}.`)
})
handlers.hello = (callback) => {
    callback(200, {message: 'Hello World!'})
}
handlers.notFound = (callback) => {
    callback(404, {message: 'Page not found!'})
}
const routes = {
    'hello': handlers.hello,
}