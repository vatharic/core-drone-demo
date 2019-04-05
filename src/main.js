import { LitElement, html } from 'lit-element';
import { routerMixin, routerOutletMixin } from 'lit-element-router';

import './views/start-page';
import './views/act1';

class AppRoute extends routerOutletMixin(LitElement) {}

customElements.define('app-route', AppRoute);
class DroneDemoApp extends routerMixin(LitElement) {
  constructor() {
    super();
    this.route = '';
    this.params = {};
  }

  static get routes() {
    return [{
      name: 'start',
      pattern: '',
      guard: () => true,
    }, {
      name: 'act-1',
      pattern: 'act-1',
    }, {
      name: 'act-2',
      pattern: 'act-2',
    }, {
      name: 'not-found',
      pattern: '*',
    }];
  }

  onRoute(route, params/* , query, data */) {
    // console.log(route, params, query, data);
    this.route = route;
    this.params = params;
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
      <app-route current-route=${this.route} class="grid-container">
        <start-page route='start'>start page view</start-page>
        <act-1 route='act-1'>act 1 view</act-1>
        <act-2 route='act-2'>act 2 view</act-2>
        <not-found route='not-found'>404 not found</not-found>
      </app-route>
    `;
  }
}
customElements.define('drone-demo-app', DroneDemoApp);
