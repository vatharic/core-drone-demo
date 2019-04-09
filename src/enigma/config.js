import schema from 'enigma.js/schemas/12.170.2.json';

import listCache from './object-cache';
import getDoc from './get-doc';

const ERR_ABORTED = 15;

const appId = 'Drone App.qvf';
const schemaEnigma = JSON.parse(schema);

export default {
  schema: schemaEnigma,
  url: new URLSearchParams(document.location.search).get('engine_url') || `ws://localhost:9076/app/${appId}`,
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
