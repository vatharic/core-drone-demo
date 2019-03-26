import schema from 'enigma.js/schemas/12.170.2.json';

import listCache from './object-cache';
import getDoc from './get-doc';

const ERR_ABORTED = 15;

const appId = 'core-demo-2.qvf';
const engineHost = 'localhost:9076/app';
const schemaEnigma = JSON.parse(schema);

export default {
  schema: schemaEnigma,
  url: `${window.location.protocol.replace('http', 'ws')}//${engineHost}/${appId}`,
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
