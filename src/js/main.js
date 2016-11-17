// import libs
import _ from 'lodash'
// import utils
import runtime from './utils/runtime'
import settings from './utils/settings'

// import data
import locations from './data/locations'

// $.ready
let domReady = function (callback) {
  document.readyState === 'interactive' || document.readyState === 'complete' ? callback() : document.addEventListener('DOMContentLoaded', callback)
}

domReady(() => {

  var uniqueLocations = _.uniqBy(locations, (location) => {
    return [location.lat, location.lon].join()
  })


})
