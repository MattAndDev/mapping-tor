// import libs
import _ from 'lodash'

// import utils
import runtime from './utils/runtime'
import settings from './utils/settings'

// import data
import locations from './data/locations'
import keys from './data/keys'
// {
//   "maps": "APIKEY"
// }



// $.ready
let domReady = function (callback) {
  document.readyState === 'interactive' || document.readyState === 'complete' ? callback() : document.addEventListener('DOMContentLoaded', callback)
}

domReady(() => {

  var uniqueLocations = _.uniqBy(locations, (location) => {
    return [location.lat, location.lon].join()
  })

  let addMapsApi = () => {
    let s = document.createElement('script')
    s.src = `https://maps.googleapis.com/maps/api/js?key=${keys.maps}&callback=initMap`
    document.getElementsByTagName('body')[0].appendChild(s)
  }

  window.initMap = () => {
    console.log('maps ready')
    var uluru = {lat: -25.363, lng: 131.044}
    var map = new google.maps.Map(document.querySelector('.map'), {
      zoom: 4,
      center: uluru
    })
    _.each(uniqueLocations, (location) => {
      var marker = new google.maps.Marker({
        position: {lat: location.lat, lng: location.lon},
        map: map
      })
    })
  }
  addMapsApi()


})
