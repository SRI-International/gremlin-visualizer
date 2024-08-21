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
    // OS
    android_operating_system:  'layout_label',
    operating_system:          'layout_label',
    //  Kernel and Drivers
    android_kernel:            'layout_label',
    android_boot_loader:       'layout_label',
    android_power_manager:     'layout_label',
    android_kernel_binder:     'layout_label',
    // Kernel Drivers
    android_audio_driver:      'layout_label',
    android_bluetooth_driver:  'layout_label',
    android_camera_driver:     'layout_label',
    android_display_driver:    'layout_label',
    android_keypad_driver:     'layout_label',
    android_memory_driver:     'layout_label',
    android_storage_driver:    'layout_label',
    android_usb_driver:        'layout_label',
    android_wifi_driver:       'layout_label',
    // HAL
    android_hardware_abstraction_layer: 'layout_label',
    android_audio_ha:          'layout_label',
    android_binder_ha:         'layout_label',
    android_bluetooth_ha:      'layout_label',
    android_camera_ha:         'layout_label',
    android_media_ha:          'layout_label',
    android_telephony_ha:      'layout_label',
    android_wifi_ha:           'layout_label',
    // Libraries
    android_core_library:      'layout_label',
    android_native_libraries:  'layout_label',
    android_binder_library:    'layout_label',
    android_bluetooth_library: 'layout_label',
    android_camera_library:    'layout_label',
    android_debuggerd_library: 'layout_label',
    android_libc:              'layout_label',
    android_libutils:          'layout_label',
    android_media_library:     'layout_label',
    android_open_gl_library:   'layout_label',
    android_shared_memory_library: 'layout_label',
    android_ssl_library:       'layout_label',
    // Runtime
    android_runtime:           'layout_label',
    android_core_library:      'layout_label',
    android_bluetooth_service: 'layout_label',
    // UI and Apps
    android_framework:         'layout_label',
    user_interface:            'layout_label',
    dialer_app:                'layout_label',
    web_browser_app:           'layout_label',
    email_app:                 'layout_label',
    calendar_app:              'layout_label',
    camera_app:                'layout_label',
    battery_app:               'layout_label',
    bluetooth_app:             'layout_label',

    // Bugs, vulns, malware
    vulnerability:             'layout_label',
    exploit:                   'layout_label',
    exploit_primitive:         'layout_label',
    system_state:              'layout_label',
    malware:                   'layout_label',
}

export const SAVED_QUERIES = {

// "get node with name marko" : "g.V().has('name', 'marko')",
// "get person nodes that marko has outgoing edges to" : "g.V().has(lname', 'marko').out().hasLabel('person')"

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
    // OS
    android_operating_system:  require("./icons/android.png"),
    operating_system:          require("./icons/operating_system.png"),
    //  Kernel
    android_kernel:            require("./icons/operating_system.png"),
    android_boot_loader:       require("./icons/firmware.png"),
    android_power_manager:     require("./icons/battery.png"),
    android_kernel_binder:     require("./icons/binary.png"),
    // Kernel Drivers
    android_audio_driver:      require("./icons/audio.png"),
    android_bluetooth_driver:  require("./icons/bluetooth.png"),
    android_camera_driver:     require("./icons/camera.png"),
    android_display_driver:    require("./icons/touchscreen.png"),
    android_keypad_driver:     require("./icons/keypad.png"),
    android_memory_driver:     require("./icons/memory.png"),
    android_storage_driver:    require("./icons/disk.png"),
    android_usb_driver:        require("./icons/usb.png"),
    android_wifi_driver:       require("./icons/wifi.png"),
    // HAL
    android_hardware_abstraction_layer: require("./icons/binary.png"),
    android_audio_ha:          require("./icons/audio.png"),
    android_binder_ha:         require("./icons/binary.png"),
    android_bluetooth_ha:      require("./icons/bluetooth.png"),
    android_camera_ha:         require("./icons/camera.png"),
    android_media_ha:          require("./icons/multimedia.png"),
    android_telephony_ha:      require("./icons/cellular.png"),
    android_wifi_ha:           require("./icons/wifi.png"),
    // Libraries
    android_native_libraries:  require("./icons/libraries.png"),
    android_binder_library:    require("./icons/library.png"),
    android_bluetooth_library: require("./icons/bluetooth.png"),
    android_camera_library:    require("./icons/camera.png"),
    android_debuggerd_library: require("./icons/library.png"),
    android_libc:              require("./icons/library.png"),
    android_libutils:          require("./icons/library.png"),
    android_media_library:     require("./icons/multimedia.png"),
    android_open_gl_library:   require("./icons/library.png"),
    android_shared_memory_library: require("./icons/memory.png"),
    android_ssl_library:       require("./icons/x509_certificate.png"),
    // Runtime
    android_runtime:           require("./icons/binary.png"),
    android_core_library:      require("./icons/library.png"),
    android_bluetooth_service: require("./icons/bluetooth.png"),
    // UI and Apps
    android_framework:         require("./icons/binary.png"),
    user_interface:            require("./icons/user_interface.png"),
    dialer_app:                require("./icons/dialer.png"),
    web_browser_app:           require("./icons/web_browser.png"),
    email_app:                 require("./icons/email.png"),
    calendar_app:              require("./icons/calendar.png"),
    camera_app:                require("./icons/camera.png"),
    battery_app:               require("./icons/battery.png"),
    bluetooth_app:             require("./icons/bluetooth.png"),

    // Bugs, vulns, malware
    vulnerability:             require("./icons/vulnerability.png"),
    exploit:                   require("./icons/malware.png"),
    exploit_primitive:         require("./icons/malware.png"),
    system_state:              require("./icons/state.png"),
    malware:                   require("./icons/malware.png"),

};
