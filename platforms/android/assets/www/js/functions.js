var Latitude = undefined;
var Longitude = undefined;
var map;
var markers = [];

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
function onOnline(){
    //alert("Tienes conexión al mundo");
}

function vigilarPosicion(){
	function getMap(latitude, longitude) {

	    markers[0].map = null;
	    // Add a maker
		map.addMarker({
			position: {lat: latitude, lng: longitude},
			// icon: {
			// 	url: "www/img/marker-jobs.png"
			// },
			animation: plugin.google.maps.Animation.BOUNCE
		}, function(marker) {

			markers[0] = marker;

			// Catch the click event
			marker.on(plugin.google.maps.event.INFO_CLICK, function() {
				// To do something...
				alert("Hello world!");
			});
		});

	}



    function actualizarMapa(position){
    	var updatedLatitude = position.coords.latitude;
	    var updatedLongitude = position.coords.longitude;

	    if (updatedLatitude != Latitude || updatedLongitude != Longitude) {

	        Latitude = updatedLatitude;
	        Longitude = updatedLongitude;

	        getMap(updatedLatitude, updatedLongitude);
	    }
	}

    
    function onError(error) {
    	if(error.code == PositionError.PERMISSION_DENIED){
    		navigator.notification.alert("La aplicacion necesita permiso para acceder a tu posicion", null , "Permiso denegado", ["Aceptar"])
    	} else if(error.code) {
    		navigator.notification.alert("Imposible acceder a tu posicion", null, "Fuera de cobertura", ["Aceptar"])
    	}
    }

    
    var watchID = navigator.geolocation.watchPosition(actualizarMapa, onError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });

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
							url: "www/img/marker-jobs.png"
						},
						animation: plugin.google.maps.Animation.BOUNCE
					}, function(marker) {

						markers[0] = marker;

						// Catch the click event
						marker.on(plugin.google.maps.event.INFO_CLICK, function() {
							// To do something...
							alert("Hello world!");
						});
					});

					vigilarPosicion();
			});
		}, function(){
			alert("Imposible construir mapa porque no hay acceso a la geolocalizacion")
		});

		
	}


	// Wait until the map is ready status.
	map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);
}
