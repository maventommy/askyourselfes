import { assertStringIncludes } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { buildAgingPrompt } from './prompt.ts';

Deno.test('aging prompt carries target age and identity preservation', () => {
  const p = buildAgingPrompt(67);
  assertStringIncludes(p, '67');
  assertStringIncludes(p.toLowerCase(), 'same person');
});

Deno.test('aging prompt requests the brand look', () => {
  const p = buildAgingPrompt(54).toLowerCase();
  assertStringIncludes(p, 'photorealistic');
  assertStringIncludes(p, 'warm');
});
