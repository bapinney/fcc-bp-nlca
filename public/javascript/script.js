angular.module("fcc-bp-nlca", ['ui.router']);

$(function(){
    $('[data-toggle="tooltip"]').tooltip();
    if ("geolocation" in navigator) {
        console.log("Geolocation supported");
        $("#gps-icon")[0].style.display = "inline";
    }
    $("#get-location").click(function() {
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log(position.coords.latitude, position.coords.longitude);
        }); 
    });
});