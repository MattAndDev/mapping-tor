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

  getCollection (name, cb) {
    this.openConnection(() => {
      let collection = this.db.collection(name);
       collection.find({}).toArray((err, docs) => {
         cb(docs)
         this.db.close()
         return false
       })

     })
  }

  insertCollection(name, cb) {
    this.openConnection(() => {
      let collection = this.db.collection(name);
      collection.insertMany(cleanLocations, (err, result) => {
        console.log("Inserted 3 documents into the collection");
        cb(result);
      });
    })
  }



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
        console.log(entry)
      }
    })
  }
}

module.exports = new Db()
