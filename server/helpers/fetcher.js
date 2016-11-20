'use strict'

// =========================================
// Fetcher
// =========================================

let tor = require('tor-request')
let exec = require('child_process').exec;
let env = require('../.env.json')
let EventEmitter = require('events').EventEmitter


tor.TorControlPort.password = env.tor.pwd

class Fetcher extends EventEmitter {

  constructor () {
    super()
  }

  // makes request to apify to get current exit node
  getLocalizeIp () {
    tor.request({
      url:'http://ip-api.com/json',
      setTimeout: 6000
    },
    (err, res, body) =>  {
      // if everything is fine
      if (!err && res.statusCode == 200) {
        // parse response and prepare object to be stored
        let jsonBody = JSON.parse(body)
        let entry = {
          lat: jsonBody.lat,
          lon: jsonBody.lon,
          ip: jsonBody.query,
          time: new Date
        }
        this.emit('fetched', false, entry)
      }
      else {
        this.emit('fetched', err, false)
      }
    })
    .on('timeout', (err) => {
      this.emit('timeout', err, false)
    })
  }

  requestNewExitNode (cb) {
    tor.renewTorSession((done) => {
      this.emit('newExitNode')
    })
  }

}

module.exports = new Fetcher()
