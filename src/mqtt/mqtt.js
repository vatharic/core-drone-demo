const MQTT_URL = 'm16.cloudmqtt.com';
// const client = new Mosquitto();

const topic = 'super_unique_id';

const init = msgCallback => new Promise((resolve, reject) => {
  const client = new Paho.MQTT.Client(MQTT_URL, 30807, `drone-${Math.random()}`);

  function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    client.subscribe(topic);
    resolve(client);
  }

  // called when the client loses its connection
  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log(`onConnectionLost: ${responseObject.errorMessage}`);
      reject(new Error('useless'));
    }
  }

  function onFailure(invocationContext, errorCode, errorMessage) {
    console.log(errorMessage);
  }

  // // set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = msgCallback;
  // client.connect({ useSSL: false, onSuccess: onConnect });
  client.connect({
    useSSL: true,
    userName: 'szucusym',
    password: '2B68MQtLyWkj',
    onSuccess: onConnect,
    onFailure,
  });
  window.addEventListener('beforeunload', () => {
    try {
      client.disconnect();
    // eslint-disable-next-line no-empty
    } catch (err) { }
  });
});
export {
  // eslint-disable-next-line import/prefer-default-export
  init,
  topic,
};
