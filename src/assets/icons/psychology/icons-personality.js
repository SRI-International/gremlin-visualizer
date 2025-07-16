/**
 * Icon string to image mapping.
 * Nodes with label matching the map key will load the associated icon.
 */
export const personality          = require('./personality_normal.png');
export const personalityNormal    = require('./personality_normal.png');
export const personalityDarkTriad = require('./personality_dark_triad.png');
export const traitEmotionNegative = require('./trait_emotion_negative.png');
export const traitEmotionPositive = require('./trait_emotion_positive.png');
export const traitEmotionNeutral  = require('./trait_emotion_neutral.png');

export const PERSONALITY_ICONS = {
    
    // ** Psychology Theory
    attention: require('./attention.png'),
    fatigue: require('./fatigue.png'),
    workload: require('./workload.png'),
    
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
    overclaiming: traitEmotionNegative,
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
    cognitive_reflection: traitEmotionNeutral,
    risk_propensity: traitEmotionNeutral,
    
    // Emotional States
    anxiety: traitEmotionNegative,
    frustration: traitEmotionNegative,
    stress: traitEmotionNegative,
    confidence: traitEmotionNeutral,
    risk_aversion: traitEmotionNeutral,
    
    // Personality Types
    personality: personalityNormal,
    personality_normal: personalityNormal,
    personality_narcissism: personalityDarkTriad,
    personality_psychopathy: personalityDarkTriad,
    personality_machiavellianism: personalityDarkTriad,
};
