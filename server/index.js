'use strict'

// =========================================
// Mapping tor
// =========================================

let fetcher = require('./helpers/fetcher')
let server = require('./helpers/server')
let db = require('./helpers/db')

class MappingTor {

  init () {
    // fetcher.getLocalizeIp()
    // this.addListeners()
    server.init()
    db.insertCollection('collection', (collection) => {
      console.log(collection)
    })
    db.getCollection('location', (collection) => {
      console.log(collection)
    })
  }


  startServer () {

  }

  addListeners () {
    fetcher.on('fetched', (err, entry) => {
      console.log(err, entry)
      if (!err) {
        logger.write(entry, './log.json')
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

}


let mappingTor = new MappingTor()

mappingTor.init()
