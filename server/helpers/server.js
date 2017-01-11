'use strict'

//=================================================
// Default server
//=================================================


// require basics
let http = require('http')
let url = require('url')
let path = require('path')
let fs = require('fs')


class Server {

  init () {
    this.handler = http.createServer()
    this.bindListeners()
  }


  bindListeners () {
    this.handler.on('request', (req, res) => {
      var fileLoc = path.resolve('../public/')
      fileLoc = path.join(fileLoc, req.url)

      fs.readFile(fileLoc, function(err, data) {
        if (err) {
          res.writeHead(404, 'Not Found')
          res.write('404: File Not Found!')
          return res.end()
        }
        res.statusCode = 200
        res.write(data)
        return res.end()
      })
    })

    // listen to connection event
    this.handler.on('connection', () => {
      // console.log('connection')
    })

    //binding port listener, proxied by nginx
    this.handler.listen(8080, () => {
      // console.log('listened')
    })

  }

}

module.exports = new Server()
