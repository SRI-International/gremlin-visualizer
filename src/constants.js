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
}

/**
 * Saved queries name to gremlin query string mapping.
 * The key will be the query name, and execute the associated gremlin query.
 * Saved queries appear on the saved queries tab.
 */
export const SAVED_QUERIES = {
    // "get node with name marko" : "g.V().has('name', 'marko')",
    // "get person nodes that marko has outgoing edges to" : "g.V().has('name', 'marko').out().hasLabel('person')"
}

const software = require('./assets/icons/binary_icon_tiny_square_v1.png');
const operatingSystem = require('./assets/icons/operating_system_icon_tiny_round_v1.png');
const firmware = require('./assets/icons/firmware_icon_v1.png');
const wifiDriver = require('./assets/icons/wifi_icon_tiny_round_v1.png');
const library = require('./assets/icons/library_icon_tiny_square_v1.png');
const libraries = require('./assets/icons/libraries_icon_tiny_square_v1.png');
const personalityDarkTriad = require('./assets/icons/psychology/personality_dark_triad.png');
const traitEmotionNegative = require('./assets/icons/psychology/trait_emotion_negative.png');
const traitEmotionPositive = require('./assets/icons/psychology/trait_emotion_positive.png');
const traitEmotionNeutral = require('./assets/icons/psychology/trait_emotion_neutral.png');
/**
 * Icon string to image mapping.
 * Nodes with label matching the map key will load the associated icon.
 */
export const ICONS = {
    artifact: require('./assets/icons/artifact_icon_tiny_round_v1.png'),
    autonomous_system: require('./assets/icons/autonomous_system_icon_tiny_round_v1.png'),
    autonomous_system_product: require('./assets/icons/autonomous_system_product_icon_tiny_round_v1.png'),
    binary: software,
    bluetooth: require('./assets/icons/bluetooth_icon_tiny_round_v1.png'),
    bug: require('./assets/icons/bug_icon_tiny_square_v1.png'),
    campaign: require('./assets/icons/campaign_icon_tiny_round_v1.png'),
    camera: require('./assets/icons/camera_icon_tiny_round_v1.png'),
    cellular: require('./assets/icons/cellular_icon_tiny_round_v1.png'),
    coa: require('./assets/icons/coa_icon_tiny_round_v1.png'),
    course_of_action: require('./assets/icons/course_of_action_icon_tiny_round_v1.png'),
    custom_object: require('./assets/icons/custom_object_icon_tiny_round_v1.svg'),
    directory: require('./assets/icons/directory_icon_tiny_round_v1.png'),
    domain_name: require('./assets/icons/domain_name_icon_tiny_round_v1.png'),
    email_addr: require('./assets/icons/email_addr_icon_tiny_round_v1.png'),
    email_message: require('./assets/icons/email_message_icon_tiny_round_v1.png'),
    file: require('./assets/icons/file_icon_tiny_round_v1.png'),
    firmware: firmware,
    // flowchart: require('./assets/icons/flowchart_icon_tiny_square_v1.png'),
    hardware: require('./assets/icons/hardware_icon_v1.png'),
    http: require('./assets/icons/http_icon_tiny_round_v1.png'),
    identity: require('./assets/icons/identity_icon_tiny_round_v1.png'),
    incident: require('./assets/icons/incident_icon_tiny_round_v1.png'),
    indicator: require('./assets/icons/indicator_icon_tiny_round_v1.png'),
    infrastructure: require('./assets/icons/infrastructure_icon_tiny_round_v1.png'),
    intrusion_set: require('./assets/icons/intrusion_set_icon_tiny_round_v1.png'),
    language: require('./assets/icons/language_icon_tiny_round_v1.png'),
    library: library,
    libraries: libraries,
    location: require('./assets/icons/location_icon_tiny_round_v1.png'),
    malware_analysis: require('./assets/icons/malware_analysis_icon_tiny_round_v1.png'),
    malware: require('./assets/icons/malware_icon_tiny_round_v1.png'),
    marking_definition: require('./assets/icons/marking_definition_icon_tiny_round_v1.png'),
    memory: require('./assets/icons/memory_icon_tiny_round_v1.png'),
    mobile_phone: require('./assets/icons/mobile_phone_icon_v1.png'),
    multimedia: require('./assets/icons/multimedia_icon_tiny_square_v1.png'),
    mutex: require('./assets/icons/mutex_icon_tiny_round_v1.png'),
    network_drive: require('./assets/icons/network_drive_icon_v1.png'),
    note: require('./assets/icons/note_icon_tiny_round_v1.png'),
    observed_data: require('./assets/icons/observed_data_icon_tiny_round_v1.png'),
    opinion: require('./assets/icons/opinion_icon_tiny_round_v1.png'),
    operating_system: operatingSystem,
    process: require('./assets/icons/process_icon_tiny_round_v1.png'),
    printer: require('./assets/icons/printer_icon_tiny_square_v1.png'),
    relationship: require('./assets/icons/relationship_icon_tiny_round_v1.png'),
    report: require('./assets/icons/report_icon_tiny_round_v1.png'),
    sighting: require('./assets/icons/sighting_icon_tiny_round_v1.png'),
    software: require('./assets/icons/software_icon_tiny_round_v1.png'),
    source: require('./assets/icons/source_icon_tiny_round_v1.png'),
    threat_actor: require('./assets/icons/threat_actor_icon_tiny_round_v1.png'),
    tlp: require('./assets/icons/tlp_icon_tiny_round_v1.png'),
    tool: require('./assets/icons/tool_icon_tiny_round_v1.png'),
    url: require('./assets/icons/url_icon_tiny_round_v1.png'),
    user_account: require('./assets/icons/user_account_icon_tiny_round_v1.png'),
    user_interface: require('./assets/icons/user_interface_icon_tiny_round_v1.png'),
    victim: require('./assets/icons/victim_icon_tiny_round_v1.png'),
    victim_target: require('./assets/icons/victim_target_icon_tiny_round_v1.png'),
    vulnerability: require('./assets/icons/vulnerability_icon_tiny_square_v1.png'),
    vulnerability_template: require('./assets/icons/vulnerability_template_icon_tiny_square_v1.png'),
    web_browser: require('./assets/icons/web_browser_icon_tiny_round_v1.png'),
    wifi: wifiDriver,
    workstation: require('./assets/icons/workstation_icon_tiny_square_v1.png'),
    windows_registry_key: require('./assets/icons/windows_registry_key_icon_tiny_round_v1.png'),
    x509_certificate: require('./assets/icons/x509_certificate_icon_tiny_square_v1.png'),

    // Network
    firewall: require('./assets/icons/network/firewall_icon_v1.png'),
    ipv4_addr: require('./assets/icons/network/ipv4_addr_icon_tiny_round_v1.png'),
    ipv6_addr: require('./assets/icons/network/ipv6_addr_icon_tiny_round_v1.png'),
    mac_addr: require('./assets/icons/network/mac_addr_icon_tiny_round_v1.png'),
    network_router: require('./assets/icons/network/network_router_icon_v1.png'),
    network_switch: require('./assets/icons/network/network_switch_icon_v1.png'),
    network_traffic: require('./assets/icons/network/network_traffic_icon_tiny_round_v1.png'),
    nic: require('./assets/icons/network/nic_icon_v1.png'),

    // Attack
    attack_goal: require('./assets/icons/attack/attack_goal_icon_tiny_round_v1.png'),
    attack_pattern: require('./assets/icons/attack/attack_pattern_icon_tiny_round_v1.png'),
    attack_plan: require('./assets/icons/attack/attack_plan_icon_tiny_round_v1.png'),
    attack_step: require('./assets/icons/attack/attack_step_icon_tiny_round_v1.png'),

    // Psychology
    cognitive_attention: require('./assets/icons/psychology/attention.png'),
    cognitive_fatigue: require('./assets/icons/psychology/fatigue.png'),
    cognitive_workload: require('./assets/icons/psychology/workload.png'),
    trait_emotion_negative: traitEmotionNegative,
    trait_emotion_positive: traitEmotionPositive,
    trait_emotion_neutral: traitEmotionNeutral,
    emotional_states: require('./assets/icons/psychology/emotional_states.png'),
    personality_normal: require('./assets/icons/psychology/personality_normal.png'),
    personality_dark_triad: personalityDarkTriad,

    // Cultures
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
    culture_base: require('./assets/icons/culture/unknown.png'),

    // Logic
    logical_and: require('./assets/icons/logic/logical_and_icon_v1.png'),
    logical_nand: require('./assets/icons/logic/logical_nand_icon_v1.png'),
    logical_nor: require('./assets/icons/logic/logical_nor_icon_v1.png'),
    logical_not: require('./assets/icons/logic/logical_not_icon_v1.png'),
    logical_nxor: require('./assets/icons/logic/logical_nxor_icon_v1.png'),
    logical_or: require('./assets/icons/logic/logical_or_icon_v1.png'),
    logical_xor: require('./assets/icons/logic/logical_xor_icon_v1.png'),


    os_runtime: software,
    application_framework: software,
    android_runtime: software,
    android_framework: software,

    operating_system_kernel: operatingSystem,
    android_kernel: operatingSystem,

    boot_loader: firmware,
    android_boot_loader: firmware,

    hardware_driver: software,
    hardware_abstraction_layer: software,
    hardware_abstraction: software,
    android_kernel_binder: software,
    android_hardware_abstraction_layer: software,
    android_storage_driver: software,
    android_binder_ha: software,

    android_memory_driver: require('./assets/icons/memory_icon_tiny_round_v1.png'),
    android_shared_memory_library: require('./assets/icons/memory_icon_tiny_round_v1.png'),

    telephony_ha: require('./assets/icons/cellular_icon_tiny_round_v1.png'),
    android_telephony_ha: require('./assets/icons/cellular_icon_tiny_round_v1.png'),

    wifi_driver: wifiDriver,
    wifi_ha: wifiDriver,
    android_wifi_driver: wifiDriver,
    android_wifi_ha: wifiDriver,

    android_bluetooth_library: require('./assets/icons/bluetooth_icon_tiny_round_v1.png'),

    camera_library: require('./assets/icons/camera_icon_tiny_round_v1.png'),
    android_camera_library: require('./assets/icons/camera_icon_tiny_round_v1.png'),

    media_ha: libraries,
    media_library: libraries,
    android_media_ha: libraries,
    android_media_library: libraries,

    android_native_libraries: libraries,
    android_core_library: libraries,

    android_ssl_library: require('./assets/icons/x509_certificate_icon_tiny_square_v1.png'),

    android_debuggerd_library: library,
    android_libutils: library,
    android_binder_library: library,
    android_open_gl_library: library,
    android_libc: library,

    pov: require('./assets/icons/malware_icon_tiny_round_v1.png'),

    attention: require('./assets/icons/psychology/attention.png'),
    fatigue: require('./assets/icons/psychology/fatigue.png'),
    workload: require('./assets/icons/psychology/workload.png'),

    anger: traitEmotionNegative,
    anxiety: traitEmotionNegative,
    frustration: traitEmotionNegative,
    stress: traitEmotionNegative,

    risk_aversion: traitEmotionNeutral,
    confidence: traitEmotionPositive,

    personality_narcissism: personalityDarkTriad,
    personality_machiavellianism: personalityDarkTriad,
    personality_psychopathy: personalityDarkTriad,

    agreeableness: traitEmotionPositive,
    conscientiousness: traitEmotionPositive,
    openness: traitEmotionPositive,
    stability: traitEmotionPositive,

    extraversion: traitEmotionNeutral,

    dominance: traitEmotionNegative,
    entitlement: traitEmotionNegative,
    grandiosity: traitEmotionNegative,
    superiority: traitEmotionNegative,

    callousness: traitEmotionNegative,
    cynicism: traitEmotionNegative,
    manipulativeness: traitEmotionNegative,
    strategic_calculating: traitEmotionNegative,

    antisocial: traitEmotionNegative,
    impulsivity: traitEmotionNegative,
    thrill_seeking: traitEmotionNegative,

    empathy: traitEmotionPositive,
    self_control: traitEmotionPositive,

};
