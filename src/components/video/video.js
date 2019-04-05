import { LitElement, html } from 'lit-element';

class CDVideo extends LitElement {
  constructor() {
    super();
    this.src = './assets/sample.webm';
    this.type = 'video/webm';
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
          top:0;
          left:0;
          z-index:1;
          width: 100%;
          height:100%;
          background:black;
          background:rgba(0,0,0,0.6);
          filter:blur(4px);
        }
        p{
          font-size: 6vw;
          text-align: center;
        }
      </style>
      <div class="container">
        <video id="live_feed" controls autoplay>
          <source src="${this.src}" type="${this.type}">
          Your browser does not support the video tag.
        </video>
        <div class="overlay">
          <p>Live feed coming soon</p>
        </div>
      </div>
    `;
  }
}

customElements.define('cd-video', CDVideo);
