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
    db.insertCollection('locations', (collection) => {
      console.log(collection)
    })

    db.deleteCollection('locations', (collection) => {
      console.log(collection)
    })
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
      if (typeof check !=== 'undefined') {
        db.insertCollection(entry)
      }
    })
  }

}


let mappingTor = new MappingTor()

mappingTor.init()
