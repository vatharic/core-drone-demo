/* eslint-disable no-undef */
import { LitElement, html } from 'lit-element';

import {
  // routeAmbulance,
  droneRoute,
  ambulances,
  firetrucks,
} from './map-routes';

window.onIdevioWebMapLoaded = () => { window.dispatchEvent(new CustomEvent('map-ready')); };

class CDMap extends LitElement {
  static get properties() {
    return {
      zoom: { type: Number, reflect: true },
      lat: { type: Number, reflect: true },
      lng: { type: Number, reflect: true },
    };
  }

  constructor() {
    super();
    this.qAPIKey = process.env.API_KEY;
    this.qROUTEkey = process.env.ROUTE_KEY;
    this.zoom = 12;
    this.lat = 45.2184704;
    this.lng = -75.7655448;

    window.addEventListener('map-ready', () => {
      this.mapEl = this.shadowRoot.getElementById('map');
      this.map = new idevio.map.WebMap({
        div: this.mapEl,
        baseMap: 'satellite_mercator',
        center: [this.lat, this.lng],
        zoomLevel: this.zoom,
      });
    });
  }

  render() {
    return html`
      <style>
        :host {
          display: block
        }
        #map {
          width: 100%;
          height: 100%;
        }
        .idevio-attribution {
          position: absolute;
          overflow: hidden;
          bottom: 3px;
          right: 5px;
          font: 8pt sans-serif;
          pointer-events: none;
          max-width: 80%;
          color: black;
          text-shadow: -1px -1px 0 #FFF, 1px -1px 0 #FFF, -1px 1px 0 #FFF, 1px 1px 0 #FFF;
          padding: 2px;
          bottom: 8px;
        }
      </style>
      <div id='map'></div>
    `;
  }

  firstUpdated() {
    this.appendChild(this._addScriptTagQlik());
    super.firstUpdated();
  }

  _addScriptTagQlik() {
    const scriptTag = document.createElement('script');
    scriptTag.src = `https://maps.qlikcloud.com/ravegeo/webmap5/script/webmap.nocache.js?key=${this.qAPIKey}&opt=tools,iconfactory`;
    return scriptTag;
  }

  // the smooth zoom function
  _smoothZoom(factor) {
    this.map.zoom(factor);
  }

  _panTo(lat, lng) {
    this.map.moveTo([lat, lng], this.map.getResolution());
  }

  _initAndAnimateDroneAct1() {
    const myDataset = new idevio.map.MemoryDataset();
    // eslint-disable-next-line no-unused-vars
    const myLayer = new idevio.map.MarkerLayer(this.map, { name: 'Drone Marker', dataset: myDataset, pickable: true });

    const animationIcons = [];
    for (let i = 0; i <= 10; i += 1) {
      animationIcons.push(idevio.map.IconFactory.circle({ radius: 10, color: `rgba(51, 204, 204, ${i / 10})` }));
    }

    const pulseIcon = new idevio.map.Marker(myDataset, {
      coordinate: [droneRoute[0].lat, droneRoute[0].lng],
      style: {
        icon: animationIcons[0],
      },
    });

    const nonPulseIcon = new idevio.map.Marker(myDataset, {
      coordinate: [droneRoute[0].lat, droneRoute[0].lng],
      style: {
        icon: idevio.map.IconFactory.circle({ radius: 5, color: 'rgba(51, 204, 204, 1)' }),
      },
    });

    this._fade(pulseIcon, animationIcons);
    return this._move(droneRoute, [pulseIcon, nonPulseIcon], 80);
  }

  _blinkIcon(marker, speed, icons) {
    let blink = true;
    return setInterval(() => {
      marker.setStyle({
        icon: icons[blink ? 0 : 1],
      });
      blink = !blink;
    }, speed);
  }

  _move(route, icons, speed) {
    return new Promise((resolve) => {
      let pos = 0;
      const interval = setInterval(() => {
        if (pos >= route.length) {
          clearInterval(interval);
          resolve();
        } else {
          icons.forEach((icon) => {
            icon.setCoordinates([route[pos].lat, route[pos].lng]);
          });
          pos += 1;
        }
      }, speed);
    });
  }

  _fade(marker, fadeIcons) {
    let i = 0;
    let grow = true;
    return setInterval(() => {
      if (i <= 0) {
        grow = true;
      } else if (i >= fadeIcons.length - 1) {
        grow = false;
      }

      i = grow ? i + 1 : i - 1;

      marker.setStyle({
        icon: fadeIcons[i],
      });
    }, 50);
  }

  // red & white
  _initAndAnimateAmbulance(ambulance) {
    const route = ambulances[ambulance].default;

    const myDataset = new idevio.map.MemoryDataset();
    // eslint-disable-next-line no-unused-vars
    const myLayer = new idevio.map.MarkerLayer(this.map, { name: 'Ambulance Marker', dataset: myDataset, pickable: true });

    const animationIcons = [];
    animationIcons.push(idevio.map.IconFactory.circle({ radius: 10, color: 'rgba(255,0,0,1)' }));
    animationIcons.push(idevio.map.IconFactory.circle({ radius: 10, color: 'rgba(255,255,255,1)' }));

    const pulseIcon = new idevio.map.Marker(myDataset, {
      coordinate: [route[0].lat, route[0].lng],
      style: {
        icon: animationIcons[0],
      },
    });

    const nonPulseIcon = new idevio.map.Marker(myDataset, {
      coordinate: [route[0].lat, route[0].lng],
      style: {
        icon: idevio.map.IconFactory.circle({ radius: 5, color: 'rgba(0,0,0,0.2)' }),
      },
    });

    this._blinkIcon(pulseIcon, 600, animationIcons);
    return this._move(route, [pulseIcon, nonPulseIcon], 20);
  }

  // red & yellow
  _initAndAnimateFiretruck(firetruck) {
    const route = firetrucks[firetruck].default;

    const myDataset = new idevio.map.MemoryDataset();
    // eslint-disable-next-line no-unused-vars
    const myLayer = new idevio.map.MarkerLayer(this.map, { name: 'Firetruck Marker', dataset: myDataset, pickable: true });

    const icons = [];
    icons.push(idevio.map.IconFactory.circle({ radius: 10, color: 'rgba(0,0,255,1)' }));
    icons.push(idevio.map.IconFactory.circle({ radius: 10, color: 'rgba(255,0,0,1)' }));
    const pulseIcon = new idevio.map.Marker(myDataset, {
      coordinate: [route[0].lat, route[0].lng],
      style: {
        icon: icons[0],
      },
    });

    const nonPulseIcon = new idevio.map.Marker(myDataset, {
      coordinate: [route[0].lat, route[0].lng],
      style: {
        icon: idevio.map.IconFactory.circle({ radius: 5, color: 'rgba(0,0,0,0.2)' }),
      },
    });

    this._blinkIcon(pulseIcon, 1200, icons);
    return this._move(route, [pulseIcon, nonPulseIcon], 20);
  }

  _initAndAnimateDroneAct2() {
    const myDataset = new idevio.map.MemoryDataset();
    // eslint-disable-next-line no-unused-vars
    const myLayer = new idevio.map.MarkerLayer(this.map, { name: 'Drone Marker', dataset: myDataset, pickable: true });
    const coord = [droneRoute[droneRoute.length - 1].lat, droneRoute[droneRoute.length - 1].lng];
    const animationIcons = [];
    for (let i = 0; i <= 10; i += 1) {
      animationIcons.push(idevio.map.IconFactory.circle({ radius: 10, color: `rgba(51, 204, 204, ${i / 10})` }));
    }

    const pulseIcon = new idevio.map.Marker(myDataset, {
      coordinate: coord,
      style: {
        icon: animationIcons[0],
      },
    });

    // eslint-disable-next-line no-unused-vars
    const nonPulseIcon = new idevio.map.Marker(myDataset, {
      coordinate: coord,
      style: {
        icon: idevio.map.IconFactory.circle({ radius: 5, color: 'rgba(51, 204, 204, 1)' }),
      },
    });

    this._fade(pulseIcon, animationIcons);
  }

  _initIncident() {
    const myDataset = new idevio.map.MemoryDataset();
    const myLayer = new idevio.map.MarkerLayer(this.map, {
      name: 'Position Marker',
      dataset: myDataset,
      pickable: true,
    });

    // a predefined symbol
    const incidentIcon = new idevio.map.Icon({
      url: './assets/incident.svg',
      anchorX: 'LEFT',
      anchorY: 'BOTTOM',
    });

    // eslint-disable-next-line no-unused-vars
    const incident = new idevio.map.Marker(myDataset, {
      coordinate: [45.2184704, -75.7655448],
      style: { icon: incidentIcon },
    });

    let blinking = false;
    setInterval(() => {
      myLayer.setVisible(blinking);
      blinking = !blinking;
    }, 600);
  }

  getNearestHospitals() {
    // Patric Nordström looked this up and found other options. The previous
    // "closest" hospitals included minor health clinics and similar that
    // wouldn't normally accept ambulances and such. (No emergency room)
    return [
      { name: 'Montfort Hospital', lat: 45.446375, lng: -75.638164 },
      { name: 'Queensway-Carleton Hospital', lat: 45.335536, lng: -75.808361 },
      { name: 'Children\'s Hospital of Eastern Ontario (CHEO)', lat: 45.400882, lng: -75.65225 },
      { name: 'The Ottawa Hospital Civic Campus', lat: 45.392345, lng: -75.720532 },
      { name: 'The Ottawa Hospital General Campus', lat: 45.4033, lng: -75.648996 },
    ];
  }

  _getRoutes() {
    return new Promise((resolve) => {
      const startPoint = `${droneRoute[droneRoute.length - 1].lat}, ${droneRoute[droneRoute.length - 1].lng}`;
      const hospitals = this.getNearestHospitals();
      const endPoints = [];
      for (let i = 0; i < hospitals.length; i += 1) {
        endPoints.push({
          name: hospitals[i].name,
          endPoint: `${hospitals[i].lat}, ${hospitals[i].lng}`,
        });
      }
      const query = this._createRoutesQuery(startPoint, endPoints);

      const url = `https://ga.qlikcloud.com/ravegeo/route2/routes?key=${this.qROUTEkey}&format=json`;
      const xmlHttp = new XMLHttpRequest();

      xmlHttp.onreadystatechange = function onreadystatechange() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
          resolve(JSON.parse(xmlHttp.responseText));
        }
      };

      xmlHttp.onerror = () => {
        resolve(hospitals.map(h => ({
          distanceFromOrigin: 0,
          distanceToDestination: 0,
          length: 0,
          routeId: h.name,
        })));
      };
      xmlHttp.open('POST', url, true); // true for asynchronous
      xmlHttp.send(query);
    });
  }

  _createRoutesQuery(startPoint, endPoints) {
    const routes = [];
    for (let i = 0; i < endPoints.length; i += 1) {
      routes.push(`<RouteRequest routeId="${endPoints[i].name}" origin="${startPoint}" destination="${endPoints[i].endPoint}" />`);
    }
    const postRequest = `<RoutesRequest key="${this.qROUTEkey}" criteria="fastest" requestId="req1" scheme="default" transportation="car"> ${routes.join('')} </RoutesRequest>`;

    const query = postRequest;
    return query;
  }
}

customElements.define('cd-map', CDMap);
