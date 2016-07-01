angular.module("fcc-bp-nlca", ['ui.router']);

var currentPos;
$(function(){
    $('[data-toggle="tooltip"]').tooltip();
    if ("geolocation" in navigator) {
        console.log("Geolocation supported");
        $("#gps-icon")[0].style.display = "inline";
    }
    $("#get-location").click(function() {
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log(position.coords.latitude, position.coords.longitude);
            currentPos = position.coords.latitude.toFixed(5) + ", " + position.coords.longitude.toFixed(5);
            console.log(currentPos);
            $("#search-box")[0].value = currentPos;
            $("#search-box").trigger("input");
        }); 
    });
    $("#search-box")[0].oninput = function() {
        if($("#search-box")[0].value.length > 0 && $("#search-button")[0].disabled) {
            $("#search-button")[0].disabled = false;
        }
        if($("#search-box")[0].value.length == 0 && !$("#search-button")[0].disabled) {
            $("#search-button")[0].disabled = true;
        }
    };
});