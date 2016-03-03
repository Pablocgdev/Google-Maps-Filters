var map;
var searchBox;
var input;
var input2;
var markers = [];
var markersBusqueda = [];


function initAutocomplete() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 36.92231, lng: -6.0733156},
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });


  // Posiciona el mapa en la ubicación del usuario
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

   
  // Crea el searchBox y lo linkea con el input
  input = document.getElementById('pac-input');
  searchBox = new google.maps.places.SearchBox(input);

  //Esto es para poner el input de busqueda dentro del mapa
  //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input); 

  // Cuando hay cambios te va mostrando las sugerencias
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  
  
  // Detecta el evento cuando el usuario selecciona 
  // una predicción y recuperar más detalles sobre ese lugar.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    
    if (places.length == 0) {
      return;
    }

    // Limpia los viejos marcadores
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // Para cada lugar obtiene el icono, el nombre y la ubicación.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Crea el marcador por cada sitio
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

  // Limpia los viejos marcadores de la anterior busqueda
    markersBusqueda.forEach(function(marker) {
      marker.setMap(null);
    });
    markersBusqueda = [];

  // obtengo la categoria o palabra para la busqueda
  // se la indica en keyword: del metodo nearbysearch() 
  var input2=document.getElementById('categoria').value;

  //obtengo el lugar escogido en el input de autocompletar
  //var busqueda=searchBox.getPlaces();
  //var location=busqueda[0];

  var radius=document.getElementById('radius').value;
  radius*=1000;
  // obtengo la posicion del marcador
  var marker=markers[0].getPosition();

  // location.geometry.location -> esta es la lat y long del lugar escogido
  // para darsela al metodo nearbysearch en location:

  // para la info de los markers
  var infowindows = new google.maps.InfoWindow();

  // hace la busqueda con los parametros que le indicamos
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: marker,
    radius: radius,
    keyword: input2
  }, callback);

  // recibe los resultado y crea todos los marcadores en el mapa
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
    // los meto en un array para eliminarlo con cada nueva busqueda
    markersBusqueda.push(marker);

    // en el click de los markers le pone las ventanas de info
    google.maps.event.addListener(marker, 'click', function() {
      infowindows.setContent(place.name);
      infowindows.open(map, this);
    });
  }
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}