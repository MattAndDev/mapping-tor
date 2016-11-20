'use strict'

// =========================================
// Mapping tor
// =========================================

let logger = require('./helpers/logger')
let fetcher = require('./helpers/fetcher')


class MappingTor {

  init () {
    fetcher.getLocalizeIp()
    this.addListeners()
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
