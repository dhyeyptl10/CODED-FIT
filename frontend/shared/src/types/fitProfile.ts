/**
 * CODED FIT — Fit Profile & Anthropometric Types
 */

export type BodyArchetype =
  | 'athletic'
  | 'hourglass'
  | 'rectangle'
  | 'pear'
  | 'inverted_triangle'
  | 'plus';

export type PreferredFit = 'slim' | 'regular' | 'relaxed' | 'oversized';

export type StandardSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Bespoke';

export interface BodyMeasurements {
  heightCm: number;
  weightKg: number;
  chestIn: number;
  waistIn: number;
  hipIn: number;
  shoulderIn?: number;
  sleeveIn?: number;
  inseamIn?: number;
  neckIn?: number;
}

export interface FitProfile extends BodyMeasurements {
  id?: string;
  userId?: string;
  bodyShape: BodyArchetype;
  preferredFit: PreferredFit;
  preferredLength?: 'cropped' | 'standard' | 'longline';
  bmi?: number;
  recommendedSize: StandardSize;
  confidenceScore?: number; // 0 to 100
  isAIEstimated: boolean; // Explicitly distinguishes AI estimate from user-verified
  verifiedByUser: boolean;
  verifiedByTailor: boolean;
  notes?: string;
  updatedAt?: string;
}
