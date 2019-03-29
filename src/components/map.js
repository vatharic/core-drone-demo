import * as mapStyles from './map-styles';
import svg from '../assets/drone-svgrepo-com.svg';

import * as mqtt from './../mqtt'; // <- probably should be moved elsewhere

console.log(svg);

// 4041 Moodie Dr Richmond, ON K0A 2Z0 Canada -- 45.2184704,-75.7655448
const mapEl = document.querySelector('#map');
const startLocation = new google.maps.LatLng(45.2184704, -75.7655448, 17);

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
const getDirRequest = {
  origin: { lat: 45.208779, lng: -75.7684255 },
  destination: { lat: 45.2184666, lng: -75.7655501 }, // 45.2184666,-75.7655501
  travelMode,
};
directionService.route(getDirRequest, (response, status) => {
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

const start = () => {
  // // MQTT comm
  mqtt.init();
  mqtt.connect();
  mqtt.subscribe('test-topic');
  mqtt.publish('test-topic', { cmd: 'alarm' });
  mqtt.unsubscribe('tes-topic');
  mqtt.disconnect();

  const lineSymbol = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 8,
    strokeColor: '#393',
  };

  const line = new google.maps.Polyline({
    path: [
      { lat: 32.9546827, lng: -97.0666535 },
      { lat: 32.9546827, lng: -97.0665141 },
      { lat: 32.9548087, lng: -97.0664497 },
      { lat: 32.9550788, lng: -97.0663317 },
      { lat: 32.9553039, lng: -97.066321 },
      { lat: 32.9554659, lng: -97.066321 },
      { lat: 32.9555379, lng: -97.0664175 },
      { lat: 32.955664, lng: -97.0664175 },
      { lat: 32.9557, lng: -97.0664926 },
    ],
    icons: [{
      icon: lineSymbol,
      offset: '100%',
    }],
    map,
  });
  function animateCircle(l) {
    return new Promise((resolve) => {
      let count = 0;
      const intervalId = setInterval(() => {
        count = (count + 1) % 200;
        if (count >= 199) {
          clearInterval(intervalId);
          resolve();
        }
        const icons = l.get('icons');
        icons[0].offset = `${count / 2}%`;
        l.set('icons', icons);
      }, 20);
    });
  }

  animateCircle(line).then(() => {
    // document.querySelector('#general_info > span').innerHTML = '<h3>Incident Found !!!</h3>\nat<br/> >> Lat: 32.9557\n<br/> >> Lng: -97.0664926';
    console.log('<h3>Incident Found !!!</h3>\nat<br/> >> Lat: 32.9557\n<br/> >> Lng: -97.0664926');
    getNearestHospitals().then((res) => {
      const hospitalsName = res.map(hospital => hospital.name);
      const html = `
      <h3>Nearest hospital:</h3>
      <ul>
      ${hospitalsName.map(name => `<li>${name}</li>`).join('\n')}
      </ul>
      `;
      // document.querySelector('#hospital_info > span').innerHTML = html;
      console.log(html);
      getCurrentSelectionsModel().then((model) => {
        model.getLayout();
        model.on('changed', (x) => {
          model.getLayout().then((layout) => {
            // console.log(layout);
          });
        });
      });
      getField('NAME').then((field) => {
        field.select(hospitalsName[0], false);
      });
    });
  });
};

export {
  getNearestHospitals,
  start,
};
