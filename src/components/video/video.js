import { LitElement, html } from 'lit-element';
// import Hls from 'hls.js';

class CDVideo extends LitElement {
  constructor() {
    super();
    this.src = '';
    this.type = '';
    window.addEventListener('playVideo', ($event) => {
      if ($event && $event.detail) {
        const videoEl = this.shadowRoot.querySelector('#live_feed');
        const videoUrlStream = (new URL(document.location.href)).searchParams.get('video_url');
        if (Hls.isSupported() && videoUrlStream) {
          const hls = new Hls();
          hls.loadSource(videoUrlStream);
          hls.attachMedia(videoEl);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoEl.play();
          });
        } else {
          videoEl.src = $event.detail.src;
          videoEl.type = $event.detail.type;
          videoEl.load();
          videoEl.play();
        }
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
          text-align: center;
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
