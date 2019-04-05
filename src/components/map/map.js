import { LitElement, html } from 'lit-element';
import * as mapStyles from './map-styles';
import droneSymbolPath from '../../assets/drone.svg';
import ambulanceSymbolPath from '../../assets/ambulance.svg';
import firetruckSymbolPath from '../../assets/firetruck.svg';

import {
  // routeAmbulance,
  droneRoute,
  ambulances,
  firetrucks,
} from './map-routes';

window.initMap = () => { window.dispatchEvent(new CustomEvent('map-ready')); };

class CDMap extends LitElement {
  constructor() {
    super();
    this.APIKey = 'AIzaSyBJLqNRZNyt3_TgqDiBErIfamrAOdr-mf4';

    this.ambulancesArr = [];
    this.fireTrucksArr = [];
    this.drone = null;

    window.addEventListener('map-ready', () => {
      console.log('google maps ready');
      this.startLocation = new google.maps.LatLng(45.2184704, -75.7655448, 17);
      this.mapEl = this.shadowRoot.getElementById('map');
      this.map = new google.maps.Map(this.mapEl, {
        center: new google.maps.LatLng(45.2424415, -75.7128212), // startLocation,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        styles: mapStyles.default,
      });
      this._initIncident(); // should be delayed ??

      this.drone = this._initDrone();
      // this.ambulancesArr.push(_initAmbulancee());
      this.ambulancesArr.push(this._initAmbulance('ambulance1'));
      this.ambulancesArr.push(this._initAmbulance('ambulance2'));
      this.ambulancesArr.push(this._initAmbulance('ambulance3'));
      this.ambulancesArr.push(this._initAmbulance('ambulance4'));

      this.fireTrucksArr.push(this._initFireTruck('firetruck1'));
      this.fireTrucksArr.push(this._initFireTruck('firetruck2'));
      this.fireTrucksArr.push(this._initFireTruck('firetruck3'));

      this.startAnimation();
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
      <div id="map">sdsdss</div>
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

  _initFireTruck(firetruck) {
    const lineSymbol = {
      path: firetruckSymbolPath,
      scale: 0.05,
      fillOpacity: 0,
      strokeColor: 'white',
      strokeWeight: 1,
    };
    return new google.maps.Polyline({
      path: firetrucks[firetruck].default,
      icons: [{
        icon: lineSymbol,
        offset: '0%',
      }],
      strokeColor: 'rgba(255, 255, 0, 0.1)',
      map: this.map,
    });
  }

  _initAmbulance(ambulance) {
    const lineSymbol = {
      path: ambulanceSymbolPath,
      scale: 0.05,
      fillOpacity: 0,
      strokeColor: 'white',
      strokeWeight: 1,
    };
    return new google.maps.Polyline({
      path: ambulances[ambulance].default,
      icons: [{
        icon: lineSymbol,
        offset: '0%',
      }],
      strokeColor: 'rgba(255, 255, 0, 0.1)',
      map: this.map,
    });
  }

  _initDrone() {
    const lineSymbol = {
      path: droneSymbolPath,
      scale: 0.05,
      fillOpacity: 0,
      strokeColor: '#8b0000',
      strokeWeight: 1,
    };
    return new google.maps.Polyline({
      path: droneRoute,
      icons: [{
        icon: lineSymbol,
        offset: '0%',
      }],
      strokeColor: 'rgba(255, 255, 0, 0.1)',
      map: this.map,
    });
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
    }, 1000);
  }

  _animateVehicule(line) {
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
        }, 20);
      });
    }
    return animateCircle(line);
  }

  startAnimation() {
    this.ambulancesArr.forEach((ambulance) => {
      this._animateVehicule(ambulance);
    });
    this.fireTrucksArr.forEach((fireTruck) => {
      this._animateVehicule(fireTruck);
    });
    return this._animateVehicule(this.drone);
  }
}

customElements.define('cd-map', CDMap);
