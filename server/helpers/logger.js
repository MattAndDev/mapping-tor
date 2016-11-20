'use strict'

let EventEmitter = require('events').EventEmitter
let fs = require('fs')

let jsonfile = require('jsonfile')

module.exports = class Logger extends EventEmitter {

  constructor () {
    super()
  }

  write (entry, file, cb) {
    jsonfile.readFile(file, function(err, obj) {
      console.log(obj)
      obj.push(entry)
      jsonfile.writeFile(file, obj, {spaces: 2}, function(err) {
        console.error(err)
        cb()
      })
    })
  }

}
