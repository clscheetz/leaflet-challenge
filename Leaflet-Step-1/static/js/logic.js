// Create map object
var myMap = L.map("map", {
    center: [40.77, -111.99],
    zoom: 5
});

// Add the title layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);


// Assemble URL
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Grab GeoJSON data
d3.json(link, function(data) {
  // Create styling for radius and markers
  function styling(feature) {
    return {
      opacity: 2,
      fillOpacity: 1,
      fillColor: color(feature.properties.mag),
      color: "#000000",
      radius: radius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  function color(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "#EA2C2C";
      case magnitude > 4:
        return "#EA822C";
      case magnitude > 3:
        return "#EE9C00";
      case magnitude > 2:
        return "#EECC00";
      case magnitude > 1:
        return "#D4EE00";
      default:
        return "#98EE00";
      };
  }
  function radius(magnitude) {
    if (magnitude === 0) {
      return 1
    }
    return magnitude * 4
  }
  // Creating GeoJSON layer with the retreived data
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styling,
    onEachFeature: function(feature, layer) {
      layer.bindPopup (feature.properties.place, feature.properties.mag)
    } 
  }).addTo(myMap)
});

// Still need to add legend