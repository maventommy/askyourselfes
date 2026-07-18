import { assertStringIncludes } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { buildSystemPrompt } from './prompt.ts';

Deno.test('system prompt grounds in profile + states honesty rule', () => {
  const p = buildSystemPrompt({
    display_name: 'Tom',
    current_age: 25,
    future_age: 55,
    profile_json: { worried_about: 'whether to move cities' },
  });
  assertStringIncludes(p, 'Tom');
  assertStringIncludes(p, '55');
  assertStringIncludes(p, 'move cities');
  assertStringIncludes(p.toLowerCase(), 'honest');
});

Deno.test('tone becomes a behavior instruction, not a fact line', () => {
  const p = buildSystemPrompt({
    display_name: 'Tom',
    current_age: 25,
    future_age: 55,
    profile_json: { worried_about: 'moving', tone: 'blunt' },
  });
  assertStringIncludes(p.toLowerCase(), 'blunt');
  if (p.includes('- tone:')) throw new Error('tone leaked into facts list');
});

Deno.test('handles empty profile without throwing', () => {
  const p = buildSystemPrompt({
    display_name: null,
    current_age: null,
    future_age: null,
    profile_json: {},
  });
  assertStringIncludes(p, 'friend');
  assertStringIncludes(p, '25'); // default current age
  assertStringIncludes(p, '55'); // default future age (25+30)
});
