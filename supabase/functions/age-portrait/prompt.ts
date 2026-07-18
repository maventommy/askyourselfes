export function buildAgingPrompt(futureAge: number): string {
  return [
    `Age this exact same person to ${futureAge} years old.`,
    `Preserve identity completely: same person, same bone structure, same eye color, same expression warmth.`,
    `Natural aging only: gray in the hair, life lines, gentle skin texture.`,
    `Warm dark editorial portrait, soft window light, dark knit sweater, blurred warm home interior behind them.`,
    `Photorealistic.`,
  ].join(' ');
}
