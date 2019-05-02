import { LitElement, html } from 'lit-element';
import { getHypercubeModelAct2, getField } from '../enigma/models';

import '../components/map/map';
import '../components/kpi/kpi';
import '../components/video/video';

import css from './act2.css';

class Act2Page extends LitElement {
  firstUpdated() {
    const map = document.querySelector('.map_container');
    const videoEvent = new CustomEvent('playVideo', {
      detail: {
        type: 'video/webm',
        src: './assets/Act_2_cropped.webm',
      },
    });
    setTimeout(async () => {
      map._initIncident.bind(map);
      window.dispatchEvent(videoEvent);

      const hyperCubeModel = await getHypercubeModelAct2();
      await hyperCubeModel.getLayout();
      const field = await getField('A2 Elapsed Time');

      const update = () => {
        hyperCubeModel.getLayout().then((layout) => {
          this.updateKPIs(layout);
        });
      };
      hyperCubeModel.on('changed', update);
      await field.clear();

      let count = 0;
      // 3:57 => 60 * 3 + 57 sec == 237sec
      const intervalId = setInterval(() => {
        count = (count + 1) % 237;
        if (count >= 237 - 1) {
          clearInterval(intervalId);
        }
        field.lowLevelSelect([count], false);
      }, 1000);
    }, 1000);

    // ft1 30s
    // amb1 1:04m
    // amb2 2:20m

    setTimeout(() => map._initAndAnimateDroneAct2(), 1000);
    setTimeout(() => map._smoothZoom(2), 2000);
    setTimeout(() => map._initAndAnimateAmbulance('ambulance1'), 5000);
    setTimeout(() => map._initAndAnimateAmbulance('ambulance2'), 5000);
    setTimeout(() => map._initAndAnimateAmbulance('ambulance3'), 5000);
    setTimeout(() => map._initAndAnimateFiretruck('firetruck1'), 5000);
    setTimeout(() => map._initAndAnimateFiretruck('firetruck2'), 5000);
    setTimeout(() => {
      const hospitals = map.getNearestHospitals();
      const hospHtml = hospitals.map(h => `<span>${h.name}</span><br/>`);
      this.querySelector('#console code').innerHTML = `<h4>Closest Hospitals:</h4>${hospHtml.join('')}`;
    }, 12000);
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
        <cd-kpi id="general_info" class="info1_container" title="Injured on scene">0</cd-kpi>
        <cd-kpi id="hospital_info" class="info2_container" title="Responders on scene"></cd-kpi>
        <cd-kpi class="info3_container" title="Injured en route to hospital">0</cd-kpi>
        <cd-kpi class="info4_container" title="Injured Loaded">0</cd-kpi>
        <!-- <div id="map" class="map_container"></div> -->
        <cd-map class="map_container"></cd-map>
        <div id="console" class="rec_container">
          <h3>Breakdown of besponders on scene:</h3>
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
    this.querySelector('.info1_container').innerHTML = data['A2 Injured'];
    this.querySelector('.info2_container').fontsize = '3vh';
    this.querySelector('.info2_container').innerHTML = `<div style="margin-top: 6%; text-align: left;">Paramedics: ${data['A2 A_Responder']}</br>Firemen: ${data['A2 F_Responder']}</div>`;
    this.querySelector('.info3_container').innerHTML = data['A2 Injured_Enroute'];
    this.querySelector('.info4_container').innerHTML = data['A2 Injured_Loaded'];
  }
}
customElements.define('act-2', Act2Page);
