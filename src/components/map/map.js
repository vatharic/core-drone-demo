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

const ambulancesArr = [];
const fireTrucksArr = [];
let drone = null;

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
      }, 20);
    });
  }

  return animateCircle(line);
}

const init = () => {
  _initIncident(); // should be delayed ??

  drone = _initDrone();
  ambulancesArr.push(_initAmbulancee());
  ambulancesArr.push(_initAmbulance('ambulance1'));
  ambulancesArr.push(_initAmbulance('ambulance2'));
  ambulancesArr.push(_initAmbulance('ambulance3'));
  ambulancesArr.push(_initAmbulance('ambulance4'));

  fireTrucksArr.push(_initFireTruck('firetruck1'));
  fireTrucksArr.push(_initFireTruck('firetruck2'));
  fireTrucksArr.push(_initFireTruck('firetruck3'));
};

const startAnimation = () => {
  _initIncident(); // maybe should be delayed
  ambulancesArr.forEach((ambulance) => {
    _animateVehicule(ambulance);
  });
  fireTrucksArr.forEach((fireTruck) => {
    _animateVehicule(fireTruck);
  });
  return _animateVehicule(drone);
};

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
  startAnimation,
  init,
};
