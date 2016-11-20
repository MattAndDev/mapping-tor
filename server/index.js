'use strict'

// =========================================
// Mapping tor
// =========================================

let logger = require('./helpers/logger')
let fetcher = require('./helpers/fetcher')


class MappingTor {

  init () {
    fetcher.geLocalizeIp()
    this.addListeners()
  }

  addListeners () {
    fetcher.on('fetched', (err, entry) => {
      if (!err) {
        console.log(entry)
      }
    })
  }

}
