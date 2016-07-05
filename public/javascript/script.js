var nlcaApp = angular.module("fcc-bp-nlca", ['ui.router']);

var currentPos;

$(function () { //Document Ready
    var performSearch = function() {
        var searchQuery = $("#search-box")[0].value;
        document.location.hash = "/search/" + encodeURIComponent(searchQuery);
        if (searchQuery.length < 1) {
            return false;
        }
        $.ajax({
                method: "POST",
                url: "/search",
                data: {
                    query: searchQuery
                }
        })
        .done(function (res) {
            console.dir(res);
            displayResults(res);
        });
    }
    
    if (sessionStorage.getItem("lastURL") !== null) {
        var redirectTo = sessionStorage.getItem("lastURL");
        sessionStorage.removeItem("lastURL");
        window.location.href = redirectTo;
    }
    if (window.location.hash.split("/")[1] == "search") {
        $("#search-box")[0].value = decodeURIComponent(window.location.hash.split("/")[2]);
        $("#search-button").removeAttr("disabled")
        performSearch();
    }
    
    $('[data-toggle="tooltip"]').tooltip();
    if ("geolocation" in navigator) {
        console.log("Geolocation supported");
        $("#gps-icon")[0].style.display = "inline";
    }

    var gpsAnimEnd = function (e) {
        if (e.type == "animationend") {
            $("#search-box").removeClass("gpsFetch");
        }
    }

    var enterSearchUIFeedback = function (e) {
        if (e.type == "animationend") {
            $("#search-button").removeClass("enterKeyFB");
        }
    }

    document.getElementById("search-box").addEventListener("animationend", gpsAnimEnd, false);

    document.getElementById("search-box").addEventListener("animationend", enterSearchUIFeedback, false);

    $("#get-location").click(function () {
        $("#search-box").addClass("gpsFetch");
        navigator.geolocation.getCurrentPosition(function (position) {
            $("#get-location").fadeOut();
            //console.log(position.coords.latitude, position.coords.longitude);
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
            $("#search-button").addClass("enterKeyFB");
        }
    });

    $("#search-box").focusin(function () {
        $("#search-span").addClass("sb-focus");
    });

    $("#search-box").focusout(function () {
        $("#search-span").removeClass("sb-focus");
    });

    var getClassForStars = function (nStars) {
        switch (nStars) {
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
        performSearch();
    });
    
    var displayResults = function (res) {
        //Remove any previous results before displaying new ones...
        $("#results-table tbody").empty();

        var resTable = $("#results-table");
        for (var i = 0; i < 20; i++) {
            var listingName = res.businesses[i].name;
            var listingRating = res.businesses[i].rating;
            var listingImg = res.businesses[i].image_url;
            var listingDesc = res.businesses[i].snippet_text;
            var listingUrl = res.businesses[i].url;
            var listingId = res.businesses[i].id;

            var infoHT = "patron info here";
            var row = $("<tr></tr>");
            var cell = $("<td></td>");
            var lnDiv = $("<div></div>");

            lnDiv.addClass("listing-name");

            var lnA = $("<a></a>");
            lnA.attr("href", listingUrl);
            lnA.text(listingName);

            lnDiv.append(lnA);

            var hr = $("<hr>");

            var liDiv = $("<div></div>");
            liDiv.addClass("listing-image");
            var liImg = $("<img>");
            liImg.attr("src", listingImg);
            liDiv.append(liImg);

            var liRatingDiv = $("<div></div>");
            liRatingDiv.addClass("ratings-div");
            var liRatingI = $("<i></i>");
            var ratingClass = "stars_" + Math.floor(listingRating);
            if (listingRating % 1 == 0.5) {
                ratingClass += "_half";
            }
            liRatingI.addClass("star-img " + ratingClass);
            liRatingDiv.append(liRatingI);

            var liListingDescDiv = $("<div></div>");
            liListingDescDiv.addClass("listing-desc");

            var liDescDiv = $("<div></div>");
            liDescDiv.addClass("desc-div");
            liDescDiv.text(listingDesc);

            var patronsDiv = $("<div></div>");
            patronsDiv.addClass("patrons-div");

            var patronsButton = $("<button></button>");
            patronsButton.attr("data-listing-id", listingId);
            patronsButton.attr("data-button-type", "patrons");
            patronsButton.text("Dummy text");
            patronsDiv.append(patronsButton);

            liListingDescDiv.append(liRatingDiv).append(liDescDiv);
            console.log("Appending patrons div");
            liListingDescDiv.append(patronsDiv);

            cell.append(lnDiv).append(hr).append(liDiv).append(liListingDescDiv);

            row.append(cell);

            resTable.append(row);
        }
        
        //Register event listeners for these newly-created buttons
        $("button[data-button-type=patrons]").click(function (e) {
            console.dir(e.currentTarget.dataset);
            var listingId = e.currentTarget.dataset.listingId;
            $.ajax({
                url: "imgoing",
                data: {
                    listingId: listingId
                },
                
                type: "POST",
                
                dataType: "json",
                
                complete: function(jqxhr, status) {
                    console.dir(jqxhr.status);
                    console.log("completeddd!!");
                    if (jqxhr.status === 401) {
                        console.error("You are not signed in...");
                        sessionStorage.setItem("lastURL", window.location.href);
                        window.location.href = "/auth/twitter";
                    }
                }
            });            
            console.log("Ow");
        });
    };


});