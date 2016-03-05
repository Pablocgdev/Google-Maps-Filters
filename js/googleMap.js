var map;
var searchBox;
var input;
var selectTypes;
var markers = [];
var maerkersSearch = [];


function initAutocomplete() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 36.92231, lng: -6.0733156},
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });


  // Map positioning using geolocation.
  // Initialize errors.
  var infoWindow = new google.maps.InfoWindow({map: map});
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      infoWindow.setPosition(pos);
      infoWindow.setContent('Estás aquí.');
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
     handleLocationError(false, infoWindow, map.getCenter());
  }


  // Create searchbox and link to input.
  input = document.getElementById('pac-input');
  searchBox = new google.maps.places.SearchBox(input);

  // Search input inside the map.
  //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Refresh predictions.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });


  // Details when user selects a prediction.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // Icon, name an location of places.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create markers for every location.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        draggable: true,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
  // [END region_getplaces]
}


function busquedaSitios(){

  // Clear old search markers.
    maerkersSearch.forEach(function(marker) {
      marker.setMap(null);
    });
    maerkersSearch = [];

  var selectTypes=document.getElementById('types').value;
  var inputKeyword=document.getElementById('keyword').value;

  if(selectTypes!=""){
    inputKeyword = selectTypes + " " + inputKeyword;
  }

  var radius=document.getElementById('radius').value;
  radius*=1000;
  // Markers position.
  var marker=markers[0].getPosition();

  // Markers InfoWindow.
  var infowindows = new google.maps.InfoWindow();

  // Custom search with user preferences.
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: marker,
    radius: radius,
    keyword: inputKeyword
  }, callback);

  // Create markers.
  function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
    }
  }

  function createMarker(place) {

    var placeLoc = place.geometry.location;
    var marker= new google.maps.Marker({
      map: map,
      position: place.geometry.location
    })
    // Push them to an array for deleting when refreshing the search.
    maerkersSearch.push(marker);

    // Maker info on click.
    google.maps.event.addListener(marker, 'click', function() {
      infowindows.setContent(place.name);
      infowindows.open(map, this);
    });
  }
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'No se ha podido detectar su localización.' :
                        'Tu navegador no soporta localización.');
}

