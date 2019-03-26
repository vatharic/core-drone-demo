import * as mapStyles from './map-styles';
import { getField, getCurrentSelectionsModel } from './enigma/models';
import * as mqtt from './mqtt';

const mapEl = document.querySelector('#map');
const map = new google.maps.Map(mapEl, {
  center: new self.google.maps.LatLng(32.9546827, -97.0666535, 17),
  zoom: 16,
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  disableDefaultUI: true,
  styles: mapStyles.default
});
const video = document.getElementById('x-video');
let player;
window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player('x-video', {
    playerVars: {
      'autoplay': 0,
      'controls': 0,
      'rel' : 0,
      'fs' : 0,
  },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}
let started = false;
function onPlayerReady(event) {

}
function onPlayerStateChange(event) {
  if (!started) {
    start();
    event.target.playVideo();
  }
}
const start = () => {
  started = true;
  //// MQTT comm
  mqtt.init();
  mqtt.connect();
  mqtt.subscribe('test-topic');
  mqtt.publish('test-topic', { cmd: 'alarm' });
  mqtt.unsubscribe('tes-topic');
  mqtt.disconnect();

  const lineSymbol = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 8,
    strokeColor: '#393'
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
      offset: '100%'
    }],
    map: map
  });
  animateCircle(line).then(() => {
    document.querySelector('#general_info > span').innerHTML = '<h3>Incident Found !!!</h3>\nat<br/> >> Lat: 32.9557\n<br/> >> Lng: -97.0664926';
    getNearestHospitals().then(res => {
      var hospitalsName = res.map(hospital => {
        return hospital.name;
      });
      let html = `
      <h3>Nearest hospital:</h3>
      <ul>
      ${hospitalsName.map(name => {
        return `<li>${name}</li>`;
      }).join('\n')}
      </ul>
      `;
      document.querySelector('#hospital_info > span').innerHTML = html;

      getCurrentSelectionsModel().then(model => {
        model.getLayout();
        model.on('changed', (x) => {
          model.getLayout().then(layout => {
            // console.log(layout);
          })
        });
      });
      getField('NAME').then(field => {
        field.select(hospitalsName[0], false);
      });

    });
  });
};
function animateCircle(line) {
  return new Promise(resolve => {
    let count = 0;
    const intervalId = setInterval(function () {
      count = (count + 1) % 200;
      if (count >= 199) {
        clearInterval(intervalId);
        resolve();
      }
      var icons = line.get('icons');
      icons[0].offset = (count / 2) + '%';
      line.set('icons', icons);
    }, 20);
  });
}

function getNearestHospitals() {
  return new Promise(resolve => {
    const placeService = new google.maps.places.PlacesService(map);
    const request = {
      location: { lat: 32.9557, lng: -97.0664926 }, // last position of the drone
      // radius: 5000,
      keyword: 'hospital',
      rankBy: google.maps.places.RankBy.DISTANCE,
      type: ['hospital'/*, 'police', 'fire_station'*/] // supported types can be found here -> https://developers.google.com/places/supported_types
    }
    placeService.nearbySearch(request, res => {
      resolve(res);
    });
  });
}



