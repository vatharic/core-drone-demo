import * as mapStyles from './map-styles';
import svg from '../assets/drone-svgrepo-com.svg';

console.log(svg);
const started = false;

// 4041 Moodie Dr Richmond, ON K0A 2Z0 Canada -- 45.2184704,-75.7655448
const mapEl = document.querySelector('#map');
const startLocation = new self.google.maps.LatLng(45.2184704, -75.7655448, 17);

const directionService = new google.maps.DirectionsService();
const directionsDisplay = new google.maps.DirectionsRenderer();

const map = new google.maps.Map(mapEl, {
  center: startLocation,
  zoom: 15,
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  disableDefaultUI: true,
  styles: mapStyles.default,
});

directionsDisplay.setMap(map);

const ambulance = new google.maps.Marker({// 45.208779,-75.7684255
  position: new self.google.maps.LatLng(45.208779, -75.7684255, 17),
  // title:"Hello World!"
});

// ambulance.setMap(map);

console.log(ambulance);

const travelMode = google.maps.DirectionsTravelMode.DRIVING;
const request = {
  origin: { lat: 45.208779, lng: -75.7684255 },
  destination: { lat: 45.2184666, lng: -75.7655501 }, // 45.2184666,-75.7655501
  travelMode,
};
directionService.route(request, (response, status) => {
  if (status === 'OK') {
    console.log('tadam', response);
    directionsDisplay.setDirections(response);
  } else {
    window.alert(`Directions request failed due to ${status}`);
  }
}, {
  sursuppressMarkers: true,
  preserveViewport: true,
});

function getNearestHospitals() {
  return new Promise((resolve) => {
    const placeService = new google.maps.places.PlacesService(map);
    const request = {
      location: startLocation, // last position of the drone
      keyword: 'hospital',
      rankBy: google.maps.places.RankBy.DISTANCE,
      type: ['hospital'/* , 'police', 'fire_station' */], // supported types can be found here -> https://developers.google.com/places/supported_types
    };
    placeService.nearbySearch(request, (res) => {
      resolve(res);
    });
  });
}

export {
  getNearestHospitals,
};
