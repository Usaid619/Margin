import type { ChoiceOption } from '../types/content';
import type { TimeOfDay, WritingReason } from '../types/user';

export const reasonOptions: ChoiceOption<WritingReason>[] = [
{ id: 'more', label: 'I want to write more.', note: 'More pages, more often.' },
{ id: 'better', label: 'I want to become a better writer.', note: 'Sharper sentences, braver ideas.' },
{ id: 'think', label: 'I want somewhere to think.', note: 'A place to put what keeps circling.' },
{ id: 'habit', label: 'I want to develop a habit.', note: 'A small ritual, kept.' },
{ id: 'explore', label: 'I simply want to explore.', note: 'No plan. Just curiosity.' }];


export const timeOptions: ChoiceOption<TimeOfDay>[] = [
{ id: 'morning', label: 'Morning', note: 'Before the day has opinions.' },
{ id: 'afternoon', label: 'Afternoon', note: 'In the lull after lunch.' },
{ id: 'evening', label: 'Evening', note: 'When the light gets low.' },
{ id: 'late-night', label: 'Late night', note: 'When everyone else is asleep.' }];


export const reasonLines: Record<WritingReason, string> = {
  more: 'A little every day adds up to a lot.',
  better: "Try one sentence today you'd be proud to read aloud.",
  think: "Bring whatever's been circling. Put it down here.",
  habit: 'Even ten minutes keeps the thread unbroken.',
  explore: 'Wander. Nothing here needs to be finished.'
};

export const timeLines: Record<TimeOfDay, string> = {
  morning: 'You said mornings — the page is ready when you are.',
  afternoon: 'You said afternoons — take the lull and use it.',
  evening: 'You said evenings — the lamp is on.',
  'late-night': 'You said late nights — the house is quiet now.'
};