import { LitElement, html } from 'lit-element';

class CDKpi extends LitElement {
  static get properties() {
    return {
      fontsize: { type: String, reflect: true },
    };
  }

  constructor() {
    super();
    this.fontsize = '15vh';
  }

  render() {
    return html`
      <style>
        :host{
          background-color: #1D2C4D;
        }
        h3 {
          margin: 10px;
          text-align: center;
          display: block;
          font-size: 1.5vw;
          font-weight: bold;
        }
        span{
          display: block;
          padding:20px;
          text-align: center;
          font-size: ${this.fontsize};
          top: 50%;
          margin-top: -37px;
        }
      </style>
      <h3>${this.title}</h3>
      <span>
        <slot></slot>
      </span>
    `;
  }
}

customElements.define('cd-kpi', CDKpi);
