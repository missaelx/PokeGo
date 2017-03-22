var media;
var isAndroid = false;
var mediaStatus;

function getMediaURL(s) {
    if(isAndroid) return "/android_asset/www/" + s;
    return s;
}

function mediaError(e) {
    console.log('mediaError', e);
}

function onMediaStatus(status) {
    if(isAndroid && status === Media.MEDIA_STOPPED) {
        mediaStatus = 2;
        media.seekTo(0);
        media.play();
    }
}

function doMenu(){
    alert("Boton menu :)");
}

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
        document.addEventListener('offline', onOffline, false);
        document.addEventListener('pause', function(){
            if(mediaStatus == 2){
                media.pause();
                mediaStatus = 0;
            }    
        }, false);
        document.addEventListener('resume', function(){
            if(mediaStatus != 2){
                media.play();
                mediaStatus = 2; //playing
            }
        }, false);
        
        navigator.app.overrideButton("menubutton", true);

        document.addEventListener("menubutton", function(){
            alert("Hola");
        }, false);


        incializarObjetos();
        incializarMapa();

        isAndroid = true; //cambiar al desplegar en IOS
        media = new Media(getMediaURL('music/Missa App.mp3'), null, mediaError, onMediaStatus);
        media.play({numberOfLoops:9999});
        mediaStatus = 2; //playing   

        $("#show").click(function(){
            showDropdown();
        });
        
    }

};

app.initialize();


