const MQTT_URL = 'ws://test.mosquitto.org:8080/mqtt';
let mosq;

const elConsole = document.querySelector('#console code');

const init = () => {
  mosq = mosq || new Mosquitto();
  elConsole.innerHTML +=  'MQTT initialized...\n';
}

const connect = () => {
  return mosq.connect(MQTT_URL);
}

const disconnect = () => {
  elConsole.innerHTML +=  'MQTT Disconnected...\n';
  mosq.disconnect();
};
const subscribe = (topic) => {
  elConsole.innerHTML += `subscribed to ${topic}\n`;
  mosq.subscribe(topic, 0);
};
const unsubscribe = (topic) => {
  elConsole.innerHTML += `un subscribed to ${topic}\n`;
  mosq.unsubscribe(topic);
};
const publish = (topic, message) => {
  elConsole.innerHTML += `publishing message ${JSON.stringify(message)} to ${topic}\n`;
  mosq.publish(topic, message, 0);
};

export {
  connect,
  disconnect,
  subscribe,
  unsubscribe,
  publish,
  init
}
