// import * as mapStyles from './components/map-styles';
import { getField, getCurrentSelectionsModel } from './enigma/models';

import { start, getNearestHospitals } from './components/map';

const video = document.getElementById('x-video');
let player;
function onPlayerReady() { }
function onPlayerStateChange(event) {
  // if (!started) {
  start();
  event.target.playVideo();
  // }
}
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
