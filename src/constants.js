const SERVER_URL = process.env.REACT_APP_PROXY_SERVER_URL || 'http://localhost:3001';
export const DB_HOST = process.env.REACT_APP_DB_HOST || 'localhost';
export const DB_PORT = process.env.REACT_APP_DB_PORT || '8182';
export const QUERY_ENDPOINT = `${SERVER_URL}/query`;
export const QUERY_RAW_ENDPOINT = `${SERVER_URL}/query-raw`;
export const WORKSPACE_ENDPOINT = `${SERVER_URL}/workspaces`;
export const COMMON_GREMLIN_ERROR = 'Invalid query. Please execute a query to get a set of vertices';

// Set the backend graph implementation
export let GRAPH_IMPL = "cytoscape" // 'vis' | 'cytoscape' | 'sigma'
// Disables editing capabilities when True
export const DISABLE_NODE_EDGE_EDIT = false;
// Appends to edge IDs to convert to Long types. Dependent on graph databased backend.
export const EDGE_ID_APPEND = 'L';

/**
 * Import default label mappings
 */
import { INITIAL_LABEL_MAPPINGS } from '/gremlin-visualizer/src/label-map-defaults.js';
export { INITIAL_LABEL_MAPPINGS };

/**
 * Import saved queries
 */
import { SAVED_QUERIES } from '/gremlin-visualizer/src/saved-queries.js';
export { SAVED_QUERIES };

/**
 * Import icon modules
 */
import { LOGIC_ICONS } from '/gremlin-visualizer/src/assets/icons/logic/icons.js';
import { ENVIRONMENT_ICONS } from '/gremlin-visualizer/src/assets/icons/targets/icons.js';
import { DATA_ICONS } from '/gremlin-visualizer/src/assets/icons/data/icons.js';
import { ATTACK_ICONS } from '/gremlin-visualizer/src/assets/icons/attack/icons.js';
import { THREAT_ACTOR_ICONS } from '/gremlin-visualizer/src/assets/icons/threatactors/icons.js';

import { PERSONALITY_ICONS } from '/gremlin-visualizer/src/assets/icons/psychology/icons-personality.js';
import { COGBIAS_ICONS } from '/gremlin-visualizer/src/assets/icons/psychology/icons-cogbias.js';
import { SENSOR_ICONS } from '/gremlin-visualizer/src/assets/icons/sensors/icons.js';
import { TRIGGER_ICONS } from '/gremlin-visualizer/src/assets/icons/triggers/icons.js';

import { CULTURE_GENERAL_ICONS } from '/gremlin-visualizer/src/assets/icons/culture/icons-general.js';
import { CULTURE_NATIONAL_ICONS } from '/gremlin-visualizer/src/assets/icons/culture/geographic/national/icons-national.js';
import { CULTURE_REGION_OWID_ICONS } from '/gremlin-visualizer/src/assets/icons/culture/geographic/regional/icons-owid.js';
import { CULTURE_UN_GEOSCHEME_ICONS } from '/gremlin-visualizer/src/assets/icons/culture/geographic/regional/icons-ungs.js';

export const ICONS = {
    // Tags are the object type field
    // Object type is derived from the class name.
    //   e.g., class PersonalityNormal becomes personality_normal
    default: require('./assets/icons/default.png'),

    // ** BASE ICONS
    ...LOGIC_ICONS,
    
    // ** HUMAN ICONS
    ...PERSONALITY_ICONS,
    ...COGBIAS_ICONS,

    // ** CULTURE ICONS
    ...CULTURE_GENERAL_ICONS,
    ...CULTURE_NATIONAL_ICONS,
    ...CULTURE_REGION_OWID_ICONS,
    ...CULTURE_UN_GEOSCHEME_ICONS,

    // ** CYBER ICONS
    ...SENSOR_ICONS,
    ...TRIGGER_ICONS,
    ...DATA_ICONS,
    ...ENVIRONMENT_ICONS,
    ...THREAT_ACTOR_ICONS,
    ...ATTACK_ICONS,
       
};
