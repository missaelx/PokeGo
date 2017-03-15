var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        alert("Hola");
        document.addEventListener('offline', onOffline, false);
        document.addEventListener('online', onOnline, false);
        vigilarPosicion();
    },
    

};

app.initialize();


