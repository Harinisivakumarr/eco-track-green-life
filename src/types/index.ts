
// User types
export interface UserProfile {
  id: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: Date;
  totalCarbonSaved: number;
  greenPoints: number;
  badges: Badge[];
}

// Carbon calculation types
export interface FootprintFormData {
  electricity: number;
  naturalGas: number;
  heating: number; 
  carMiles: number;
  publicTransportMiles: number;
  flights: {
    shortHaul: number;
    mediumHaul: number;
    longHaul: number;
  };
  diet: DietType;
  wasteRecycling: number;
}

export type DietType = 'meat-heavy' | 'average' | 'vegetarian' | 'vegan';

export interface FootprintResult {
  totalEmissions: number;
  breakdown: {
    homeEnergy: number;
    transportation: number;
    flights: number;
    diet: number;
    waste: number;
  };
  date: Date;
}

// Activity and reporting
export interface EcoAction {
  id: string;
  userId: string;
  type: EcoActionType;
  points: number;
  emissionsSaved: number;
  date: Date;
  description: string;
}

export type EcoActionType = 
  | 'energy-saving'
  | 'sustainable-transport'
  | 'diet-change'
  | 'waste-reduction'
  | 'water-saving'
  | 'other';

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  unlockedAt: Date | null;
}

export interface Report {
  id: string;
  userId: string;
  title: string;
  description: string;
  fileUrl: string;
  createdAt: Date;
  type: 'monthly' | 'quarterly' | 'annual' | 'custom';
}

export interface DailyTip {
  id: string;
  title: string;
  content: string;
  category: string;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  potentialImpact: number;
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}
