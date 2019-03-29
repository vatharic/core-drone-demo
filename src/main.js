// import * as mapStyles from './components/map-styles';
import { getField, getCurrentSelectionsModel } from './enigma/models';
import * as mqtt from './mqtt';
import { getNearestHospitals } from './components/map';

const video = document.getElementById('x-video');
let player;
window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player('x-video', {
    playerVars: {
      autoplay: 0,
      controls: 0,
      rel: 0,
      fs: 0,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
};

function onPlayerReady(event) {

}
function onPlayerStateChange(event) {
  // if (!started) {
  start();
  event.target.playVideo();
  // }
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
function animateCircle(line) {
  return new Promise((resolve) => {
    let count = 0;
    const intervalId = setInterval(() => {
      count = (count + 1) % 200;
      if (count >= 199) {
        clearInterval(intervalId);
        resolve();
      }
      const icons = line.get('icons');
      icons[0].offset = `${count / 2}%`;
      line.set('icons', icons);
    }, 20);
  });
}
