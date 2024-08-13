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
    //  Kernel and Drivers
    android_kernel:            'name',
    android_memory_driver:     'name',
    android_boot_loader:       'name',
    android_kernel_binder:     'name',
    android_storage_driver:    'name',
    android_wifi_driver:       'name',
    // HAL
    android_hardware_abstraction_layer: 'name',
    android_media_ha:          'name',
    android_audio_ha:          'name',
    android_binder_ha:         'name',
    android_wifi_ha:           'name',
    android_telephony_ha:      'name',
    android_camera_ha:         'name',
    // Libraries
    android_native_libraries:  'name',
    android_media_library:     'name',
    android_ssl_library:       'name',
    android_debuggerd_library: 'name',
    android_libutils:          'name',
    android_binder_library:    'name',
    android_bluetooth_library: 'name',
    android_camera_library:    'name',
    android_shared_memory_library: 'name',
    android_open_gl_library:   'name',
    android_libc:              'name',
    // Runtime
    android_runtime:           'name',
    android_core_library:      'name',
    android_framework:         'name',
    // OS
    android_operating_system:  'name',
    operating_system:          'name',
    // UI and Apps
    user_interface:            'name',
    web_browser:               'name',

    // Bugs, vulns, malware
    vulnerability:             'name',
    exploit:                   'name',
    system_state:              'name',
    malware:                   'name',
}

export const SAVED_QUERIES = {

// "get node with name marko" : "g.V().has('name', 'marko')",
// "get person nodes that marko has outgoing edges to" : "g.V().has('name', 'marko').out().hasLabel('person')"

    "Google Android 12 System" : "g.V().has('groups', 'Product: Google Android 12 System')",
    "Exploit Chain Mystique" : "g.V().has('groups', 'Exploit Chain: Mystique')",
}

/**
 * Icons can be PNG or JPG format.
 *
 * Icons that are transparent PNG will float on a white background.
 *
 * Icons size guidelines:
 *
 *   * Round: 37x37
 *   * Square: 30x30
 */
export const ICONS = {
    default:                   require("./icons/default.png"),
    //  Kernel and Drivers
    android_kernel:            require("./icons/operating_system.png"),
    android_memory_driver:     require("./icons/memory.png"),
    android_boot_loader:       require("./icons/firmware.png"),
    android_kernel_binder:     require("./icons/binary.png"),
    android_storage_driver:    require("./icons/binary.png"),
    android_wifi_driver:       require("./icons/wifi.png"),
    // HAL
    android_hardware_abstraction_layer: require("./icons/binary.png"),
    android_audio_ha:          require("./icons/audio.png"),
    android_binder_ha:         require("./icons/binary.png"),
    android_camera_ha:         require("./icons/camera.png"),
    android_media_ha:          require("./icons/multimedia.png"),
    android_telephony_ha:      require("./icons/cellular.png"),
    android_wifi_ha:           require("./icons/wifi.png"),
    // Libraries
    android_core_library:      require("./icons/library.png"),
    android_native_libraries:  require("./icons/libraries.png"),
    android_media_library:     require("./icons/multimedia.png"),
    android_ssl_library:       require("./icons/x509_certificate.png"),
    android_debuggerd_library: require("./icons/library.png"),
    android_libutils:          require("./icons/library.png"),
    android_binder_library:    require("./icons/library.png"),
    android_bluetooth_library: require("./icons/bluetooth.png"),
    android_camera_library:    require("./icons/camera.png"),
    android_shared_memory_library: require("./icons/memory.png"),
    android_open_gl_library:   require("./icons/library.png"),
    android_libc:              require("./icons/library.png"),
    // Runtime
    android_runtime:           require("./icons/binary.png"),
    android_framework:         require("./icons/binary.png"),
    // OS
    android_operating_system:  require("./icons/operating_system.png"),
    operating_system:          require("./icons/operating_system.png"),
    // UI and Apps
    user_interface:            require("./icons/user_interface.png"),
    web_browser:               require("./icons/web_browser.png"),

    // Bugs, vulns, malware
    vulnerability:             require("./icons/vulnerability.png"),
    exploit:                   require("./icons/malware.png"),
    system_state:              require("./icons/state.png"),
    malware:                   require("./icons/malware.png"),

};
