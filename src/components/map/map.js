import { LitElement, html } from 'lit-element';
import * as mapStyles from './map-styles';

import {
  // routeAmbulance,
  droneRoute,
  ambulances,
  firetrucks,
} from './map-routes';

window.initMap = () => { window.dispatchEvent(new CustomEvent('map-ready')); };

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
    this.APIKey = 'AIzaSyBJLqNRZNyt3_TgqDiBErIfamrAOdr-mf4';

    this.ambulancesArr = [];
    this.fireTrucksArr = [];
    this.drone = null;
    this.zoom = 12;
    this.lat = 45.2184704;
    this.lng = -75.7655448;

    window.addEventListener('map-ready', () => {
      console.log('google maps ready');
      this.mapEl = this.shadowRoot.getElementById('map');
      this.map = new google.maps.Map(this.mapEl, {
        // new google.maps.LatLng(45.2424415, -75.7128212), // startLocation,
        center: new google.maps.LatLng(this.lat, this.lng),
        zoom: this.zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        styles: mapStyles.default,
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
      </style>
      <div id="map"></div>
    `;
  }

  firstUpdated() {
    this.shadowRoot.appendChild(this._addScriptTag());
    super.firstUpdated();
  }

  _addScriptTag() {
    const scriptTag = document.createElement('script');
    scriptTag.src = `https://maps.googleapis.com/maps/api/js?key=${this.APIKey}&libraries=places&callback=initMap`;
    scriptTag.async = true;
    scriptTag.defer = true;
    return scriptTag;
  }

  // the smooth zoom function
  _smoothZoom(max, cnt, timer = 80) {
    if (max > cnt) {
      const z = google.maps.event.addListener(this.map, 'zoom_changed', () => {
        google.maps.event.removeListener(z);
        this._smoothZoom(max, cnt + 1);
      });
      setTimeout(() => { this.map.setZoom(cnt); }, timer);
    }
    if (max < cnt) {
      const z = google.maps.event.addListener(this.map, 'zoom_changed', () => {
        google.maps.event.removeListener(z);
        this._smoothZoom(max, cnt - 1);
      });
      setTimeout(() => { this.map.setZoom(cnt); }, timer);
    }
  }

  _panTo(lat, lng) {
    this.map.panTo(new google.maps.LatLng(lat, lng));
  }

  _initFireTruck(firetruck) {
    const lineSymbol = {
      // path: firetruckSymbolPath,
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10,
      fillOpacity: 1,
      fillColor: 'blue',
      strokeColor: 'red',
      strokeOpacity: 0.7,
      strokeWeight: 6,
    };
    return new google.maps.Polyline({
      path: firetrucks[firetruck].default,
      icons: [{
        icon: lineSymbol,
        offset: '0%',
      }],
      strokeColor: 'rgba(255, 255, 0, 0)',
      map: this.map,
    });
  }

  _initAmbulance(ambulance) {
    const lineSymbol = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10,
      // scale: 0.05,
      fillOpacity: 1,
      fillColor: 'red',
      strokeColor: 'white',
      strokeOpacity: 0.7,
      strokeWeight: 6,
    };
    return new google.maps.Polyline({
      path: ambulances[ambulance].default,
      icons: [{
        icon: lineSymbol,
        offset: '0%',
      }],
      strokeColor: 'rgba(255, 255, 0, 0)',
      map: this.map,
    });
  }

  _initDrone() {
    const lineSymbol = {
      path: google.maps.SymbolPath.CIRCLE, // droneSymbolPath,
      scale: 4,
      fillOpacity: 1,
      fillColor: 'black',
      strokeColor: 'black',
      strokeOpacity: 0.7,
      strokeWeight: 10,
    };
    return new google.maps.Polyline({
      path: droneRoute,
      icons: [{
        icon: lineSymbol,
        offset: '0%',
      }],
      strokeColor: 'rgba(255, 255, 0, 0)',
      map: this.map,
    });
  }

  _initDroneAct2() {
    const droneMarker = new google.maps.Marker({ // last position from act 1
      position: new google.maps.LatLng(45.2184704, -75.7655448),
      icon: {
        path: google.maps.SymbolPath.CIRCLE, // droneSymbolPath,
        scale: 4,
        fillOpacity: 1,
        fillColor: 'black',
        strokeColor: 'black',
        strokeOpacity: 0.7,
        strokeWeight: 10,
      },
      map: this.map,
    });
    const icon = droneMarker.get('icon');
    let type = 'decrease';
    setInterval(() => {
      if (type === 'decrease') {
        icon.strokeOpacity = Math.round((icon.strokeOpacity - 0.1) * 10) / 10;
        type = icon.strokeOpacity === 0 ? 'increase' : 'decrease';
      } else {
        icon.strokeOpacity = Math.round((icon.strokeOpacity + 0.1) * 10) / 10;
        type = icon.strokeOpacity === 1 ? 'decrease' : 'increase';
      }
      droneMarker.set('icon', icon);
    }, 50);
    return droneMarker;
  }

  _initIncident() {
    const incident = new google.maps.Marker({ // 45.2184704,-75.7655448
      position: new google.maps.LatLng(45.2184704, -75.7655448),
      icon: './assets/incident.svg',
      map: this.map,
    });
    let blinking = false;
    setInterval(() => {
      if (blinking) {
        incident.setMap(null);
      } else {
        incident.setMap(this.map);
      }
      blinking = !blinking;
    }, 600);
  }

  _animateVehicule(line, blink, ms = 1000) {
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
        }, 60);
      });
    }
    function blinking(l) {
      setInterval(() => {
        const icons = l.get('icons');
        const fillColor = icons[0].icon.strokeColor;
        const strokeColor = icons[0].icon.fillColor;
        icons[0].icon.fillColor = fillColor;
        icons[0].icon.strokeColor = strokeColor;
        l.set('icons', icons);
      }, ms);
    }
    if (blink) { blinking(line, ms); }
    return animateCircle(line);
  }

  _animateDrone(line) {
    function animate(l) {
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
        }, 30);
      });
    }
    function fade(l) {
      const icons = l.get('icons');
      let type = 'decrease';
      setInterval(() => {
        if (type === 'decrease') {
          icons[0].icon.strokeOpacity = Math.round((icons[0].icon.strokeOpacity - 0.1) * 10) / 10;
          type = icons[0].icon.strokeOpacity === 0 ? 'increase' : 'decrease';
        } else {
          icons[0].icon.strokeOpacity = Math.round((icons[0].icon.strokeOpacity + 0.1) * 10) / 10;
          type = icons[0].icon.strokeOpacity === 1 ? 'decrease' : 'increase';
        }
        l.set('icons', icons);
      }, 50);
    }
    fade(line);
    return animate(line);
  }

  getNearestHospitals() {
    return new Promise((resolve) => {
      const placeService = new google.maps.places.PlacesService(this.map);
      const request = {
        location: new google.maps.LatLng(45.2184704, -75.7655448), // last position of the drone
        keyword: 'hospital',
        rankBy: google.maps.places.RankBy.DISTANCE,
        type: ['hospital'/* , 'police', 'fire_station' */], // supported types can be found here -> https://developers.google.com/places/supported_types
      };
      placeService.nearbySearch(request, (res) => {
        resolve(res);
      });
    });
  }

  startAnimation() {
    this.ambulancesArr.forEach((ambulance) => {
      this._animateVehicule(ambulance, true);
    });
    this.fireTrucksArr.forEach((fireTruck) => {
      this._animateVehicule(fireTruck, true, 500);
    });
    return this._animateDrone(this.drone).then(() => {
      this._smoothZoom(17, this.map.getZoom());
      const videoEvent = new CustomEvent('playVideo', {
        detail: {
          type: 'video/webm',
          src: './assets/Act_1-labelled.test9.webm',
        },
      });
      window.dispatchEvent(videoEvent);
    });
  }
}

customElements.define('cd-map', CDMap);
