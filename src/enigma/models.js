import enigma from 'enigma.js';
import config from './config';

let session;
let global;
let doc;

/** Initializing function that setup session, global and doc as globals
 * @returns {undefined}
 */
async function init() {
  session = session || enigma.create(config);
  global = global || await session.open();
  doc = doc || await global.getDoc();
}

/**
 * Returns a field object
 * @param {String} fieldName - the name of the field
 * @param {String} [stateName=$] - the state name for applying selections
 *
 * @returns {Object} field - field object
 */
export async function getField(fieldName, stateName = '$') {
  await init();

  return doc.getField(fieldName, stateName);
}

/**
 * Get selection model for a given state
 * @param {String} [stateName=$] - the state name for applying selections
 */
export async function getCurrentSelectionsModel(stateName = '$') {
  await init();
  return doc.getOrCreateObject({
    qInfo: {
      qType: 'selections',
    },
    qSelectionObjectDef: {
      qStateName: stateName,
    },
  });
}
