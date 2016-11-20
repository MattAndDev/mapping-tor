'use strict'

// =========================================
// Mapping tor
// =========================================

let tor = require('tor-request')
let request = require('request')
let exec = require('child_process').exec;
let util = require('util')
let Logger = require('./helpers/logger')
let env = require('./.env.json')


tor.TorControlPort.password = env.tor.pwd

class MappingTor extends Logger {

  constructor () {
    super()
  }
  // makes request to apify to get current exit node
  makeRequest () {
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
        // write log entry
        this.write(entry, './server/log.json', () => { 
          this.requestNewExitNode()
        })
      }
      else {
        this.requestNewExitNode()
        console.log(err, res)
      }
    })
    .on('timeout', (err) => {
      console.log(err)
    })
  }

  requestNewExitNode () {
    tor.renewTorSession((done) => {
      this.makeRequest()
    })
  }

}

let mapTor = new MappingTor()

mapTor.makeRequest()
