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
    //"MITRE ATT&CK":                       "g.V().has('groups', within('MITRE ATT&CK'))",
    "Cognitive Vulnerabilitiess":           "g.V().has('groups', within('Cognitive Vulnerabilities'))",
    "Psychological Theory: Personalities":  "g.V().has('groups', within('Psychological Theory: Personalities'))",
    "Data Theory: Personalities":           "g.V().has('groups', within('Data Theory'))",
    "Reference Hacker 1":                   "g.V().has('groups', within('Reference Hacker 1'))",
    "Reference Hacker 2":                   "g.V().has('groups', within('Reference Hacker 2'))",
    "Reference Hacker 3":                   "g.V().has('groups', within('Reference Hacker 3'))",
    "Reference Hacker 4":                   "g.V().has('groups', within('Reference Hacker 4'))",
}

/**
 * Icon string to image mapping.
 * Nodes with label matching the map key will load the associated icon.
 */
export const ICONS = {
    default: require('./assets/icons/default.png'),

    // ** Psychology Theory
    attention: require('./assets/icons/psychology/attention.png'),
    fatigue: require('./assets/icons/psychology/fatigue.png'),
    workload: require('./assets/icons/psychology/workload.png'),
    // Behavioral Traits - Negative
    trait_emotion_negative: require('./assets/icons/psychology/trait_emotion_negative.png'),
    antisocial: require('./assets/icons/psychology/trait_emotion_negative.png'),
    callousness: require('./assets/icons/psychology/trait_emotion_negative.png'),
    cynicism: require('./assets/icons/psychology/trait_emotion_negative.png'),
    dominance: require('./assets/icons/psychology/trait_emotion_negative.png'),
    entitlement: require('./assets/icons/psychology/trait_emotion_negative.png'),
    grandiosity: require('./assets/icons/psychology/trait_emotion_negative.png'),
    impulsivity: require('./assets/icons/psychology/trait_emotion_negative.png'),
    manipulativeness: require('./assets/icons/psychology/trait_emotion_negative.png'),
    strategic_calculating: require('./assets/icons/psychology/trait_emotion_negative.png'),
    superiority: require('./assets/icons/psychology/trait_emotion_negative.png'),
    thrill_seeking: require('./assets/icons/psychology/trait_emotion_negative.png'),
    trait_positive: require('./assets/icons/psychology/trait_emotion_positive.png'),
    // Behavioral Traits - Positive
    agreeableness: require('./assets/icons/psychology/trait_emotion_positive.png'),
    conscientiousness: require('./assets/icons/psychology/trait_emotion_positive.png'),
    openness: require('./assets/icons/psychology/trait_emotion_positive.png'),
    self_control: require('./assets/icons/psychology/trait_emotion_positive.png'),
    stability: require('./assets/icons/psychology/trait_emotion_positive.png'),
    empathy: require('./assets/icons/psychology/trait_emotion_positive.png'),
    // Behavioral Traits - Neutral
    trait_emotion_neutral: require('./assets/icons/psychology/trait_emotion_neutral.png'),
    extraversion: require('./assets/icons/psychology/trait_emotion_neutral.png'),
    // Emotional States
    emotional_states: require('./assets/icons/psychology/emotional_states.png'),
    // Personality Types
    personality_normal: require('./assets/icons/psychology/personality_normal.png'),
    personality_dark_triad: require('./assets/icons/psychology/personality_dark_triad.png'),
    personality_narcissism: require('./assets/icons/psychology/personality_dark_triad.png'),
    personality_psychopathy: require('./assets/icons/psychology/personality_dark_triad.png'),
    personality_machiavellianism: require('./assets/icons/psychology/personality_dark_triad.png'),

    // ** Cultures
    american: require('./assets/icons/culture/us.png'),
    chinese: require('./assets/icons/culture/cn.png'),
    french: require('./assets/icons/culture/fr.png'),
    indian: require('./assets/icons/culture/in.png'),
    iranian: require('./assets/icons/culture/ir.png'),
    iraqi: require('./assets/icons/culture/iq.png'),
    israeli: require('./assets/icons/culture/is.png'),
    north_korean: require('./assets/icons/culture/kp.png'),
    pakistani: require('./assets/icons/culture/pk.png'),
    russian: require('./assets/icons/culture/ru.png'),
    unknown: require('./assets/icons/culture/unknown.png'),


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
    apt_group: require('./assets/icons/threatactors/threat_actor.png'), // Create group icon

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
