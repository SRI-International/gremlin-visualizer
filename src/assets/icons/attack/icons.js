/**
 * Icon string to image mapping.
 * Nodes with label matching the map key will load the associated icon.
 */

export const ATTACK_ICONS = {
    
    // ** Attack and Attack TTP icons
    mitre_attack_model:   require('./ttp_file.png'),
    attacker_ttp_model:   require('./ttp_file.png'),
    attack_tactic:        require('./attack_tactic.png'),
    attack_technique:     require('./attack_technique.png'),
    attack_sub_technique: require('./attack_sub_technique.png'),
    attack_procedure:     require('./attack_procedure.png'),
    
    attack_goal: require('./attack_goal.png'),
    attack_plan: require('./attack_plan.png'),
    attack_step: require('./attack_step.png'),

    malware:     require('./malware.png'),
    
};
