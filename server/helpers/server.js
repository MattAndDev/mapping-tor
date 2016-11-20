'use strict'

//=================================================
// Default server
//=================================================


// require basics
let http = require('http')
let url = require('url')


class Server {

  init () {
    this.handler = http.createServer()
    this.bindListeners()
  }


  bindListeners () {
    this.handler.on('request', (req, res) => {

      // get query paremeters and do seomthing with it
      let params = url.parse(req.url, true).query

      // default response text
      let responseText = 'Hello my dear,  World\n'

      // write response head
      res.writeHead(200, {'Content-Type': 'text/plain'})
      // die wwith response text
      res.end(responseText)

    })

    // listen to connection event
    this.handler.on('connection', () => {
      console.log('connection')
    })

    //binding port listener, proxied by nginx
    this.handler.listen(8080, () => {
      console.log('listened')
    })

  }

}

module.exports = new Server()
