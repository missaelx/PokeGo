var Latitude = undefined;
var Longitude = undefined;
var map;
var markers = [];
var watchID; //id del evento que vigila la posicion

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
					pokemon.markers[j].empty();
				}
				pokemon.markers = [];
			}
		}
	}
}

function capturarPokemon(e){
	navigator.notification.beep(1);
	var pokemonpuro = {
		id: e.pokemon.id,
		nombre: e.pokemon.nombre,
		img: e.pokemon.img
	};
	
	llenarPreguntas(e);
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
			marker.pokemon = pokemon;
			marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function(e) {
				marker.showInfoWindow();
				marker.setAnimation(plugin.google.maps.Animation.BOUNCE);
			});
			marker.addEventListener(plugin.google.maps.event.INFO_CLICK, function(e) {
				capturarPokemon(e);
			});
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
			url: "www/img/current2.png"
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
    		maximumAge: 10000,
    		timeout: 10000,
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
							url: "www/img/current2.png"
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

function incializarObjetos(){
	var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
	
	//verificamos si esta guardado una copia de los objetos de hoy
	artefactos.objetos = modelo[utc];
	localStorage.pokemontoday = modelo[utc];
	localStorage.today = utc;
	localStorage.numeroErroresPreguntas = "0";
}

