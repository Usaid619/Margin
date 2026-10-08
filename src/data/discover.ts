import type { CommunityPiece, FeaturedObject, WordOfTheDay, WritingExercise } from '../types/content';
import { imagery } from './imagery';

export const objectOfTheDay: FeaturedObject = {
  name: 'A matchbox',
  note: 'Three matches left. Each one a small, decisive act.',
  image: imagery.matchbox.src,
  imageAlt: imagery.matchbox.alt
};

export const wordOfTheDay: WordOfTheDay = {
  word: 'Petrichor',
  pronunciation: 'pet · ri · kor',
  partOfSpeech: 'noun',
  definition: 'The particular smell of rain on dry earth.',
  history:
  'Coined in 1964 by two Australian scientists, Isabel Joy Bear and Richard Thomas, from the Greek petra, stone, and ichor — the fluid said to run in the veins of the gods. Science, it turns out, needed a little mythology to name something everyone already knew.'
};

export const writingExercise: WritingExercise = {
  title: 'The Hundred-Word Room',
  instruction: 'Describe the room you are sitting in using exactly one hundred words. No more, no fewer.',
  constraint: 'You may not use the words “wall”, “floor” or “light”.',
  minutes: 10
};

export const communityPieces: CommunityPiece[] = [
{
  id: 'c1',
  author: 'Mira O.',
  location: 'Porto',
  title: 'Laundromat, Sunday',
  mode: 'observation',
  excerpt:
  'Six machines turning at six different speeds, like a choir that never rehearsed. A man folds his shirts with the tenderness of someone who was taught by his mother, and still hears her.'
},
{
  id: 'c2',
  author: 'Daniel K.',
  location: 'Leeds',
  title: 'What the Key Opens',
  mode: 'object',
  excerpt:
  'It opens a flat that no longer exists. They knocked the building down in 2014, but the key never got the message. It still sits in the bowl, ready, loyal, absurd.'
},
{
  id: 'c3',
  author: 'Aya N.',
  location: 'Kyoto',
  title: 'Ten Minutes of Snow',
  mode: 'focused',
  excerpt:
  'The city goes quiet the way a room goes quiet when someone important walks in. Nobody says anything. Everyone looks up.'
}];