// Initialize and add the map
var  map;
var marker
var geocoder;
function initMap() {
    // The location of Uluru
    const uluru = { lat: -2.1301054, lng: -79.9197052 };
    // The map, centered at Uluru
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 18,
      center: uluru,
    });
    // The marker, positioned at Uluru
    marker = new google.maps.Marker({
      position: uluru,
      map: map,
    });

    geocoder = new google.maps.Geocoder();
    

    map.addListener("click", (mapsMouseEvent) => {
      var latlng = mapsMouseEvent.latLng;
      marker.setPosition(latlng);
      geocodeLatLng(geocoder, latlng);
      document.getElementById("lat").value = latlng.lat();
      document.getElementById("lng").value = latlng.lng();
    });
  }

function cambiarPosicion(_lat, _lng){
    var latlng = { lat: _lat, lng: _lng };
     marker.setPosition(latlng);
     geocodeLatLng(geocoder, latlng);
     document.getElementById("lat").value = _lat;
     document.getElementById("lng").value = _lng;
     var latlng = new google.maps.LatLng(_lat, _lng);
     map.setCenter(latlng);
}

  function geocodeLatLng(geocoder, latlng) {
    geocoder
      .geocode({ location: latlng })
      .then((response) => {
        if (response.results[0]) {

          var direccion = response.results[0].formatted_address;    
          document.getElementById("direccion").value =  direccion;
          document.getElementById("direccionC").value =  direccion;
          try{
            if(response.results[0].address_components.length > 1){
              var objSector = response.results[0].address_components[1];
              var arrTipo =objSector.types;
              for (var i = 0; i < arrTipo.length; i++){
                if(arrTipo[i] ===  "sublocality"){
                  document.getElementById("sector").value =  objSector.long_name;                 
                }
                
              }                             
              
            }
          } catch(e){
            console.log(e);
          }    
        } else {
          window.alert("No results found");
        }
      })
      .catch((e) => window.alert("Geocoder failed due to: " + e));
  }