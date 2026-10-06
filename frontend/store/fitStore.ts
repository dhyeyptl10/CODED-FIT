import { create } from 'zustand';
import { BodyArchetype, PreferredFit, StandardSize, FitProfile } from '@coded-fit/shared';

interface FitStore {
  heightCm: number;
  weightKg: number;
  chestIn: number;
  waistIn: number;
  hipIn: number;
  shoulderIn: number;
  inseamIn: number;
  neckIn: number;
  bodyShape: BodyArchetype;
  preferredFit: PreferredFit;
  bmi: number;
  recommendedSize: StandardSize;
  confidenceScore: number;
  isAIEstimated: boolean;
  verifiedByUser: boolean;

  setMeasurement: (key: 'heightCm' | 'weightKg' | 'chestIn' | 'waistIn' | 'hipIn' | 'shoulderIn' | 'inseamIn' | 'neckIn', val: number) => void;
  setArchetype: (shape: BodyArchetype) => void;
  setPreferredFit: (fit: PreferredFit) => void;
  setAIMeasurements: (measurements: Partial<FitProfile>, confidence: number) => void;
  verifyByUser: () => void;
  getProfileSnapshot: () => FitProfile;
}

const computeBMI = (heightCm: number, weightKg: number): number => {
  if (!heightCm || !weightKg) return 22.5;
  const m = heightCm / 100;
  return parseFloat((weightKg / (m * m)).toFixed(1));
};

const computeSize = (chestIn: number): StandardSize => {
  if (chestIn < 36) return 'XS';
  if (chestIn < 39) return 'S';
  if (chestIn < 42) return 'M';
  if (chestIn < 45) return 'L';
  if (chestIn < 48) return 'XL';
  return 'XXL';
};

export const useFitStore = create<FitStore>((set, get) => ({
  heightCm: 178,
  weightKg: 72,
  chestIn: 40,
  waistIn: 32,
  hipIn: 38,
  shoulderIn: 18,
  inseamIn: 31,
  neckIn: 15.5,
  bodyShape: 'athletic',
  preferredFit: 'regular',
  bmi: 22.7,
  recommendedSize: 'M',
  confidenceScore: 0,
  isAIEstimated: false,
  verifiedByUser: false,

  setMeasurement: (key, val) => {
    set((state) => {
      const next = { ...state, [key]: val, verifiedByUser: true };
      const bmi = key === 'heightCm' || key === 'weightKg' ? computeBMI(next.heightCm, next.weightKg) : state.bmi;
      const size = key === 'chestIn' ? computeSize(val) : state.recommendedSize;
      return { ...next, bmi, recommendedSize: size };
    });
  },

  setArchetype: (bodyShape) => set({ bodyShape, verifiedByUser: true }),
  setPreferredFit: (preferredFit) => set({ preferredFit }),

  setAIMeasurements: (m, confidence) => {
    set((state) => {
      const heightCm = m.heightCm ?? state.heightCm;
      const weightKg = m.weightKg ?? state.weightKg;
      const chestIn = m.chestIn ?? state.chestIn;
      return {
        ...state,
        ...m,
        bmi: computeBMI(heightCm, weightKg),
        recommendedSize: computeSize(chestIn),
        confidenceScore: confidence,
        isAIEstimated: true,
        verifiedByUser: false
      };
    });
  },

  verifyByUser: () => set({ verifiedByUser: true }),

  getProfileSnapshot: () => {
    const s = get();
    return {
      heightCm: s.heightCm,
      weightKg: s.weightKg,
      chestIn: s.chestIn,
      waistIn: s.waistIn,
      hipIn: s.hipIn,
      shoulderIn: s.shoulderIn,
      inseamIn: s.inseamIn,
      neckIn: s.neckIn,
      bodyShape: s.bodyShape,
      preferredFit: s.preferredFit,
      bmi: s.bmi,
      recommendedSize: s.recommendedSize,
      confidenceScore: s.confidenceScore,
      isAIEstimated: s.isAIEstimated,
      verifiedByUser: s.verifiedByUser,
      verifiedByTailor: false
    };
  }
}));
