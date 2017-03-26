$('#myModal').on('shown.bs.modal', function () {
    for(id in idPokemon){
        var pokemon = JSON.parse(localStorage.getItem(idPokemon[id]));
        $("#componentes").append('<div class="row"><img src="img/' + pokemon.img + '" class="col-md-2 icono-dex"><p class="col-md-10">'+ pokemon.nombre+'</p></div>');
    }

    var numComponentesCapturados = 0;
    for(i in idPokemon){
		var item = JSON.parse(localStorage.getItem(idPokemon[i]));
		if(item.nombre != "No descubierto"){
			numComponentesCapturados++;
		}
    }
    $("#statComponentes").html(numComponentesCapturados);
    $("#errorRespuestas").html(localStorage.numeroErroresPreguntas);
});

$('#myModal').on('hidden.bs.modal', function (e) {
    $("#componentes").empty();
})

//$('#myModalPregunta').on('shown.bs.modal', function () {
    
//});

function llenarPreguntas(pokemon){
	var pokePregunta = preguntas[pokemon.id].pregunta;
	var pokeRespuestas = preguntas[pokemon.id].respuestas;
	var correcta = preguntas[pokemon.id].indiceRespCorrecta;

	//guardamos el pokemon para el evento ocultar
	$("#preguntas").append(
		"<input type='hidden' id='pokemonElegido' value='" + JSON.stringify(pokemon) + "'>"
		);	

	$("#preguntas").append('<p><strong>' + pokePregunta + '</strong></p>');
	for(i in pokeRespuestas){
		if(i == correcta){
			$("#preguntas").append(
				'<div class="radio"><label><input data-correcta="1" type="radio" name="pokeOpcion" value="'+ i +'">'+ pokeRespuestas[i] +'</label></div>'
				);
		} else {
			$("#preguntas").append(
				'<div class="radio"><label><input data-correcta="0" type="radio" name="pokeOpcion" value="'+ i +'">'+ pokeRespuestas[i] +'</label></div>'
				);
		}
	}
	$('#myModalPregunta').modal('show');
}

$('#myModalPregunta').on('hidden.bs.modal', function (e) {
	var pokemon = JSON.parse($("#pokemonElegido").val());

	var respuestaAlumno = $('input[name="pokeOpcion"]:checked').data("correcta");
	if(respuestaAlumno == 1){ //si es correcta
		navigator.notification.alert(
		    'Felicidades has atrapado un nuevo componente, ahora se ha registrado en la InfoDex',  // message
		    null,         // callback
		    'Componente capturado',            // title
		    'Entendido'                  // buttonName
		);
		localStorage.setItem(pokemon.id, JSON.stringify(pokemon) );
	} else{
		navigator.notification.alert(
		    'Tu respuesta no fue acertada, intentalo de nuevo',  // message
		    null,         // callback
		    'Respuesta incorrecta',            // title
		    'Entendido'                  // buttonName
		);
		localStorage.numeroErroresPreguntas = parseInt(localStorage.numeroErroresPreguntas) + 1 + "";
	}
    $("#preguntas").empty();
})