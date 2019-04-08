import { LitElement, html } from 'lit-element';

class CDVideo extends LitElement {
  constructor() {
    super();
    this.src = './assets/sample.webm';
    this.type = 'video/webm';
    window.addEventListener('playVideo', ($event) => {
      if ($event && $event.detail) {
        const videoEl = this.shadowRoot.querySelector('#live_feed');
        videoEl.src = $event.detail.src;
        videoEl.type = $event.detail.type;
        videoEl.load();
        videoEl.play();
        const overlay = this.shadowRoot.querySelector('.overlay');
        overlay.classList.add('off');
      }
    });
  }

  observedAttributes() { return ['src', 'type']; }

  attributeChangedCallback(name, oldval, newval) {
    console.log('attribute change: ', name, newval);
    // super.attributeChangedCallback(name, oldval, newval);
  }

  render() {
    return html`
      <style>
        :host{
          width:100%;
          height:100%;
          overflow: hidden;
        }
        .container{
          position: relative;
          height:100%;
          overflow: hidden;
        }
        video {
          height: 100%;
          z-index:0;
          object-fit: fill;
        }
        .overlay {
          position:absolute;
          transition: opacity 750ms;
          top:0;
          left:0;
          z-index:1;
          width: 100%;
          height:100%;
          background:black;
          background:rgba(0,0,0,0.6);
          filter:blur(1px);
          display: table;
        }
        .overlay.off{
          display: none;
          opacity: 0;
        }
        p{
          font-size: 6vw;
          display: table-cell;
          vertical-align: middle;
          text-align: center;
        }
      </style>
      <div class="container">
        <video id="live_feed" autoplay>
          <source src="${this.src}" type="${this.type}">
          Your browser does not support the video tag.
        </video>
        <div class="overlay">
          <p>Drone flying</p>
        </div>
      </div>
    `;
  }
}

customElements.define('cd-video', CDVideo);
