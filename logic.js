// **************************************************************
// UC berkeley Data Analytics Bootcamp
// UCBSAN201811DATA2:  2018-2019
// Unit 17 | Assignment - Visualizing Data with Leaflet
// Joe Abuzaid
// **************************************************************
//
// Function to create the earthquakes color scheme. The stronger => the darker
function chooseColor(mag) {
  if(mag < 1 && mag >= 0)
    return "#ffeda0";
  else if(mag < 2 && mag >= 1)
    return "#fed976";
  else if(mag < 3 && mag >= 2)
    return "#feb24c";
  else if(mag < 4 && mag >= 3)
    return "#fc4e2a";
  else if(mag < 5 && mag >= 4)
    return "#bd0026";
  else if(mag > 5)
    return "#800026";
  else
    return "#ffeda0";
}
// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
// var earthquakes = [];
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place + ", Mag: " + feature.properties.mag +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature, 
    pointToLayer: function(feature, latlng) {
      console.log(feature.properties.mag);
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * 3,
        fillOpacity: 0.85,
        color: chooseColor(feature.properties.mag)
        
      });
    }
  });
  
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
};

function createMap(earthquakes) {

  // Define streetmap layer
  var streetsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

// Define darkmap layer
var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

// Define satellite layer
  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  // Define grayscale layer
  var piratesmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.pirates",
    accessToken: API_KEY
  });

  var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    Street: streetsmap,
    Grayscale: darkmap,
    Satellite: satellitemap,
    pirate: piratesmap,
    Outdoors: outdoorsmap
  };
  var plates = new L.LayerGroup();
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json", data => {
    L.geoJSON(data, {
      color:"orange",
      weight:2
    }).addTo(plates);
  });
 // plates.addTo(myMap);
  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    FaultLines : plates
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -19.71
    ],
    zoom: 2,
    layers: [streetsmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap)
 
  // Create Legend
  map = map %>% addLegend("bottomright", 
    colors =c("#ffeda0",  "#fed976", "#feb24c", "#fc4e2a", "#bd0026", "#800026"),
    labels= c("0-1", "1-2", "2-3", "3-4", "4-5", "5+"),
    title= "Scale Colors"
    opacity = 1)
}
