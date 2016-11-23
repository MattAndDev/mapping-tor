'use strict'

// =========================================
// Mapping tor
// =========================================

let fetcher = require('./helpers/fetcher')
let server = require('./helpers/server')
let db = require('./helpers/db')
let env = require('./.env.json')

console.log(env.application);

class MappingTor {

  init () {
    // fetcher.getLocalizeIp()
    // this.addListeners()
    console.log(process.env);


    // Switch collection base on application mode
    // use this to avoid always overriding the clean location
    if (env.application.mode === 'development') {
      this.collection = 'locations-dev'
    } else {
      this.collection = 'locations'
    }

    server.init()
    // db.insertDevCollection( (collection) => {
    //   console.log(collection)
    // })
    // db.readCollection('locations', (collection) => {
    //   console.log(collection)
    // })
    // db.deleteCollection('locations', (collection) => {
    //   console.log(collection)
    // })
  }


  startServer () {

  }

  addListeners () {
    fetcher.on('fetched', (err, entry) => {
      console.log(err, entry)
      if (!err) {
        this.handleNewExitNode(entry)
      }
      else {
        fetcher.requestNewExitNode()
      }
    })

    fetcher.on('newExitNode', () => {
      console.log('new node')
      fetcher.getLocalizeIp()
    })

    logger.on('written', () => {
      console.log('written')
      fetcher.requestNewExitNode()
    })
  }


  // TODO move on here :D
  handleNewExitNode (entry) {
    db.readCollection('locations', (collection) => {
      let check = _.find(cleanLocations, (o) => {  return o.ip === entry.ip;})
      // if entry does not exist
      if (typeof check !== 'undefined') {
        db.insertCollection(entry, (resul) => {
          console.log(result);
        })
      }
    })
  }

}


let mappingTor = new MappingTor()

mappingTor.init()
