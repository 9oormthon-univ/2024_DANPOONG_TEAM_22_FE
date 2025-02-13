
export const BackType = {
  GRADATION: 'gradation',
  SOLID: 'solid',
  MAIN: 'main',
} as const;

export type BackType = (typeof BackType)[keyof typeof BackType];