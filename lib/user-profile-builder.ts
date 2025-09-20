import { OnboardingProfile } from './roadmap-types';
import { RegionalContext } from './regional-analysis';

export interface UserProfile {
  id: string;
  userInfo: {
    cityState: string;
  };
  preferences: {
    communicationStyle: string;
    learningStyle: string;
    riskTolerance: string;
    qualityVsSpeed: string;
  };
  constraints: {
    budget: string;
    timeline: string;
    physical: string[];
    environmental: string[];
    regulatory: string[];
  };
  goals: {
    primary: string[];
    secondary: string[];
    longTerm: string[];
  };
}

/**
 * Build user profile from onboarding data and regional context
 * Focuses on user preferences, constraints, and goals only
 */
export async function buildUserProfile(
  onboardingProfile: OnboardingProfile,
  regionalContext: RegionalContext
): Promise<UserProfile> {
  try {
    console.log(`Building user profile for location: ${onboardingProfile.cityState}`);
    
    const userProfile: UserProfile = {
      id: generateUserId(),
      userInfo: buildUserInfo(onboardingProfile),
      preferences: buildPreferences(onboardingProfile),
      constraints: buildConstraints(onboardingProfile, regionalContext),
      goals: buildGoals(onboardingProfile)
    };
    
    console.log(`User profile built successfully:`, {
      id: userProfile.id,
      cityState: userProfile.userInfo.cityState
    });
    
    return userProfile;
    
  } catch (error) {
    console.error(`Error building user profile:`, error);
    throw error;
  }
}

/**
 * Build user information section
 */
function buildUserInfo(profile: OnboardingProfile): UserProfile['userInfo'] {
  return {
    cityState: profile.cityState
  };
}


/**
 * Build user preferences section
 */
function buildPreferences(profile: OnboardingProfile): UserProfile['preferences'] {
  return {
    communicationStyle: 'Not specified', // Would need to be added to questionnaire
    learningStyle: 'Not specified', // Would need to be added to questionnaire
    riskTolerance: 'Not specified', // Would need to be added to questionnaire
    qualityVsSpeed: 'Not specified' // Would need to be added to questionnaire
  };
}

/**
 * Build constraints section
 */
function buildConstraints(
  profile: OnboardingProfile, 
  regionalContext: RegionalContext
): UserProfile['constraints'] {
  return {
    budget: 'Not specified', // Would need to be added to questionnaire
    timeline: profile.targetStartDate ? 'Fixed Start Date' : 'Not specified',
    physical: [], // Would need to be added to questionnaire
    environmental: deriveEnvironmentalConstraints(regionalContext), // Based on location
    regulatory: deriveRegulatoryConstraints(regionalContext) // Based on location
  };
}

/**
 * Build goals section
 */
function buildGoals(profile: OnboardingProfile): UserProfile['goals'] {
  return {
    primary: ['Complete construction project'], // Generic goal - construction method handled in project context
    secondary: profile.background ? [profile.background] : ['No specific secondary goals provided'],
    longTerm: ['Not specified'] // Would need to be added to questionnaire
  };
}


/**
 * Derive environmental constraints from regional context
 */
function deriveEnvironmentalConstraints(regionalContext: RegionalContext | undefined): string[] {
  const constraints: string[] = [];
  
  if (!regionalContext) {
    return ['Standard environmental considerations'];
  }
  
  if (regionalContext.secondaryClassifications?.includes('Hurricane Zone')) {
    constraints.push('Hurricane-Resistant Construction Requirements');
  }
  
  if (regionalContext.secondaryClassifications?.includes('Wildfire Zone')) {
    constraints.push('Wildfire-Resistant Construction Requirements');
  }
  
  if (regionalContext.secondaryClassifications.includes('Tornado Alley')) {
    constraints.push('Tornado-Resistant Construction Requirements');
  }
  
  if (regionalContext.secondaryClassifications.includes('Desert Climate')) {
    constraints.push('Desert Climate Construction Requirements');
  }
  
  if (regionalContext.multipliers.weatherDependent > 1.5) {
    constraints.push('Weather-Sensitive Construction Schedule');
  }
  
  return constraints.length > 0 ? constraints : ['Standard Environmental Requirements'];
}

/**
 * Derive regulatory constraints from regional context
 */
function deriveRegulatoryConstraints(regionalContext: RegionalContext | undefined): string[] {
  const constraints: string[] = [];
  
  if (!regionalContext) {
    return ['Standard regulatory requirements'];
  }
  
  if (regionalContext.multipliers?.permitHeavy > 1.5) {
    constraints.push('Heavy Permit Requirements and Inspections');
  }
  
  if (regionalContext.primaryClassification === 'High Regulation') {
    constraints.push('High Regulation Area - Additional Requirements');
  }
  
  if (regionalContext.primaryClassification === 'California') {
    constraints.push('California Building Code Requirements');
  }
  
  if (regionalContext.secondaryClassifications.includes('Remote Location')) {
    constraints.push('Remote Location - Limited Access Requirements');
  }
  
  return constraints.length > 0 ? constraints : ['Standard Building Code Requirements'];
}

/**
 * Generate unique user ID
 */
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
