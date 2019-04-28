// make sure ajax call is parent of this function
//Google Maps==============================================================================================
//https://developers.google.com/maps/documentation/javascript/geolocation




var map, infoWindow, currentMarker, marker, currentPos, pos, queryURL, lat, lng;
var activeCategories = ['vegetarian', 'vegan', 'gluten-free', 'farmers-market']



function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 32.7111966, lng: -117.1667929 },
        zoom: 14
    });
    currentPos = { lat: 32.7111966, lng: -117.1667929 }
    currentMarker = new google.maps.Marker({
        position: currentPos,
        map: map,
        title: 'You Are Here'
    });

    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            lat = position.coords.latitude
            lng = position.coords.longitude
            currentPos = {
                lat: lat,
                lng: lng
            };
            infoWindow.setPosition(currentPos);
            // infoWindow.setContent('Location found.');
            // infoWindow.open(map);
            map.setCenter(currentPos);

            //https://developers.google.com/maps/documentation/javascript/adding-a-google-map
            currentMarker = new google.maps.Marker({
                position: currentPos,
                map: map,
                title: 'You Are Here'
            });
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, currentPos) {
    infoWindow.setPosition(currentPos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}



function formatPlacesRequest() {
    let str = ''
    activeCategories.map(function(category, index) {
        str += index === 0 ? `(${category})` : ` AND (${category})`
    })
    return str
}

$('.reset').on('click', function () {
    $('.btn-secondary').attr('disabled',false);
    $('.table-hover').empty();
   });

$("#searchButton").click(function () {
    // queryURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyD0fkNiqS5pR7EwGX8Ogau_XYce-hfD2K0"
    // console.log(queryURL);
    var requestKeyword = formatPlacesRequest()
console.log('PLACES REQUEST KEYWORD', requestKeyword)
    //https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceSearchRequest
    var request = {
        type: 'restaurant',
        location: currentPos,
        radius: 1609.34 * 3,
        keyword: requestKeyword
        
    };
    $(event.target).attr('disabled',true);

    

    //https://code.luasoftware.com/tutorials/google-maps/google-places-javascript-api-query-for-places/
    var placeService = new google.maps.places.PlacesService(map);
    placeService.nearbySearch(request, function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(function (item) {
                // console.log(item);
                pos = {
                    lat: item.geometry.location.lat(),
                    lng: item.geometry.location.lng()
                };
                marker = new google.maps.Marker({
                    position: pos,
                    map: map,
                    title: item.name,
                    icon: 'assets/images/restaurantmarker.png'
                });
                //closed scope vs global
                let centerPos = pos;
                var row = $('<tr><td>' + item.name + '<br>' + item.vicinity + '<br><a href="https://www.google.com/maps/dir/' + lat + ',' + lng + '/' + item.vicinity + '" target="_blank">Get Directions</a></td></tr>');
                $('#results').append(row);
                row.click(function () {
                    map.setCenter(centerPos);
                });
            });
        }
    });
})


// AJAX call for Unsplash api
// var queryURL = "https://api.pexels.com/v1/search?query="+ accessKy +"example+query&per_page=15&page=1"
// var accessKy = "563492ad6f9170000100000107c1b4a50d344f558eb65b51b2756c56"
var foodCategories = ['vegetarian', 'vegan', 'gluten-free', 'farmers-market']

foodCategories.map(function (foodCategory) {
    replaceFoodCategoryPhoto(foodCategory)
})

function replaceFoodCategoryPhoto(category) {
    var searchTerm = getSearchTerm(category)

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.pexels.com/v1/search?query=" + searchTerm + "&per_page=15&page=1%0A",
        "method": "GET",
        "headers": {
            "Authorization": "563492ad6f9170000100000107c1b4a50d344f558eb65b51b2756c56",
        }
    }

    $.ajax(settings)
        .then(function (response) {
            //console.log(response)
            var imgUrl = response.photos[8].src.small
            var imageEl = $('img.' + category)
            imageEl.attr("src", imgUrl)
        })
}

function getSearchTerm(category) {
    switch (category) {
        case 'vegetarian':
            return 'vegetarian+food'
        case 'vegan':
            return 'vegan+meals'
        case 'gluten-free':
            return 'gluten+meals'
        case 'farmers-market':
            return 'farmers+market'

        // TODO: finish this
        default:
            return ''
    }
}


// $.ajax({
//     url: queryURL,
//     method: "GET"
//   }).then(function(response) {
//     console.log(response);
//     console.log(response.data[0].url);
//     var img = $('<img>');
//     var test = img.attr('src',response.data[0].images.downsized_large.url);
//     $('body').append(test);


//   });

// This is the function that runs when the onclick of the four food images is clicked.
$(".toggler").on("click", function () {
    var category = ""
    if (this.classList.contains('vegan')) {
        if (this.classList.contains('active')) {
            this.classList.remove('active')
            removeFromArray("vegan")
        } else {
            this.classList.add('active')
            activeCategories.push("vegan")
        }
    } else if (this.classList.contains('vegetarian')) {
        if (this.classList.contains('active')) {
            this.classList.remove('active')
            removeFromArray("vegetarian")
        } else {
            this.classList.add('active')
            activeCategories.push("vegetarian")
        }
    } else if (this.classList.contains('gluten-free')) {
        if (this.classList.contains('active')) {
            this.classList.remove('active')
            removeFromArray("gluten-free")
        } else {
            this.classList.add('active')
            activeCategories.push("gluten-free")
        }
    } else if (this.classList.contains('farmers-market')) {
        if (this.classList.contains('active')) {
            this.classList.remove('active')
            removeFromArray("farmers-market")
        } else {
            this.classList.add('active')
            activeCategories.push("farmers-market")
        }

    }

})
function removeFromArray(item) {
    for (var i = activeCategories.length-1; i>=0; i--) {
        if (activeCategories[i] === item) {
            activeCategories.splice(i, 1);
            break;       //<-- Uncomment  if only the first term has to be removed
        }
    }
}







 

   



