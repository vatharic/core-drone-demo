import * as mapStyles from './map-styles';
import droneSymbolPath from '../../assets/drone.svg';
import ambulanceSymbolPath from '../../assets/ambulance.svg';
import firetruckSymbolPath from '../../assets/firetruck.svg';
import { getCurrentSelectionsModel, getField } from '../../enigma/models';
import {
  routeAmbulance,
  droneRoute,
  ambulances,
  firetrucks,
} from './map-routes';

import * as mqtt from '../../mqtt'; // <- probably should be moved elsewhere

// 4041 Moodie Dr Richmond, ON K0A 2Z0 Canada -- 45.2184704,-75.7655448
const mapEl = document.querySelector('#map');
const startLocation = new google.maps.LatLng(45.2184704, -75.7655448, 17);

const map = new google.maps.Map(mapEl, {
  center: new google.maps.LatLng(45.2424415, -75.7128212), // startLocation,
  zoom: 10,
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  disableDefaultUI: true,
  styles: mapStyles.default,
});

function _initFireTruck(firetruck) {
  const lineSymbol = {
    path: firetruckSymbolPath,
    scale: 0.05,
    fillOpacity: 0,
    strokeColor: 'white',
    strokeWeight: 1,
  };
  return new google.maps.Polyline({
    path: firetrucks[firetruck].default,
    icons: [{
      icon: lineSymbol,
      offset: '0%',
    }],
    strokeColor: 'rgba(255, 255, 0, 0.1)',
    map,
  });
}

function _initAmbulance(ambulance) {
  const lineSymbol = {
    path: ambulanceSymbolPath,
    scale: 0.05,
    fillOpacity: 0,
    strokeColor: 'white',
    strokeWeight: 1,
  };
  return new google.maps.Polyline({
    path: ambulances[ambulance].default,
    icons: [{
      icon: lineSymbol,
      offset: '0%',
    }],
    strokeColor: 'rgba(255, 255, 0, 0.1)',
    map,
  });
}


// function _initFiretruckSC90() {
//   const lineSymbol = {
//     path: firetruckSymbolPath,
//     scale: 0.05,
//     fillOpacity: 0,
//     strokeColor: 'white',
//     strokeWeight: 1,
//   };
//   return new google.maps.Polyline({
//     path: firetruckSC90.default,
//     icons: [{
//       icon: lineSymbol,
//       offset: '0%',
//     }],
//     strokeColor: 'rgba(255, 255, 0, 0.1)',
//     map,
//   });
// }

// function _initAmbulance4b01() {
//   const lineSymbol = {
//     path: ambulanceSymbolPath,
//     scale: 0.05,
//     fillOpacity: 0,
//     strokeColor: 'white',
//     strokeWeight: 1,
//   };
//   return new google.maps.Polyline({
//     path: ambulance4b01.default,
//     icons: [{
//       icon: lineSymbol,
//       offset: '0%',
//     }],
//     strokeColor: 'rgba(255, 255, 0, 0.1)',
//     map,
//   });
// }

// function _initAmbulance4b03() {
//   const lineSymbol = {
//     path: ambulanceSymbolPath,
//     scale: 0.05,
//     fillOpacity: 0,
//     strokeColor: 'white',
//     strokeWeight: 1,
//   };
//   return new google.maps.Polyline({
//     path: ambulance4b03.default,
//     icons: [{
//       icon: lineSymbol,
//       offset: '0%',
//     }],
//     strokeColor: 'rgba(255, 255, 0, 0.1)',
//     map,
//   });
// }

// function _initAmbulance4b04() {
//   const lineSymbol = {
//     path: ambulanceSymbolPath,
//     scale: 0.05,
//     fillOpacity: 0,
//     strokeColor: 'white',
//     strokeWeight: 1,
//   };
//   return new google.maps.Polyline({
//     path: ambulance4b04.default,
//     icons: [{
//       icon: lineSymbol,
//       offset: '0%',
//     }],
//     strokeColor: 'rgba(255, 255, 0, 0.1)',
//     map,
//   });
// }

function _initAmbulancee() {
  const lineSymbol = {
    path: ambulanceSymbolPath,
    scale: 0.05,
    fillOpacity: 0,
    strokeColor: 'white',
    strokeWeight: 1,
  };
  return new google.maps.Polyline({
    path: routeAmbulance,
    icons: [{
      icon: lineSymbol,
      offset: '0%',
    }],
    strokeColor: 'rgba(255, 255, 0, 0.1)',
    map,
  });
}

function _initDrone() {
  const lineSymbol = {
    path: droneSymbolPath,
    scale: 0.05,
    fillOpacity: 0,
    strokeColor: '#8b0000',
    strokeWeight: 1,
  };
  return new google.maps.Polyline({
    path: droneRoute,
    icons: [{
      icon: lineSymbol,
      offset: '0%',
    }],
    strokeColor: 'rgba(255, 255, 0, 0.1)',
    map,
  });
}

function _initIncident() {
  const incident = new google.maps.Marker({ // 45.2184704,-75.7655448
    position: new google.maps.LatLng(45.2184704, -75.7655448),
    icon: './assets/incident.svg',
    map,
  });
  let blinking = false;
  setInterval(() => {
    if (blinking) {
      incident.setMap(null);
    } else {
      incident.setMap(map);
    }
    blinking = !blinking;
  }, 1000);
}

function _animateVehicule(line) {
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
      }, 60);
    });
  }

  return animateCircle(line);
}


const startAnimation = () => {
  const ambulance = _initAmbulancee();
  const firetruck1 = _initFireTruck('firetruck1');
  const firetruck2 = _initFireTruck('firetruck2');
  const firetruck3 = _initFireTruck('firetruck3');

  const ambulance1 = _initAmbulance('ambulance1');
  const ambulance2 = _initAmbulance('ambulance2');
  const ambulance3 = _initAmbulance('ambulance3');
  const ambulance4 = _initAmbulance('ambulance4');

  const drone = _initDrone();
  _initIncident(); // maybe should be delayed

  _animateVehicule(firetruck1);
  _animateVehicule(firetruck2);
  _animateVehicule(firetruck3);
  _animateVehicule(ambulance);
  _animateVehicule(ambulance1);
  _animateVehicule(ambulance2);
  _animateVehicule(ambulance3);
  _animateVehicule(ambulance4);

  _animateVehicule(drone);
};

startAnimation();

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
  // started = true;
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
    path: routeAmbulance,
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
    // document.querySelector('#general_info > span').innerHTML =
    // '<h3>Incident Found !!!</h3>\nat<br/> >> Lat: 32.9557\n<br/> >> Lng: -97.0664926';
    // console.log('<h3>Incident Found !!!
    // </h3>\nat<br/> >> Lat: 32.9557\n<br/> >> Lng: -97.0664926');
    getNearestHospitals().then((res) => {
      const hospitalsName = res.map(hospital => hospital.name);
      // const html = `
      // <h3>Nearest hospital:</h3>
      // <ul>
      // ${hospitalsName.map(name => `<li>${name}</li>`).join('\n')}
      // </ul>
      // `;
      // document.querySelector('#hospital_info > span').innerHTML = html;
      // console.log(html);
      getCurrentSelectionsModel().then((model) => {
        model.getLayout();
        model.on('changed', (x) => {
          model.getLayout().then((layout) => {
            console.log(layout, x);
          });
        });
      });
      getField('NAME').then((field) => {
        field.select(hospitalsName[0], false);
      });
    });
  });
};
// start();
export {
  getNearestHospitals,
  start,
};
