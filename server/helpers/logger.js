'use strict'

let EventEmitter = require('events').EventEmitter
let fs = require('fs')

let Mongodb = require('mongodb').MongoClient
let env = require('../.env.json')

// Connection URL

let jsonfile = require('jsonfile')

class Logger extends EventEmitter {

  constructor () {
    super()

    this.testDbConenction()

  }

  write (entry, file) {

  }


  testDbConenction () {

    Mongodb.connect(env.mongoDb.endpoint, function(err, db) {
      console.log("Connected successfully to mongo db")
      db.close()
    })

  }


}

module.exports = new Logger()
