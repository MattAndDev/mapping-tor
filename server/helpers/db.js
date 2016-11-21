'use strict'

let EventEmitter = require('events').EventEmitter
let Mongodb = require('mongodb').MongoClient
let env = require('../.env.json')
let locations = require('../log.json')
let _  = require('lodash')

class Db extends EventEmitter {

  constructor () {
    super()


  }

  write (entry, file) {
  }

  openConnection (cb) {
    Mongodb.connect(env.mongoDb.endpoint, (err, db) => {
      if (err) {
        console.log(err)
      }
      this.db = db
      cb()
    })
  }

  readCollection (name, cb) {
    this.openConnection(() => {
      let collection = this.db.collection(name);
       collection.find({}).toArray((err, docs) => {
         cb(docs)
         this.db.close()
         return false
       })
     })
  }

  insertCollection(name, array, cb) {
    this.openConnection(() => {
      let collection = this.db.collection(name);
      collection.insertMany(array, (err, result) => {
        cb(result);
        this.db.close()
      });
    })
  }

  deleteCollection(name, cb) {
    this.openConnection(() => {
      let collection = this.db.collection(name);
      collection.remove({})
      this.db.close()
      return false
    })
  }

  // Kept in case original raw data needs to be restored
  // traversing array of object, get's matching by ip, and counts
  _cleanUpLogfiles () {
    let cleanLocations = []
    _.sortBy(locations, (location, index) => {
        let add = true
      _.sortBy(cleanLocations, (cleanLocation, index) => {
        if (cleanLocation.ip === location.ip) {
          add = false
        }
      })
      if (add) {
        cleanLocations.push(location)
        add = true
      } else {
        let entry = _.find(cleanLocations, (o) => {
          return o.ip === location.ip;
        })
        if (typeof entry.count !== 'undefined') {
          entry.count = entry.count + 1
        } else {
          entry.count = 1
        }
        entry.time = location.time
      }
    })
    return cleanLocations
  }
}

module.exports = new Db()
