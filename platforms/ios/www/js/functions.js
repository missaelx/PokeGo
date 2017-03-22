var Latitude = undefined;
var Longitude = undefined;
var map;
var markers = [];
var watchID; //id del evento que vigila la posicion
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function onOffline(){
    //alert("No tienes conexión");
    navigator.notification.confirm('No tienes internet', function(e){
    	if(e == 1){
    		if (navigator.connection.type == Connection.NONE) {
    			onOffline();
    		}
    	} else {
    		navigator.app.exitApp();
    	}
    },'Sin conexión',['Reintentar','Salir']); //reintentar 1, salir 2, 0 sin seleccion
}
function buscarPokemones(latitude, longitude){
	var latitudSinPrecision = latitude.toPrecision(6);
	var longitudSinPrecision = longitude.toPrecision(6);

	for(var i = 0; i < artefactos.objetos.length; i++){
		var pokemon = artefactos.objetos[i];
		var latPokemonSinPresicion = pokemon.lat.toPrecision(6);
		var lngPokemonSinPresicion = pokemon.lng.toPrecision(6);
		if (latPokemonSinPresicion == latitudSinPrecision &&
			lngPokemonSinPresicion == longitudSinPrecision){
			asignarMarcadorAPokemon(i, pokemon.lat, pokemon.lng);
		} else {
			if(pokemon.markers.length != 0){
				for(var j =0; j< pokemon.markers.length; j++){
					console.log(pokemon.markers[j]);
					pokemon.markers[j].empty();
					console.log("Se ha eliminado el marcador");
					console.log(pokemon.markers[j]);
				}
				pokemon.markers = [];
			}
		}
	}
}

function asignarMarcadorAPokemon(indice, lat, lon){
	var pokemon = artefactos.objetos[indice];
	if(pokemon.markers.length == 0){
		map.addMarker({
			position: {lat: lat, lng: lon},
			title: pokemon.nombre,
			icon: {
				url: "www/img/" + pokemon.img
			},
			animation: plugin.google.maps.Animation.BOUNCE
		}, function(marker){
			marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function(e) {
				console.log(this);
				console.log(e);
				alert("Click");
			});
			marker.showInfoWindow();
			pokemon.markers.push(marker);
		});	
	}

	
}
function addMarker(latitude, longitude){
	// Add a maker
	markers[0].remove();
	map.addMarker({
		position: {lat: latitude, lng: longitude},
		icon:{
			url: "www/img/current.png"
		},
		animation: plugin.google.maps.Animation.BOUNCE
	}, function(marker) {
		
		markers[0] = marker;
		vigilarPosicion();
	});

}
function actualizarMapa(position){
	//paramos de leer hasta que se ejecute todo
	navigator.geolocation.clearWatch(watchID);

	var updatedLatitude = position.coords.latitude;
    var updatedLongitude = position.coords.longitude;

    if (updatedLatitude != Latitude || updatedLongitude != Longitude) {

        Latitude = updatedLatitude;
        Longitude = updatedLongitude;

        addMarker(updatedLatitude, updatedLongitude);
    } else {
    	vigilarPosicion();
    }
    buscarPokemones(updatedLatitude, updatedLongitude);
}
function onError(error) {
	navigator.notification.alert("Imposible acceder a tu posicion", null, "Error desconocido", ["Aceptar"])
}
function vigilarPosicion(){
    watchID = navigator.geolocation.watchPosition(actualizarMapa, onError,
    	{
    		maximumAge: 3000,
    		timeout: 5000,
    		enableHighAccuracy: true
    	}
    );
}

function incializarMapa(){
	var div = document.getElementById("mapa");
	// Initialize the map view
	map = plugin.google.maps.Map.getMap(div);
	map.setOptions({
			'backgroundColor': 'white',
			'controls': {
				'compass': false,
				'myLocationButton': true,
				'indoorPicker': true,
				'zoom': false // Only for Android
			},
			'gestures': {
				'scroll': false,
				'tilt': true,
				'rotate': false,
				'zoom': false
			}
	});
	map.setIndoorEnabled(true);
	map.setAllGesturesEnabled(false);



	function onMapReady(){
		navigator.geolocation.getCurrentPosition(function(position){
			//succes
			// Move to the position with animation
			map.animateCamera({
				target: {lat: position.coords.latitude, lng: position.coords.longitude},
				zoom: 25,
				tilt: 60,
				bearing: 140,
				duration: 5000
				}, function() {

					// Add a maker
					map.addMarker({
						position: {lat: position.coords.latitude, lng: position.coords.longitude},
						icon: {
							url: "www/img/current.png"
						},
						animation: plugin.google.maps.Animation.BOUNCE
					}, function(marker) {
						markers[0] = marker;
						vigilarPosicion();
					});

					
			});
		}, onError);

		
	}


	// Wait until the map is ready status.
	map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);
}

