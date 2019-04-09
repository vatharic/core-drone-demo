import { LitElement, html } from 'lit-element';
import { getHypercubeModel, getField } from '../enigma/models';

import '../components/map/map';
import '../components/kpi/kpi';
import '../components/video/video';

import css from './act1.css';

class Act1Page extends LitElement {
  firstUpdated() {
    setTimeout(() => {
      // apply selections
      this.startApp();
    }, 2000);
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
        <!-- <div id="map" class="map_container"></div> -->
        <cd-map class="map_container"></cd-map>
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
    this.querySelector('.info2_container').innerHTML = data.Responder;
    this.querySelector('.info3_container').innerHTML = data.HazMats;
    this.querySelector('.info4_container').innerHTML = data.Score;

    this.querySelector('#console code').innerHTML = data.Recommendation;
  }

  async startApp() {
    const hyperCubeModel = await getHypercubeModel();
    await hyperCubeModel.getLayout();
    const field = await getField('Index');
    const update = () => {
      hyperCubeModel.getLayout().then((layout) => {
        this.updateKPIs(layout);
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
    }, 1000);
  }
}
customElements.define('act-1', Act1Page);
