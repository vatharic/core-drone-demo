import { init, startAnimation } from './components/map/map';
import './components/kpi/kpi';
import './components/video/video';
import { getHypercubeModel, getField } from './enigma/models';


const updateKPIs = (layout) => {
  const hyperCube = layout.qHyperCube;
  const headers = hyperCube.qDimensionInfo.map(dim => dim.qFallbackTitle);
  const data = {};
  headers.forEach((header, i) => {
    data[header] = hyperCube.qDataPages[0].qMatrix[0][i].qText;
  });
  document.querySelector('.info1_container').innerHTML = data.Bodies;
  document.querySelector('.info2_container').innerHTML = data.Responder;
  document.querySelector('.info3_container').innerHTML = data.HazMats;
  document.querySelector('.info4_container').innerHTML = data.Score;

  document.querySelector('#console code').innerHTML = data.Recommendation;
};

async function startApp() {
  const hyperCubeModel = await getHypercubeModel();
  await hyperCubeModel.getLayout();
  const field = await getField('Index');
  const update = () => {
    hyperCubeModel.getLayout().then((layout) => {
      updateKPIs(layout);
    });
  };
  hyperCubeModel.on('changed', update);
  // update();
  await field.clear();
  let count = 0;
  const intervalId = setInterval(() => {
    count = (count + 1) % 60;
    if (count >= 59) {
      clearInterval(intervalId);
    }
    field.select(count.toString(), true);
  }, 2000);
}


function onPlayerReady() { }
function onPlayerStateChange() {
  // start();
  // event.target.playVideo();
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

init();
// getCurrentSelectionsModel();

// const videoElement = document.getElementById('live_feed');
// videoElement.addEventListener('play', () => {
//   startAnimation();
// }, true);
// console.log(videoElement);

setTimeout(() => {
  console.log('Incident FOUND !!!!');
  startAnimation().then(() => {
    console.log('Arrived at destination');
    // apply selections
    startApp();
  });
}, 5000);
