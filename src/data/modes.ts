import type { WritingMode } from '../types/writing';

export const writingModes: WritingMode[] = [
{
  id: 'object',
  name: 'Object',
  title: 'Object Writing',
  lines: ['Take something ordinary.', 'Look at it until it becomes interesting.'],
  summary: 'An ordinary object, examined through seven lenses until it stops being ordinary.',
  lenses: ['Sight', 'Sound', 'Smell', 'Taste', 'Touch', 'Memory', 'Emotion'],
  details: [
  { label: 'Time', value: '12 minutes' },
  { label: 'Begins with', value: 'A random object' },
  { label: 'Builds', value: 'Precision and surprise' }],

  defaultMinutes: 12,
  ritual: 'Look closer.',
  hasSetup: false,
  prompts: [],
  theme: { panel: 'bg-cream text-ink', muted: 'text-ink/65', accent: 'text-ember', rule: 'border-ink/15', hex: '#8A5520' }
},
{
  id: 'focused',
  name: 'Focused',
  title: 'Focused Writing',
  lines: ['Choose a prompt. Set a clock.', 'Write without stopping.'],
  summary: 'One prompt, one duration, no going back to fix things. The clock keeps you honest.',
  lenses: ['5 min', '10 min', '15 min', '25 min', '45 min'],
  details: [
  { label: 'Time', value: '5 to 45 minutes' },
  { label: 'Begins with', value: 'A prompt you choose' },
  { label: 'Builds', value: 'Momentum and nerve' }],

  defaultMinutes: 15,
  ritual: 'Begin.',
  hasSetup: true,
  prompts: [],
  theme: { panel: 'bg-navy text-paper', muted: 'text-paper/65', accent: 'text-glow', rule: 'border-paper/20', hex: '#D39A55' }
},
{
  id: 'free',
  name: 'Free',
  title: 'Free Writing',
  lines: ['No prompt. No rules.', 'Just write.'],
  summary: 'Nothing to answer and nobody to answer to. Follow the sentence wherever it goes.',
  lenses: ['No prompt', 'No clock', 'No rules'],
  details: [
  { label: 'Time', value: 'As long as you like' },
  { label: 'Begins with', value: 'Nothing at all' },
  { label: 'Builds', value: 'Voice and ease' }],

  defaultMinutes: null,
  ritual: 'Let go.',
  hasSetup: false,
  prompts: [],
  theme: { panel: 'bg-ink text-paper', muted: 'text-paper/60', accent: 'text-glow', rule: 'border-paper/15', hex: '#E6DDCB' }
},
{
  id: 'reflection',
  name: 'Reflection',
  title: 'Reflection',
  lines: ['Look backward.', 'Write about something that happened.'],
  summary: 'Return to a moment and stay with it longer than you did the first time.',
  lenses: ['Yesterday', 'Last year', 'Long ago'],
  details: [
  { label: 'Time', value: '15 minutes' },
  { label: 'Begins with', value: 'A memory' },
  { label: 'Builds', value: 'Understanding' }],

  defaultMinutes: 15,
  ritual: 'Look back.',
  hasSetup: false,
  prompts: [
  'Write about the last time you changed your mind about someone.',
  'Describe a conversation you replayed for days afterward.',
  'What did this week teach you that you didn’t ask to learn?',
  'Return to a kitchen you used to know. Who is in it?',
  'Write about a door that closed, and what was on the other side.'],

  theme: { panel: 'bg-forest text-paper', muted: 'text-paper/70', accent: 'text-[#D9C79E]', rule: 'border-paper/20', hex: '#D9C79E' }
},
{
  id: 'observation',
  name: 'Observation',
  title: 'Observation',
  lines: ['Look up.', 'Write what is happening around you.'],
  summary: 'The present tense, taken seriously. Sounds, gestures, light — whatever is here right now.',
  lenses: ['Here', 'Now', 'Nearby'],
  details: [
  { label: 'Time', value: '10 minutes' },
  { label: 'Begins with', value: 'Wherever you are' },
  { label: 'Builds', value: 'Attention' }],

  defaultMinutes: 10,
  ritual: 'Look around.',
  hasSetup: false,
  prompts: [
  'Write down five sounds you can hear right now, then follow the strangest one.',
  'Describe the light in the room as if it were a person.',
  'Someone nearby is in the middle of a story. Imagine the middle.',
  'What has moved since you sat down?',
  'Write about the nearest window and what it frames.'],

  theme: { panel: 'bg-charcoal text-paper', muted: 'text-paper/65', accent: 'text-glow', rule: 'border-paper/15', hex: '#D39A55' }
}];