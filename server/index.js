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

    // init the server
    server.init()
    // init the fetcher
    fetcher.init()
    // add the event listeners
    this.addListeners()
  }

  addListeners () {

    fetcher.on('fetched', (err, entry) => {
      if (!err) {
        db.handleNewExitNode(this.collection, entry)
        fetcher.scheduleNewExitNode()
      }
      else {
        console.log('Fetcher reported an errr')
        console.log(err)
        fetcher.scheduleNewExitNode()
      }
    })
  }


}


let mappingTor = new MappingTor()

mappingTor.init()
