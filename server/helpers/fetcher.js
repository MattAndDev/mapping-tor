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

    // configure throttle for new exit nodes
    this.requestNodeInterval = 60000 // 1 minute
  }

  // init function
  init () {

    this.testTor(() => {
      this.scheduleNewExitNode()
    })
  }


  testTor (cb) {
    tor.request('http://www.google.com',  (err, res) => {
      if (!err) {
      }
      else {
        // console.log(err);
        // if failying means no control port acces is granted
        // this is mandatory for the app to work
        // critical error and shutting down
        let error = new Error(
          err.message + ` \nCannot connect to TOR. \nApplication shutting down!`
        )
        console.log(error);
        process.exit(0);
      }
    })
  }

  // Ip geo localizer
  // ==
  // makes request to apify to get current exit node data
  // emits a 'fetched' event, passing either error or result

  _getLocalizeIp () {

    tor.request({
      url:'http://ip-api.com/json',
      timeout: 5000
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

  // Schedule new exit node request
  // ==
  // Time based request for new exit node
  // if called before timeout elapsed
  // takes care of waiting correct amount of time

  scheduleNewExitNode () {

    // local current time
    let now = Date.now()

    if (this.lastNodeRequest && now - this.requestNodeInterval < this.lastNodeRequest ) {
      // if last request exist and not enoug htime passed
      // calculate missing milliseconds and fire setTimeout
      let timeout = this.lastNodeRequest - (now - this.requestNodeInterval)
      setTimeout(() => {
        this._requestNewExitNode()
      }, timeout)

    } else {
      // enough time has passed, request new node
      this._requestNewExitNode()
    }
    this.lastNodeRequest = Date.now()
  }


  // Request new TOR exit node via control port
  // ==
  // uses tor-request helper to arbitrarily request a new exit node
  // when new exit nod is there, calls geoLocalizing function

  _requestNewExitNode () {

    // call the tor request helper
    tor.renewTorSession((err) => {

      if (!err) {
        // if done is null, new node is there
        // geo localize the ip
        this._getLocalizeIp()
      }
      else {
        // if failying means no control port acces is granted
        // this is mandatory for the app to work
        // critical error and shutting down
        let error = new Error(
          err.message + ` \nControl port access is required. \nApplication shutting down!`
        )
        console.log(error);
        process.exit(0);
      }
    })
  }

}

module.exports = new Fetcher()
