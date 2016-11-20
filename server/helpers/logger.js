'use strict'

let EventEmitter = require('events').EventEmitter
let fs = require('fs')

let jsonfile = require('jsonfile')

class Logger extends EventEmitter {

  constructor () {
    super()
  }

  write (entry, file) {
    jsonfile.readFile(file, (err, obj) => {
      console.log(obj)
      obj.push(entry)
      jsonfile.writeFile(file, obj, {spaces: 2}, (err) => {
        this.emit('written')
      })
    })
  }

}

module.exports = new Logger()
