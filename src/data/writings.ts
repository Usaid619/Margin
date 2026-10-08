import type { Writing } from '../types/writing';
import { daysAgo } from '../utils/date';

export const seedWritings: Writing[] = [
{
  id: 'w01',
  title: 'The Things We Leave Behind',
  mode: 'focused',
  prompt: "Write about something you've kept for no reason.",
  durationMinutes: 15,
  createdAt: daysAgo(0, 20),
  updatedAt: daysAgo(0, 20, 40),
  favorite: false,
  status: 'finished',
  body: `There is a coat in the hallway that nobody wears. It belonged to my father for exactly one winter — the winter he decided he was the kind of man who wore a long coat, and then decided he wasn't.

We keep it the way you keep a sentence you can't finish. It hangs there, patient, holding the shape of a version of him that only lasted until March.

Sometimes I put my hands in the pockets. There is a bus ticket, a single cough sweet still in its wrapper, and a receipt for two coffees. I have never asked who the second coffee was for. I think I prefer the question.

The things we leave behind are not really things. They are doors left slightly open, so that whoever comes after us can feel the draught and wonder.`
},
{
  id: 'w02',
  title: 'What the Matchbox Remembers',
  mode: 'object',
  object: 'A matchbox',
  prompt: "Don't describe what it is. Describe what it remembers.",
  durationMinutes: 12,
  createdAt: daysAgo(1, 22),
  updatedAt: daysAgo(1, 22, 30),
  favorite: true,
  status: 'finished',
  body: `It remembers being full. Forty small heads pressed together like a choir waiting for the conductor.

It remembers the first strike in a power cut, the kitchen suddenly enormous, a voice saying *hold it steady*. It remembers birthday candles, one too many, and somebody laughing because the cake looked briefly on fire.

It remembers a cigarette that was meant to be the last one, and the one after that.

Now it remembers mostly the drawer. The dark, the elastic bands, the spare keys to houses we no longer live in. Three matches left, rattling when the drawer closes, like something trying to get a word in.`
},
{
  id: 'w03',
  title: 'Kitchen, 6:40 a.m.',
  mode: 'observation',
  prompt: 'Describe the light in the room as if it were a person.',
  durationMinutes: 10,
  createdAt: daysAgo(2, 7),
  updatedAt: daysAgo(2, 7, 20),
  favorite: false,
  status: 'finished',
  body: `The light comes in sideways and sits at the table like it has been up all night. It is not in a hurry. It finds the sugar bowl first, then the crumbs, then the rim of the cup, and stays there, as though the cup were the only thing worth looking at.

The fridge hums one long note. Upstairs, a floorboard decides something. The radiator ticks like a slow clock that has lost interest in time.

I am trying not to move, because the moment I stand up this becomes a morning, and right now it is still something else.`
},
{
  id: 'w04',
  title: "My Grandmother's Hands",
  mode: 'reflection',
  prompt: "Write about someone's hands, and what they know how to do.",
  durationMinutes: 15,
  createdAt: daysAgo(4, 21),
  updatedAt: daysAgo(4, 21, 30),
  favorite: true,
  status: 'finished',
  body: `She could tell if bread was ready by knocking on it, the way you'd knock on a door you already knew was open.

Her hands were always doing two things. Peeling and talking. Knitting and watching the news. Holding my wrist to cross the road and pointing at a bird with the other.

When she was in hospital, they lay on the blanket and didn't know what to do. I kept wanting to give them something — a potato, a pen, the remote control. Something to be useful with.

I have her hands now, people tell me. I don't think so. Mine still look like they're waiting for instructions.`
},
{
  id: 'w05',
  title: 'On Not Finishing Things',
  mode: 'free',
  createdAt: daysAgo(5, 23),
  updatedAt: daysAgo(3, 22),
  favorite: false,
  status: 'draft',
  body: `I have eleven notebooks with the first nine pages filled. It's a pattern, apparently. Nine pages is where the excitement runs out and the work begins, and I have always preferred the excitement.

But maybe unfinished isn't the same as failed. Maybe a notebook with nine pages is a record of nine good days.

Or maybe that's exactly what someone who doesn't finish things would say.`
},
{
  id: 'w06',
  title: "The Room I Haven't Entered",
  mode: 'focused',
  prompt: "Describe a room you haven't entered in ten years.",
  durationMinutes: 25,
  createdAt: daysAgo(7, 21),
  updatedAt: daysAgo(7, 21, 40),
  favorite: false,
  status: 'finished',
  body: `The wallpaper was green, the kind of green that only existed between 1974 and 1981. There was a bed nobody slept in and a wardrobe that smelled of mothballs and something sweeter underneath, like the ghost of a perfume bottle.

We were not supposed to go in. Which meant, of course, that we went in constantly, quietly, in socks.

There was a photograph on the dresser of a woman I never met. She was laughing at someone outside the frame. For years I thought she was laughing at me, at whatever I was about to do. Now I think she was laughing at the person holding the camera, and that they loved each other, and that the room was kept that way for her.

Ten years. I wonder if the green has faded. I hope it hasn't.`
},
{
  id: 'w07',
  title: 'A Spare Key',
  mode: 'object',
  object: 'A spare key',
  prompt: 'Describe the door it was made for.',
  durationMinutes: 12,
  createdAt: daysAgo(9, 22),
  updatedAt: daysAgo(6, 21),
  favorite: false,
  status: 'draft',
  body: `It is cut for a door that sticks in summer. You have to lift the handle slightly and lean, like you're sharing a secret with the wood.

Blue paint on the frame, chipped where the dog used to wait. A letterbox that snaps shut like a small, indignant mouth.`
},
{
  id: 'w08',
  title: 'Rain on the 14 Bus',
  mode: 'observation',
  prompt: 'Someone nearby is in the middle of a story. Imagine the middle.',
  durationMinutes: 10,
  createdAt: daysAgo(11, 18),
  updatedAt: daysAgo(11, 18, 20),
  favorite: false,
  status: 'finished',
  body: `The windows have gone silver with breath. A boy draws a face in the fog and then, carefully, gives it eyebrows.

Two women behind me are in the middle of something serious. "And then he just left the keys on the table," one says, and the other says, "No," in the way that means *yes, go on*.

I miss my stop on purpose. I want to know about the keys.`
},
{
  id: 'w09',
  title: 'Notes Toward a Braver Year',
  mode: 'reflection',
  prompt: 'What did this week teach you that you didn’t ask to learn?',
  durationMinutes: 15,
  createdAt: daysAgo(14, 9),
  updatedAt: daysAgo(14, 9, 30),
  favorite: true,
  status: 'finished',
  body: `Say the thing in the room, not in the car afterward.

Write before reading the news.

Assume people are tired, not cruel.

Walk the long way when the long way is beautiful.

Keep a list of sentences overheard on trains. Treat it as a kind of wealth.

Finish one notebook. Just one. See what page ten feels like.`
},
{
  id: 'w10',
  title: 'Three Tables Away',
  mode: 'free',
  createdAt: daysAgo(18, 15),
  updatedAt: daysAgo(18, 15, 20),
  favorite: false,
  status: 'finished',
  body: `Someone laughing three tables away, the kind of laugh that forgets where it is. Everybody looks up and then pretends not to. I don't pretend. I want to be the person who made her laugh like that, or failing that, the person who writes it down.

The barista calls a name that isn't mine three times. Outside, the rain is thinking about it.`
}];