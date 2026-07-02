import { DEFAULT_RUBRIC_WEIGHTS, type Rubric } from '../../types';

interface RubricOptions {
  requiredConcepts: string[];
  mechanismSteps: string[];
  prohibitedClaims?: string[];
  terminologyKeywords?: string[];
  minTotalLength?: number;
  maxTotalLength?: number;
}

export function createRubric(options: RubricOptions): Rubric {
  return {
    weights: DEFAULT_RUBRIC_WEIGHTS,
    requiredConcepts: options.requiredConcepts,
    mechanismSteps: options.mechanismSteps,
    prohibitedClaims: options.prohibitedClaims ?? [],
    terminologyKeywords: options.terminologyKeywords ?? [],
    minTotalLength: options.minTotalLength ?? 120,
    maxTotalLength: options.maxTotalLength ?? 1400,
  };
}
