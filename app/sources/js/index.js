module.exports = {
  // Renders the map with data thats requested above
  init: function (data) {
    let map = L.map('mapid')
    L.tileLayer.provider('CartoDB').addTo(map)
    this.setView(map)
    this.addPoints(map, data)
    render.active.map = map      
  }, 
  setView: function (map) {
    map.setView([52.36, 4.888], 12)
  },
  addPoints: function (map, data) {
    // Filters data. It shows the right data that is selected by the user
    let filteredData = data

    if (render.active.selectedDate) {
      if (render.active.selectedDate == "Alles") {
        filteredData = data
      } else {
        filteredData = data.filter(function (item) {
        if (item.date) {
          return item.date.value == render.active.selectedDate
        } else if (render.active.selectedDate == '????') {
          return item
        }
      })
    }
    } else {
      filteredData = data
    }
    // Makes all wkt data to points. That makes it easier to show
    filteredData.forEach(function (item) {
      const geojson = Terraformer.WKT.parse(item.wkt.value)
      let geoArray = []
      if (geojson.type == 'MultiLineString' || geojson.type == 'Polygon') {
        geojson.coordinates[0][0].forEach(function (item) {
          geojson.type = 'Point'
          geoArray.push(item)
          geojson.coordinates = geoArray
        })
      } else if (geojson.type == 'LineString') {
        geojson.coordinates[0].forEach(function (item) {
          geojson.type = 'Point'
          geoArray.push(item)
          geojson.coordinates = geoArray
        })
      } 

      geojson.name = item.ALstreetLabel.value
      geojson.uri = item.ALstreet.value.replace('https://adamlink.nl/geo/', '')
      if(item.date) {
        geojson.date = item.date.value
      } else {
        geojson.date = '????'
      }

      L.geoJSON(geojson, { 
        pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {
            icon: render.leafIcon('')
        })
      } 
    }).addTo(map).on('click', function (e) {
        render.focus(map, e)
      })
    })
  },
  // When clicked on map the focus goes to that certain place
  focus: function (map, e) {
    // Custom marker when clicked on a certain point in the map
    e.layer.setIcon(render.leafIcon('-active'))

    map.panTo(new L.LatLng(e.latlng.lat, e.latlng.lng))
    map.setView([(e.latlng.lat - .0002), e.latlng.lng], 20)
    render.active = {
      'uri': e.layer.feature.geometry.uri,
      'date': e.layer.feature.geometry.date,
      'park': e.layer.feature.geometry.name,
      'map': map
    }
    routie(`refreshPark`)
  },
  leafIcon: function (active) {
    let leafIcon = L.icon({
      iconUrl: `static/images/park-icon${active}.png`,
      shadowUrl: 'static/images/park-shadow.png',
  
      iconSize:     [44, 70,7], // size of the icon
      shadowSize:   [51, 65], // size of the shadow
      iconAnchor:   [23, 69], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    })
    return leafIcon
  },
  active: {}
}