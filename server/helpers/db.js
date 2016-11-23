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

  // reads the colelction with the given name
  // callback passes the complete collection
  readCollection (name, cb) {
    this._openConnection(() => {
      let collection = this.db.collection(name);
       collection.find({}).toArray((err, docs) => {
         cb(docs)
         this.db.close()
         return false
       })
     })
  }

  // insert an array into the passed collection
  // second param should be a valid array of json objects
  // cb once done with mongod data
  insertCollection(name, array, cb) {
    this._openConnection(() => {
      let collection = this.db.collection(name);
      collection.insertMany(array, (err, result) => {
        cb(result);
        this.db.close()
      });
    })
  }

  // deletes the passed collection
  // callback once done
  deleteCollection(name, cb) {
    this._openConnection(() => {
      let collection = this.db.collection(name);
      collection.remove({})
      this.db.close()
      cb()
      return false
    })
  }

  // Arbitrarily injects provided collection with data form json log
  insertDevCollection (name, cb) {
    this._openConnection(() => {
      let collection = this.db.collection(name)
      let cleanDevData = this._cleanUpLogfiles()
      collection.insertMany(cleanDevData, (err, result) => {
        cb(result);
        this.db.close()
      });
    })

    // open conenction private helper
    // used to open up a port to mongod
    // callbacks once done to allow db manipulation
    _openConnection (cb) {
      Mongodb.connect(env.mongoDb.endpoint, (err, db) => {
        if (err) {
          console.log(err)
        }
        this.db = db
        cb()
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
