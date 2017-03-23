$('#myModal').on('shown.bs.modal', function () {
    
    for(id in idPokemon){
        var pokemon = JSON.parse(localStorage.getItem(idPokemon[id]));
        $("#componentes").append('<div class="row"><img src="img/' + pokemon.img + '" class="col-md-2 icono-dex"><p class="col-md-10">'+ pokemon.nombre+'</p></div>');
    }


});

$('#myModal').on('hidden.bs.modal', function (e) {
    $("#componentes").empty();
})

