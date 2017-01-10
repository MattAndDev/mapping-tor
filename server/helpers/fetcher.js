'use strict'

// =========================================
// Fetcher
// =========================================

let tor = require('tor-request')
let exec = require('child_process').exec;
let env = require('../.env.json')
let EventEmitter = require('events').EventEmitter

// Set tor env variables
tor.setTorAddress(env.tor.host, env.tor.port)
tor.TorControlPort.password = env.tor.pwd
tor.TorControlPort.host = env.tor.host
tor.TorControlPort.port = env.tor.controlPort


class Fetcher extends EventEmitter {

  constructor () {
    super()
  }

  // makes request to apify to get current exit node
  getLocalizeIp () {

    tor.request({
      url:'http://ip-api.com/json',
      timeout: 1000
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
  }

  requestNewExitNode (cb) {
    // Set tor env variables
    tor.renewTorSession((done) => {
      console.log(done);
      this.emit('newExitNode')
    })
  }

}

module.exports = new Fetcher()
