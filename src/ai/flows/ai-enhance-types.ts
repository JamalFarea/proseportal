import {z} from 'genkit';

export const EnhanceType = {
  IMPROVE_WRITING: 'improve-writing',
  FIX_GRAMMAR: 'fix-grammar',
  MAKE_SHORTER: 'make-shorter',
  MAKE_LONGER: 'make-longer',
  CHANGE_TONE: 'change-tone',
  TRANSLATE_ARABIC: 'translate-arabic',
  TRANSLATE_ENGLISH: 'translate-english',
} as const;

export type EnhanceType = (typeof EnhanceType)[keyof typeof EnhanceType];

export const EnhanceTypeEnum = z.enum([
  'improve-writing',
  'fix-grammar',
  'make-shorter',
  'make-longer',
  'change-tone',
  'translate-arabic',
  'translate-english',
]);
