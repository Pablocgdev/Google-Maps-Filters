

var map;
var searchBox;
var input;
var selectTypes;
var markers = [];
var markersBusqueda = [];




function initAutocomplete() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 36.92231, lng: -6.0733156},
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

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

    // Limpia lo viejos marcadores
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

  // Limpia lo viejos marcadores de la anterior busqueda
    markersBusqueda.forEach(function(marker) {
      marker.setMap(null);
    });
    markersBusqueda = [];

  // obtengo el tipo de sitio para la busqueda
  // se la indica en types: del metodo nearbysearch()
  var selectTypes=document.getElementById('types').value;

  // obtengo la categoria o palabra para la busqueda
  // se la indica en keyword: del metodo nearbysearch()
  var inputKeyword=document.getElementById('keyword').value;

 inputKeyword = selectTypes + " " + inputKeyword;

  var radius=document.getElementById('radius').value;
  radius*=1000;
  // obtengo la posicion del marcador
  var marker=markers[0].getPosition();

  // location.geometry.location -> esta es la lat y long del lugar escogido
  // para darsela al metodo nearbysearch en location:

  // para la info de los markers
  var infowindow = new google.maps.InfoWindow();

  // hace la busqueda con los parametros que le indicamos
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: marker,
    radius: radius,
    keyword: inputKeyword
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
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
  }


}
