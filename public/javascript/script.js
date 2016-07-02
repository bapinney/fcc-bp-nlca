angular.module("fcc-bp-nlca", ['ui.router']);

var currentPos;
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
    if ("geolocation" in navigator) {
        console.log("Geolocation supported");
        $("#gps-icon")[0].style.display = "inline";
    }
    $("#get-location").click(function () {
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log(position.coords.latitude, position.coords.longitude);
            currentPos = position.coords.latitude.toFixed(5) + ", " + position.coords.longitude.toFixed(5);
            console.log(currentPos);
            $("#search-box")[0].value = currentPos;
            //Fire the input trigger for the search box since it will not fire if data is programmatically inputted.  
            $("#search-box").trigger("input");
        });
    });

    //Enable or Disable the search button based on whether there is input in the search box
    $("#search-box")[0].oninput = function () {
        if ($("#search-box")[0].value.length > 0 && $("#search-button")[0].disabled) {
            $("#search-button")[0].disabled = false;
        }
        if ($("#search-box")[0].value.length == 0 && !$("#search-button")[0].disabled) {
            $("#search-button")[0].disabled = true;
        }
    };

    $("#search-box").keypress(function (event) {
        if (event.keyCode == 13) { //Enter
            $("#search-button").trigger("click");
        }
    });
    
    var getClassForStars = function(nStars) {
        switch(nStars) {
            case 0:
                return "star-img stars_0";
                break;
            case 1:
                return "star-img stars_1";
                break;
            case 1.5:
                return "star-img stars_1_half";
                break;
            case 2:
                return "star-img stars_2";
                break;
            case 2.5:
                return "star-img stars_2_half";
                break;
            case 3:
                return "star-img stars_3";
                break;
            case 3.5:
                return "star-img stars_3_half";
                break;
            case 4:
                return "star-img stars_4";
                break;
            case 4.5:
                return "star-img stars_4_half";
                break;
            case 5:
                return "star-img stars_5";
                break;
            default:
                console.error("Unexpected value for nStars: " + nStars);
        }
    };

    $("#search-button").click(function () {
        var searchQuery = $("#search-box")[0].value;
        if (searchQuery.length < 1) {
            return false;
        }
        $.ajax({
            method: "POST",
            url: "/search",
            data: { query: searchQuery }
        })
        .done(function(res) {
           console.dir(res); 
        });
    });
});
