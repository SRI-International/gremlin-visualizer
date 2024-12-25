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
 * Initial Label to display property mapping.
 * Nodes with the matching label will initially display the value of the given node property on the graph.
 */
export const INITIAL_LABEL_MAPPINGS = {
    //  person: 'name'
    attacker_ttp_model: 'layout_label',
    attack_tactic:      'layout_label',
    attack_technique:   'layout_label',
    attack_procedure:   'layout_label',
}

/**
 * Saved queries name to gremlin query string mapping.
 * The key will be the query name, and execute the associated gremlin query.
 * Saved queries appear on the saved queries tab.
 */
export const SAVED_QUERIES = {
    //"MITRE ATT&CK":                     "g.V().has('groups', within('MITRE ATT&CK'))",
    "Theory: CogVulns":                   "g.V().has('groups', within('Cognitive Vulnerabilities'))",
    "Theory: Personalities":              "g.V().has('groups', within('Psychological Theory: All Personalities'))",
    "Theory: Normal Personality":         "g.V().has('groups', within('Psychological Theory: Normal Personality'))",
    "Theory: Narcissistic Personality":   "g.V().has('groups', within('Psychological Theory: Narcissistic Personality'))",
    "Theory: Machiavellian Personality":  "g.V().has('groups', within('Psychological Theory: Machiavellian Personality'))",
    "Theory: Psychopathic Personality":   "g.V().has('groups', within('Psychological Theory: Psychopathic Personality'))",
    "Data: Personalities":                "g.V().has('groups', within('Data Theory'))",
    "Reference Hacker 1":                 "g.V().has('groups', within('Reference Hacker 1'))",
    "Reference Hacker 2":                 "g.V().has('groups', within('Reference Hacker 2'))",
    "Reference Hacker 3":                 "g.V().has('groups', within('Reference Hacker 3'))",
    "Reference Hacker 4":                 "g.V().has('groups', within('Reference Hacker 4'))",
}

/**
 * Icon string to image mapping.
 * Nodes with label matching the map key will load the associated icon.
 */
const personalityNormal    = require('./assets/icons/psychology/personality_normal.png');
const personalityDarkTriad = require('./assets/icons/psychology/personality_dark_triad.png');
const traitEmotionNegative = require('./assets/icons/psychology/trait_emotion_negative.png');
const traitEmotionPositive = require('./assets/icons/psychology/trait_emotion_positive.png');
const traitEmotionNeutral  = require('./assets/icons/psychology/trait_emotion_neutral.png');

export const ICONS = {
    default: require('./assets/icons/default.png'),

    // ** Psychology Theory
    attention: require('./assets/icons/psychology/attention.png'),
    fatigue: require('./assets/icons/psychology/fatigue.png'),
    workload: require('./assets/icons/psychology/workload.png'),
    // Behavioral Traits - Negative
    antisocial: traitEmotionNegative,
    callousness: traitEmotionNegative,
    cynicism: traitEmotionNegative,
    dominance: traitEmotionNegative,
    entitlement: traitEmotionNegative,
    grandiosity: traitEmotionNegative,
    impulsivity: traitEmotionNegative,
    manipulativeness: traitEmotionNegative,
    strategic_calculating: traitEmotionNegative,
    superiority: traitEmotionNegative,
    thrill_seeking: traitEmotionNegative,
    trait_positive: traitEmotionNegative,
    // Behavioral Traits - Positive
    agreeableness: traitEmotionPositive,
    conscientiousness: traitEmotionPositive,
    openness: traitEmotionPositive,
    self_control: traitEmotionPositive,
    stability: traitEmotionPositive,
    empathy: traitEmotionPositive,
    // Behavioral Traits - Neutral
    extraversion: traitEmotionNeutral,
    // Emotional States
    anxiety: traitEmotionNegative,
    frustration: traitEmotionNegative,
    stress: traitEmotionNegative,
    confidence: traitEmotionNeutral,
    risk_aversion: traitEmotionNeutral,
    // Personality Types
    personality_normal: personalityNormal,
    personality_narcissism: personalityDarkTriad,
    personality_psychopathy: personalityDarkTriad,
    personality_machiavellianism: personalityDarkTriad,

    // ** Countries/Cultures
    american_culture: require('./assets/icons/culture/us.png'),
    chinese_culture: require('./assets/icons/culture/cn.png'),
    french_culture: require('./assets/icons/culture/fr.png'),
    indian_culture: require('./assets/icons/culture/in.png'),
    iranian_culture: require('./assets/icons/culture/ir.png'),
    iraqi_culture: require('./assets/icons/culture/iq.png'),
    israeli_culture: require('./assets/icons/culture/is.png'),
    north_korean_culture: require('./assets/icons/culture/kp.png'),
    pakistani_culture: require('./assets/icons/culture/pk.png'),
    russian_culture: require('./assets/icons/culture/ru.png'),
    ukrainian_culture: require('./assets/icons/culture/ua.png'),
    unknown_culture: require('./assets/icons/culture/unknown.png'),


    // ** Attack and Attack TTP icons
    attacker_ttp_model: require('./assets/icons/attack/ttp_file.png'),
    attack_tactic:      require('./assets/icons/attack/tactic.png'),
    attack_technique:   require('./assets/icons/attack/technique.png'),
    attack_procedure:   require('./assets/icons/attack/procedure.png'),
    
    attack_goal: require('./assets/icons/attack/attack_goal.png'),
    attack_plan: require('./assets/icons/attack/attack_plan.png'),
    attack_step: require('./assets/icons/attack/attack_step.png'),

    malware:     require('./assets/icons/attack/malware.png'),
    
    // ** Attacker icons
    threat_actor: require('./assets/icons/threatactors/threat_actor.png'),
    apt_group: require('./assets/icons/threatactors/threat_actor.png'),

    // ** Logic icons
    logical_and:  require('./assets/icons/logic/and.png'),
    logical_nor:  require('./assets/icons/logic/nor.png'),
    logical_not:  require('./assets/icons/logic/not.png'),
    logical_or:   require('./assets/icons/logic/or.png'),
    logical_xor:  require('./assets/icons/logic/xor.png'),
    logical_nand: require('./assets/icons/logic/nand.png'),
    logical_nxor: require('./assets/icons/logic/nxor.png'),

    // ** Target System bugs and vulnerabilities
    vulnerability: require('./assets/icons/targets/vulnerability.png'),
    vulnerability_template: require('./assets/icons/targets/vulnerability.png'),
    bug: require('./assets/icons/targets/bug.png'),

    // ** Target Systems
    audio:  require('./assets/icons/targets/audio.png'),
    binary: require('./assets/icons/targets/binary.png'),
    bluetooth: require('./assets/icons/targets/bluetooth.png'),
    bug: require('./assets/icons/targets/bug.png'),
    camera: require('./assets/icons/targets/camera.png'),
    cellular: require('./assets/icons/targets/cellular.png'),
    configuration_file: require('./assets/icons/targets/configuration_file.png'),
    firewall: require('./assets/icons/targets/firewall.png'),
    firmware: require('./assets/icons/targets/firmware.png'),
    hardware: require('./assets/icons/targets/hardware.png'),
    libraries: require('./assets/icons/targets/libraries.png'),
    library: require('./assets/icons/targets/library.png'),
    memory: require('./assets/icons/targets/memory.png'),
    mobile_phone: require('./assets/icons/targets/mobile_phone.png'),
    multimedia: require('./assets/icons/targets/multimedia.png'),
    network_switch: require('./assets/icons/targets/switch.png'),
    operating_system: require('./assets/icons/targets/operating_system.png'),
    printer: require('./assets/icons/targets/printer.png'),
    processor: require('./assets/icons/targets/processor.png'),
    router: require('./assets/icons/targets/router.png'),
    software: require('./assets/icons/targets/software.png'),
    ssl_certificate: require('./assets/icons/targets/x509_certificate.png'),
    state: require('./assets/icons/targets/state.png'),
    user_account: require('./assets/icons/targets/user_account.png'),
    user_interface: require('./assets/icons/targets/user_interface.png'),
    web_browser: require('./assets/icons/targets/web_browser.png'),
    wifi: require('./assets/icons/targets/wifi.png'),
    workstation: require('./assets/icons/targets/workstation.png'),
};
