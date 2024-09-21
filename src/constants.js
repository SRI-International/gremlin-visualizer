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
    // "get node with name marko" : "g.V().has('name', 'marko')",
    // "get person nodes that marko has outgoing edges to" : "g.V().has('name', 'marko').out().hasLabel('person')"
    "MITRE ATT&CK":                "g.V().has('groups', within('MITRE ATT&CK'))",
    "Volt Typhoon Known TTPs":     "g.V().has('groups', within('Volt Typhoon TTPs'))",
    "Volt Typhoon Known TTPs and Vulnerabilities": "g.V().has('groups', within('Volt Typhoon TTPs','Volt Typhoon Vulnerabilities'))",
    "SOHO Device Vulnerabilities": "g.V().has('groups', within('Vulnerabilities: Cisco','Vulnerabilities: Citrix','Vulnerabilities: Fortinet','Vulnerabilities: Ivanti','Vulnerabilities: PaloAlto','Vulnerabilities: PulseSecure','Vulnerabilities: Sangfor'))",
}

/**
 * Icon string to image mapping.
 * Nodes with label matching the map key will load the associated icon.
 */
export const ICONS = {
    // insert label to icon map here

    // Attack and Attack TTP icons
    attacker_ttp_model: require('./assets/icons/attack/ttp_file.png'),
    attack_tactic:      require('./assets/icons/attack/tactic.png'),
    attack_technique:   require('./assets/icons/attack/technique.png'),
    attack_procedure:   require('./assets/icons/attack/procedure.png'),
    
    attack_goal: require('./assets/icons/attack/attack_goal.png'),
    attack_plan: require('./assets/icons/attack/attack_plan.png'),
    attack_step: require('./assets/icons/attack/attack_step.png'),

    malware:     require('./assets/icons/attack/malware.png'),
    
    // Attacker icons
    threat_actor: require('./assets/icons/threatactors/threat_actor.png'),
    apt_group: require('./assets/icons/threatactors/threat_actor.png'), // Create group icon

    // Logic icons
    logical_and:  require('./assets/icons/logic/and.png'),
    logical_nor:  require('./assets/icons/logic/nor.png'),
    logical_not:  require('./assets/icons/logic/not.png'),
    logical_or:   require('./assets/icons/logic/or.png'),
    logical_xor:  require('./assets/icons/logic/xor.png'),
    logical_nand: require('./assets/icons/logic/nand.png'),
    logical_nxor: require('./assets/icons/logic/nxor.png'),

    // Target Systems
    audio:  require('./assets/icons/targets/audio.png'),
    binary: require('./assets/icons/targets/binary.png'),
    bluetooth: require('./assets/icons/targets/bluetooth.png'),
    bug: require('./assets/icons/targets/bug.png'),
    camera: require('./assets/icons/targets/camera.png'),
    cellular: require('./assets/icons/targets/cellular.png'),
    configuration_file: require('./assets/icons/targets/configuration_file.png'),
    default: require('./assets/icons/targets/default.png'),
    firmware: require('./assets/icons/targets/firmware.png'),
    hardware: require('./assets/icons/targets/hardware.png'),
    libraries: require('./assets/icons/targets/libraries.png'),
    library: require('./assets/icons/targets/library.png'),
    malware: require('./assets/icons/targets/malware.png'),
    memory: require('./assets/icons/targets/memory.png'),
    mobile_phone: require('./assets/icons/targets/mobile_phone.png'),
    multimedia: require('./assets/icons/targets/multimedia.png'),
    operating_system: require('./assets/icons/targets/operating_system.png'),
    processor: require('./assets/icons/targets/processor.png'),
    software: require('./assets/icons/targets/software.png'),
    ssl_certificate: require('./assets/icons/targets/x509_certificate.png'),
    state: require('./assets/icons/targets/state.png'),
    user_account: require('./assets/icons/targets/user_account.png'),
    user_interface: require('./assets/icons/targets/user_interface.png'),
    web_browser: require('./assets/icons/targets/web_browser.png'),
    wifi: require('./assets/icons/targets/wifi.png'),

    // Target System bugs and vulnerabilities
    vulnerability: require('./assets/icons/targets/vulnerability.png'),
    vulnerability_template: require('./assets/icons/targets/vulnerability.png'),
    bug: require('./assets/icons/targets/bug.png'),

    // Defensive systems, reports, etc
        
    // Other old icons
    artifact: require('./assets/icons/archive2/artifact_icon_tiny_round_v1.png'),
    attack_pattern: require('./assets/icons/archive2/attack_pattern_icon_tiny_round_v1.png'),
    autonomous_system: require('./assets/icons/archive2/autonomous_system_icon_tiny_round_v1.png'),
    autonomous_system_product: require('./assets/icons/archive2/autonomous_system_product_icon_tiny_round_v1.png'),
    binary: require('./assets/icons/archive2/binary_icon_tiny_square_v1.png'),
    campaign: require('./assets/icons/archive2/campaign_icon_tiny_round_v1.png'),
    cellular: require('./assets/icons/archive2/cellular_icon_tiny_round_v1.png'),
    coa: require('./assets/icons/archive2/coa_icon_tiny_round_v1.png'),
    course_of_action: require('./assets/icons/archive2/course_of_action_icon_tiny_round_v1.png'),
    custom_object: require('./assets/icons/archive2/custom_object_icon_tiny_round_v1.svg'),
    directory: require('./assets/icons/archive2/directory_icon_tiny_round_v1.png'),
    domain_name: require('./assets/icons/archive2/domain_name_icon_tiny_round_v1.png'),
    email_addr: require('./assets/icons/archive2/email_addr_icon_tiny_round_v1.png'),
    email_message: require('./assets/icons/archive2/email_message_icon_tiny_round_v1.png'),
    firewall: require('./assets/icons/archive2/firewall_icon_v1.png'),
    file: require('./assets/icons/archive2/file_icon_tiny_round_v1.png'),
    // flowchart: require('./assets/icons/archive2/flowchart_icon_tiny_square_v1.png'),
    hardware: require('./assets/icons/archive2/hardware_icon_v1.png'),
    http: require('./assets/icons/archive2/http_icon_tiny_round_v1.png'),
    ics_sensor: require('./assets/icons/archive2/ics_sensor_icon_tiny_square_v1.png'),
    ics_sensor_product: require('./assets/icons/archive2/ics_sensor_product_icon_tiny_square_v1.png'),
    identity: require('./assets/icons/archive2/identity_icon_tiny_round_v1.png'),
    incident: require('./assets/icons/archive2/incident_icon_tiny_round_v1.png'),
    indicator: require('./assets/icons/archive2/indicator_icon_tiny_round_v1.png'),
    infrastructure: require('./assets/icons/archive2/infrastructure_icon_tiny_round_v1.png'),
    intrusion_set: require('./assets/icons/archive2/intrusion_set_icon_tiny_round_v1.png'),
    ipv4_addr: require('./assets/icons/archive2/ipv4_addr_icon_tiny_round_v1.png'),
    ipv6_addr: require('./assets/icons/archive2/ipv6_addr_icon_tiny_round_v1.png'),
    language: require('./assets/icons/archive2/language_icon_tiny_round_v1.png'),
    location: require('./assets/icons/archive2/location_icon_tiny_round_v1.png'),
    mac_addr: require('./assets/icons/archive2/mac_addr_icon_tiny_round_v1.png'),
    malware_analysis: require('./assets/icons/archive2/malware_analysis_icon_tiny_round_v1.png'),
    marking_definition: require('./assets/icons/archive2/marking_definition_icon_tiny_round_v1.png'),
    memory: require('./assets/icons/archive2/memory_icon_tiny_round_v1.png'),
    multimedia: require('./assets/icons/archive2/multimedia_icon_tiny_square_v1.png'),
    mutex: require('./assets/icons/archive2/mutex_icon_tiny_round_v1.png'),
    network_router: require('./assets/icons/archive2/network_router_icon_v1.png'),
    network_switch: require('./assets/icons/archive2/network_switch_icon_v1.png'),
    network_traffic: require('./assets/icons/archive2/network_traffic_icon_tiny_round_v1.png'),
    network_drive: require('./assets/icons/archive2/network_drive_icon_v1.png'),
    nic: require('./assets/icons/archive2/nic_icon_v1.png'),
    note: require('./assets/icons/archive2/note_icon_tiny_round_v1.png'),
    observed_data: require('./assets/icons/archive2/observed_data_icon_tiny_round_v1.png'),
    opinion: require('./assets/icons/archive2/opinion_icon_tiny_round_v1.png'),
    process: require('./assets/icons/archive2/process_icon_tiny_round_v1.png'),
    printer: require('./assets/icons/archive2/printer_icon_tiny_square_v1.png'),
    relationship: require('./assets/icons/archive2/relationship_icon_tiny_round_v1.png'),
    report: require('./assets/icons/archive2/report_icon_tiny_round_v1.png'),
    sighting: require('./assets/icons/archive2/sighting_icon_tiny_round_v1.png'),
    source: require('./assets/icons/archive2/source_icon_tiny_round_v1.png'),
    tlp: require('./assets/icons/archive2/tlp_icon_tiny_round_v1.png'),
    tool: require('./assets/icons/archive2/tool_icon_tiny_round_v1.png'),
    url: require('./assets/icons/archive2/url_icon_tiny_round_v1.png'),
    victim: require('./assets/icons/archive2/victim_icon_tiny_round_v1.png'),
    victim_target: require('./assets/icons/archive2/victim_target_icon_tiny_round_v1.png'),
    workstation: require('./assets/icons/archive2/workstation_icon_tiny_square_v1.png'),
    windows_registry_key: require('./assets/icons/archive2/windows_registry_key_icon_tiny_round_v1.png'),
    x509_certificate: require('./assets/icons/archive2/x509_certificate_icon_tiny_square_v1.png'),
};
