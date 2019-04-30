import { LitElement, html } from 'lit-element';
import { getHypercubeModel, getField } from '../enigma/models';

import { init, topic } from '../mqtt/mqtt';

import { mockData } from '../mqtt/mock-mqtt-msg';

import '../components/map/map';
import '../components/kpi/kpi';
import '../components/video/video';

import css from './act1.css';

class Act1Page extends LitElement {
  constructor() {
    super();
    this.mqttClient = null;
  }

  firstUpdated() {
    const map = document.querySelector('.map_container');
    /**
     * #1 incident reported:
     *     -> init incident icon (blinking)
     *     -> init drone
     *     -> drone live video (ToDo)
     *     -> start drone animation to incident
     */
    setTimeout(map._initIncident.bind(map), 2000);
    setTimeout(() => {
      map._panTo(45.2184704, -75.7655448);
    }, 3500);
    setTimeout(() => {
      map._smoothZoom(14, 10, 60);
    }, 5000);
    setTimeout(() => {
      const drone = map._initDrone.apply(map);
      const videoUrlStream = (new URL(document.location.href)).searchParams.get('video_url');
      map._animateDrone(drone).then(() => {
        map._smoothZoom(17, 14, 60);
        const videoEvent = new CustomEvent('playVideo', {
          detail: {
            type: 'video/webm',
            src: videoUrlStream || './assets/Act_1-labelled.test9.webm',
          },
        });
        window.dispatchEvent(videoEvent);
        this.startApp();
      });
    }, 7000);
    /**
     * #2 incident analysed:
     *     -> video running
     *     -> apply selections to Qlik App (according to Chuck's timing)
     *     -> display recomendations & score
     *     -> smooth switch to act-2
     */
  }

  createRenderRoot() {
    /**
     * Render template in light DOM. Note that shadow DOM features like
     * encapsulated CSS are unavailable.
     */
    return this;
  }

  render() {
    return html`
      <style>${css}</style>
      <div class="grid-container">
        <cd-video class="video_container"></cd-video>
        <cd-kpi id="general_info" class="info1_container" title="Bodies detected">0</cd-kpi>
        <cd-kpi id="hospital_info" class="info2_container" title="Vehicules detected">0</cd-kpi>
        <cd-kpi class="info3_container" title="Hazards">0</cd-kpi>
        <cd-kpi class="info4_container" title="Risk Score">0</cd-kpi>
        <cd-map zoom="10" lat="45.4026235" lng="-75.8112476" class="map_container"></cd-map>
        <div id="console" class="rec_container">
          <h3>Recommendations</h3>
          <pre><code></code></pre>
        </div>
      </div>
    `;
  }

  updateKPIs(layout) {
    const hyperCube = layout.qHyperCube;
    const headers = hyperCube.qDimensionInfo.map(dim => dim.qFallbackTitle);
    const data = {};
    headers.forEach((header, i) => {
      data[header] = hyperCube.qDataPages[0].qMatrix[0][i].qText;
    });
    this.querySelector('.info1_container').innerHTML = data.Bodies;
    this.querySelector('.info2_container').innerHTML = data.Vehicles;
    this.querySelector('.info3_container').innerHTML = data.Hazmats;
    this.querySelector('.info4_container').innerHTML = data['Risk Score'];

    this.querySelector('#console code').innerHTML = data.Recommendation;
  }

  async startApp() {
    const hyperCubeModel = await getHypercubeModel();
    await hyperCubeModel.getLayout();
    const field = await getField('Elapsed Time');

    const update = () => {
      hyperCubeModel.getLayout().then((layout) => {
        this.updateKPIs(layout);
      });
    };
    hyperCubeModel.on('changed', update);
    await field.clear();

    const msgCallBack = (msg) => {
      const msgObject = JSON.parse(msg.payloadString);
      field.lowLevelSelect([msgObject.index], false);
    };
    init(msgCallBack).then((client) => {
      this.mqttClient = client;
      this.mqttClient.subscribe(topic);

      let count = 0;
      const intervalId = setInterval(() => {
        count = (count + 1) % mockData.length;
        if (count >= mockData.length - 1) {
          clearInterval(intervalId);
        }
        mockData[count].index = count;
        const message = new Paho.MQTT.Message(JSON.stringify(mockData[count]));
        message.destinationName = topic;
        this.mqttClient.send(message);
      }, 1000);
    });
  }
}
customElements.define('act-1', Act1Page);
