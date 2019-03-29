import { start, started } from './components/map';

function onPlayerReady() { }
function onPlayerStateChange(event) {
  if (!started) {
    start();
    event.target.playVideo();
  }
}
window.onYouTubeIframeAPIReady = () => new YT.Player('x-video', {
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
