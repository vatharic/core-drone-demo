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

export async function getHypercubeModel() {
  const defTpl = {
    qInfo: {
      qId: `data_model_${new Date()}`,
      qType: 'table',
    },
    qHyperCubeDef: {
      qDimensions: [
        {
          qDef: {
            qGrouping: 'N',
            qFieldDefs: [
              'Index',
            ],
          },
        },
        {
          qDef: {
            qGrouping: 'N',
            qFieldDefs: [
              'Bodies',
            ],
          },
        },
        {
          qDef: {
            qGrouping: 'N',
            qFieldDefs: [
              'Injured',
            ],
          },
        },
        {
          qDef: {
            qGrouping: 'N',
            qFieldDefs: [
              'Ambulance',
            ],
          },
        },
        {
          qDef: {
            qGrouping: 'N',
            qFieldDefs: [
              'Fire',
            ],
          },
        },
        {
          qDef: {
            qGrouping: 'N',
            qFieldDefs: [
              'Responder',
            ],
          },
        },
        {
          qDef: {
            qGrouping: 'N',
            qFieldDefs: [
              'HazMats',
            ],
          },
        },
        {
          qDef: {
            qGrouping: 'N',
            qFieldDefs: [
              'Recommendation',
            ],
          },
        },
        {
          qDef: {
            qGrouping: 'N',
            qFieldDefs: [
              'Score',
            ],
          },
        },
      ],
      qMeasures: [],
      qSuppressZero: false,
      qSuppressMissing: true,
      qAlwaysFullyExpanded: false,
      qInitialDataFetch: [
        {
          qLeft: 0,
          qTop: 0,
          qWidth: 9,
          qHeight: 1000,
        },
      ],
      qMode: 'S',
    },
  };

  await init();
  return doc.getOrCreateObject(defTpl, '$');
}

/**
 * Creates a session object representing a listobject
 * @param {String} filedName - the field name to be represented as a list
 * @returns {Object} model - enigma model
 */
export async function getListModel(filedName, sortCritera = { qSortByState: 1, qSortByAscii: 1 }) {
  const defTpl = {
    qInfo: {
      qType: 'listBox',
      id: `${filedName}List`,
    },
    qListObjectDef: {
      qDef: {
        qFieldDefs: [filedName],
        qFieldLabels: [filedName],
        qSortCriterias: [sortCritera],
      },
      qShowAlternatives: true,
      qInitialDataFetch: [{
        qTop: 0,
        qHeight: 1000,
        qLeft: 0,
        qWidth: 0,
      }],
    },
  };
  await init();
  return doc.getOrCreateObject(defTpl);
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
