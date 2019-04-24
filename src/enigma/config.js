/* eslint-disable no-unused-vars */
import schema from 'enigma.js/schemas/12.170.2.json';

import listCache from './object-cache';
import getDoc from './get-doc';

const ERR_ABORTED = 15;

const appId_1 = (process.env.NODE_ENV === 'production') ? process.env.APP_1 : 'Drone App.qvf';
const appId_2 = (process.env.NODE_ENV === 'production') ? process.env.APP_2 : 'Drone App.qvf';
const schemaEnigma = JSON.parse(schema);

export default {
  schema: schemaEnigma,
  url: new URLSearchParams(document.location.search).get('engine_url') || ((process.env.NODE_ENV === 'production') ? `wss://${process.env.BACKEND}/sense/app/${appId_1}` : `ws://localhost:9076/app/${appId_1}`),
  createSocket: url => new WebSocket(url),
  mixins: [listCache, getDoc],
  responseInterceptors: [{
    onRejected(session, request, error) {
      if (error.code === ERR_ABORTED) {
        return request.retry();
      }
      throw error;
    },
  }],
};
