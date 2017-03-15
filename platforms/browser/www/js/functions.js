var Latitude = undefined;
var Longitude = undefined;


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

	    var mapOptions = {
	        center: new google.maps.LatLng(0, 0),
	        zoom: 1,
	        mapTypeId: google.maps.MapTypeId.ROADMAP
	    };

	    map = new google.maps.Map
	    (document.getElementById("mapa"), mapOptions);


	    var latLong = new google.maps.LatLng(latitude, longitude);

	    var marker = new google.maps.Marker({
	        position: latLong
	    });

	    marker.setMap(map);
	    map.setZoom(15);
	    map.setCenter(marker.getPosition());
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
    		navigator.notification.alert("La aplicacion necesita permiso para acceder a tu posicion", , "Permiso denegado", ["Aceptar"])
    	} else if(error.code) {
    		navigator.notification.alert("Imposible acceder a tu posicion", , "Fuera de cobertura", ["Aceptar"])
    	}
    }

    
    var watchID = navigator.geolocation.watchPosition(actualizarMapa, onError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });

}