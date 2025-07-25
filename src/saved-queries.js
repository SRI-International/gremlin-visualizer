/**
 * Saved queries name to gremlin query string mapping.
 * The key will be the query name, and execute the associated gremlin query.
 * Saved queries appear on the saved queries tab.
 */
export const SAVED_QUERIES = {
    //
    // ColVuln Libraries
    "CogVuln Trigger Library":              "g.V().has('component_class','bias_trigger').order().by('name', asc)",
    "CogVuln Sensor Library":               "g.V().has('component_class','bias_sensor').order().by('name', asc)",
    //
    // Cognitive Biases
    "Cognitive Bias: Anchoring": "g.V().has('cogbias_class', 'anchoring_bias').inE('susceptible_to').has('score', gt(5.25)).as('e').bothV()",
    "Cognitive Bias: Confirmation": "g.V().has('cogbias_class', 'confirmation_bias').inE('susceptible_to').has('score', gt(5.0)).as('e').bothV()",
    "Cognitive Bias: Loss Aversion": "g.V().has('cogbias_class', 'loss_aversion').inE('susceptible_to').has('score', gt(5.25)).as('e').bothV()",
    "Cognitive Bias: Representativeness": "g.V().has('cogbias_class', 'representativeness_bias').inE('susceptible_to').has('score', gt(5.25)).as('e').bothV()",
    "Cognitive Bias: Social Cultural": "g.V().has('cogbias_class', 'social_cultural_bias').inE('susceptible_to').has('score', gt(5.25)).as('e').bothV()",
    //
    // Culture Cognitive Biases
    "Culture Biases: Asian": "g.V().has('name','AsianCulture').bothE('susceptible_to').as('e').bothV().as('v').select('v')",
    "Culture Biases > 5.5: Asian": "g.V().has('name','AsianCulture').bothE('susceptible_to').has('score', gt(5.5)).as('e').bothV().as('v').select('v')",
    "Culture Biases: EasternAsian": "g.V().has('name','EasternAsianCulture').bothE('susceptible_to').as('e').bothV().as('v').select('v')",
    "Culture Biases > 5.5: EasternAsian": "g.V().has('name','EasternAsianCulture').bothE('susceptible_to').has('score', gt(5.5)).as('e').bothV().as('v').select('v')",
    //"Overlapping Cognitive Biases for the 'Big Four (OWID)'": "g.V().has('name', within('AfricanCulture', 'AsianCulture', 'EuropeanCulture', 'NorthAmericanCulture', 'SouthAmericanCulture', 'OceanianCulture')).outE('susceptible_to').bothV()",
    //
    // Theory
    "Theory: CogVulns":                     "g.V().has('groups', 'Cognitive Vulnerability Theory')",
    "Theory: CogBias - Anchoring":          "g.V().has('cogbias_class', 'anchoring_bias').order().by('name',asc)",
    "Theory: CogBias - Confirmation":       "g.V().has('cogbias_class', 'conformation_bias').order().by('name',asc)",
    "Theory: CogBias - Loss Aversion":      "g.V().has('cogbias_class', 'loss_aversion').order().by('name',asc)",
    "Theory: CogBias - Representativeness": "g.V().has('cogbias_class', 'representativeness_bias').order().by('name',asc)",
    "Theory: CogBias - Social/Cultural":    "g.V().has('cogbias_class', 'social_cultural_bias').order().by('name',asc)",
    "Theory: Personalities":                "g.V().has('groups', 'Personality Theory').order().by('name',asc)",
    "Theory: Data":                         "g.V().has('groups', 'Data Theory').order().by('name',asc)",
    //
    // Cultures
    "Regional Cultures":                    "g.V().has('culture_type','geographic').has('area_level','region').order().by('name', asc)",
    "Subregional Cultures":                 "g.V().has('culture_type','geographic').has('area_level','subregion').order().by('name', asc)",
    "Intermediate Region Cultures":         "g.V().has('culture_type','geographic').has('area_level','intermediate').order().by('name', asc)",
    "National Cultures":                    "g.V().has('culture_type','geographic').has('area_level','national').order().by('name', asc)",
    "All Geographic Cultures":              "g.V().has('culture_type','geographic').order().by('name', asc)",
    //
    // Attack TTPs
    //
    // T1583
    "MITRE ATT&CK Tactics":                 "g.V().has('ttp_class', 'attack-tactic')",
    "Attack Techniques w/ Sub-Techniques":  "g.V().has('ttp_class', 'attack-technique').where(inE('implements'))",
    // Data (for sensors)
    //"Data: Personalities":                "g.V().has('groups', within('Data Theory'))",
    //
    // Threat Actors
    //"Reference Hacker 1":                   "g.V().has('groups', within('Reference Hacker 1'))",
    //"Reference Hacker 2":                   "g.V().has('groups', within('Reference Hacker 2'))",
    //"Reference Hacker 3":                   "g.V().has('groups', within('Reference Hacker 3'))",
    //"Reference Hacker 4":                   "g.V().has('groups', within('Reference Hacker 4'))",
}
