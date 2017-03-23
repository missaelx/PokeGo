function inicializarBD(){
	var fosil = {
		"nombre": "No descubierto",
		"img": "icon-fosil.png"
	};
	fosil = JSON.stringify(fosil);

	for(id in idPokemon){
		if(!localStorage.getItem(idPokemon[id]))
			localStorage.setItem(idPokemon[id], fosil);
	}
}