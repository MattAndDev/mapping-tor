'use strict'

// =========================================
// Mapping tor
// =========================================

let fetcher = require('./helpers/fetcher')
let server = require('./helpers/server')
let db = require('./helpers/db')
let env = require('./.env.json')
let _  = require('lodash')


class MappingTor {

  init () {

    // Switch collection base on application mode
    // use this to avoid always overriding the clean location
    if (env.application.mode === 'development') {
      this.collection = 'locations-dev'
    } else {
      this.collection = 'locations'
    }

    server.init()
    this.handleNewExitNode({test:'bitch'})
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
    db.readCollection(this.collection, (collection) => {
      let check = _.find(collection, (o) => {  return o.ip === entry.ip;})
      // if entry does not exist
      console.log(check);
      // use an update against the ip
      if (typeof check !== 'undefined') {
      }
      // insert new entry
      else {
        db.appendToCollection(this.collection, entry, (result) => {
          console.log(result);
        })
      }
    })
  }

}


let mappingTor = new MappingTor()

mappingTor.init()
