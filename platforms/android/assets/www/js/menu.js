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
    $("#computadorasArmadas").html(localStorage.numeroComputadoras);
});

$('#myModal').on('hidden.bs.modal', function (e) {
    $("#componentes").empty();
})



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

		//preguntamos si se completo alguna computadora
		var computadoraArmadasPrevioCaptura = parseInt(localStorage.numeroComputadoras);
		var computadoraArmadasConEstaCaptura = calcularComputadorasArmadas();
		if(computadoraArmadasConEstaCaptura > computadoraArmadasPrevioCaptura){
			navigator.notification.alert(
			    'Felicidades has completado una nueva computadora',  // message
			    null,         // callback
			    'Computadora armada',            // title
			    'Entendido'                  // buttonName
			);
			localStorage.numeroComputadoras = computadoraArmadasConEstaCaptura + "";
		}

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





function calcularComputadorasArmadas(){
	var cpu = 0;
	var fuentedepoder = 0;
	var gabinete = 0;
	var discoduro = 0;
	var monitor = 0;
	var mouse = 0;
	var tarjetadered = 0;
	var noBreak = 0;
	var memoriaram = 0;
	var sistemaoperativo = 0;
	var tarjetamadre = 0;
	var teclado = 0;
	var tarjetadevideo = 0;

	//maximas compus = 4

	for(i in idPokemon){
		var item = JSON.parse(localStorage.getItem(idPokemon[i]));
		if(item.nombre.includes("CPU"))
			cpu++;
		else if(item.nombre.includes("poder"))
			fuentedepoder++;
		else if(item.nombre.includes("Gabinete"))
			gabinete++;
		else if(item.nombre.includes("duro"))
			discoduro++;
		else if(item.nombre.includes("Monitor"))
			monitor++;
		else if(item.nombre.includes("Mouse"))
			mouse++;
		else if(item.nombre.includes("red"))
			tarjetadered++;
		else if(item.nombre.includes("NoBreak"))
			noBreak++;
		else if(item.nombre.includes("ram"))
			memoriaram++;
		else if(item.nombre.includes("operativo"))
			sistemaoperativo++;
		else if(item.nombre.includes("madre"))
			tarjetamadre++;
		else if(item.nombre.includes("Teclado"))
			teclado++;
		else if(item.nombre.includes("video"))
			tarjetadevideo++;
    }

    var numeroComputadoras = 4;
    if(cpu < numeroComputadoras)
    	numeroComputadoras = cpu;
	if(fuentedepoder < numeroComputadoras)
		numeroComputadoras = fuentedepoder;
	if(gabinete < numeroComputadoras)
		numeroComputadoras = gabinete;
	if(discoduro < numeroComputadoras)
		numeroComputadoras = discoduro;
	if(monitor < numeroComputadoras)
		numeroComputadoras = monitor;
	if(mouse < numeroComputadoras)
		numeroComputadoras = mouse;
	if(tarjetadered < numeroComputadoras)
		numeroComputadoras = tarjetadered;
	if(noBreak < numeroComputadoras)
		numeroComputadoras = noBreak;
	if(memoriaram < numeroComputadoras)
		numeroComputadoras = memoriaram;
	if(sistemaoperativo < numeroComputadoras)
		numeroComputadoras = sistemaoperativo;
	if(tarjetamadre < numeroComputadoras)
		numeroComputadoras = tarjetamadre;
	if(teclado < numeroComputadoras)
		numeroComputadoras = teclado;
	if(tarjetadevideo < numeroComputadoras)
		numeroComputadoras = tarjetadevideo;

	return numeroComputadoras;

}















