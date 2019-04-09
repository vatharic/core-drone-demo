import { LitElement, html } from 'lit-element';

class StartPage extends LitElement {
  render() {
    return html`
      <style>
        .wrapper{
          height:100px;
          width:335px;
          position:absolute;
          top:50%;
          margin-top: -50px;
          left:50%;
          margin-left: -165px;
      }
      a{
        display: inline-block;
        width: 100px;
        height: 100px;
        text-decoration: none;
        margin-right: 5px;
        text-align: center;
        background-color: #1D2C4D;
      }
      a span{
        /* vertical-align: middle; */
        position: relative;
        line-height: 100px;
        font-size: 2vw;
        color: white;
      }
      a:hover{
        background-color: #152342;
      }
      </style>
      <div class="wrapper">
        <a href="/act-1"><span>ACT 1</span></a>
        <a href="/act-2"><span>ACT 2</span></a>
        <a href="/act-3"><span>ACT 3</span></a>
      </div>
    `;
  }
}
customElements.define('start-page', StartPage);
