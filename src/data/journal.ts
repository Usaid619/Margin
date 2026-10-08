import type { JournalArticle } from '../types/content';
import { daysAgo } from '../utils/date';
import { imagery } from './imagery';

export const journalArticles: JournalArticle[] = [
{
  slug: 'the-art-of-noticing',
  title: 'The Art of Noticing',
  dek: 'Why the best writers are, first of all, the best observers — and how to train the habit.',
  category: 'Observation',
  author: 'Ines Calder',
  date: daysAgo(3),
  readMinutes: 7,
  image: imagery.journalFeature.src,
  imageAlt: imagery.journalFeature.alt,
  pullQuote: 'Writers are not people with more interesting lives. They catch a little more of the life they already have.',
  body: [
  'Most advice about writing is really advice about looking. Before there is a sentence there is a moment of attention: the way a stranger holds a coffee cup with both hands in July, the particular silence of a kitchen at six in the morning, a sign in a shop window that has been misspelled for eleven years.',
  'These moments are everywhere, and almost all of them pass unrecorded. Not because they are unimportant, but because we are busy. Attention is the first thing we spend and the last thing we notice spending.',
  'Writers are not people with more interesting lives. They are people who have learned to catch a little more of the life they already have. The habit can be trained, and it starts embarrassingly small: one observation a day, written down before it fades.',
  "Try it tomorrow. Choose a single ordinary hour and note three things nobody else in the room seems to see. Don't decorate them. Just get them down accurately. Accuracy, it turns out, is where most beauty hides.",
  'Do this for a month and something shifts. You begin to walk through the world slightly differently — as though everything might be material. Because it is.']

},
{
  slug: 'four-uninterrupted-minutes',
  title: 'Four Uninterrupted Minutes',
  dek: 'On distraction, and the small amount of quiet a sentence needs to become itself.',
  category: 'Attention',
  author: 'Tomás Reyne',
  date: daysAgo(10),
  readMinutes: 5,
  body: [
  'There is a moment, about four minutes into writing, when the sentence stops being something you are making and becomes something you are following. Most of us never reach it. We are interrupted at minute two — by a notification, by a tab, by the faint itch to check whether anything has happened.',
  'Distraction is rarely dramatic. It is a thousand small exits from the room, each one reasonable. But every exit costs the same thing: the thread. And the thread is the whole point.',
  'So protect four minutes. Then ten. Close the door, literally if you can. The page is patient, but it will not compete.']

},
{
  slug: 'memory-is-a-writer-too',
  title: 'Memory Is a Writer, Too',
  dek: 'Every time you remember something, you rewrite it. Use that.',
  category: 'Memory',
  author: 'Ines Calder',
  date: daysAgo(17),
  readMinutes: 6,
  image: imagery.journalLibrary.src,
  imageAlt: imagery.journalLibrary.alt,
  body: [
  'Remembering is not retrieval. Each time we recall something, we rebuild it — and in rebuilding, we revise. Memory is less an archive than a draft.',
  'For a writer, this is a gift. It means the past is never finished. The kitchen you grew up in, the argument on the stairs, the summer that seemed endless: all of them are still open to interpretation.',
  "When you write a memory, don't aim for the truth of what happened. Aim for the truth of how it lives in you now. The details you can't quite remember are often the ones that matter most — write toward them."]

},
{
  slug: 'a-habit-without-the-guilt',
  title: 'A Habit Without the Guilt',
  dek: 'The writers who last are not the ones who never miss. They are the ones who come back.',
  category: 'Habits',
  author: 'June Hartley',
  date: daysAgo(24),
  readMinutes: 4,
  body: [
  'Streaks are useful until they become a judgement. The moment a missed day feels like a failure, the habit has started working against you.',
  "The writers who last are not the ones who never miss. They're the ones who come back. A habit isn't a chain you must not break; it's a path you keep returning to, even after weeks away.",
  'Write small. Ten minutes counts. A paragraph counts. One true sentence on a Tuesday night counts. Over a year, the small days are what the work is made of.']

},
{
  slug: 'reading-like-a-writer',
  title: 'Reading Like a Writer',
  dek: 'How to stop being carried along and start asking: how did they do that?',
  category: 'Reading',
  author: 'Tomás Reyne',
  date: daysAgo(31),
  readMinutes: 5,
  body: [
  'Reading for pleasure and reading as a writer are different acts. The first carries you along; the second makes you stop and ask: how did they do that?',
  "Copy out a paragraph you love, by hand. Notice where the sentences are short. Notice what is left out. Notice the verb that's doing all the work. You'll learn more from one paragraph read slowly than a novel read fast.",
  'Then close the book and try it yourself. Not as imitation — as apprenticeship.']

},
{
  slug: 'stories-begin-in-the-middle',
  title: 'Stories Begin in the Middle',
  dek: "Most first drafts start too early. Readers don't need the walk to the door.",
  category: 'Storytelling',
  author: 'June Hartley',
  date: daysAgo(38),
  readMinutes: 4,
  body: [
  "Most first drafts begin too early. We clear our throats: the weather, the backstory, the long walk to the door. Readers don't need the walk. They need the door, already opening.",
  "Try starting where something has already gone slightly wrong. Someone has left the keys on the table. The phone has already rung. Let the reader catch up — they're better at it than we think.",
  "The beginning you wrote is rarely wasted. It was how you found your way in. You just don't have to make everyone else walk it too."]

}];