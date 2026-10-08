import type { Achievement } from '../types/content';

export const achievements: Achievement[] = [
{ id: 'first', title: 'The first page', description: 'You wrote something down.', metric: 'pieces', threshold: 1 },
{ id: 'week', title: 'Seven evenings', description: 'Seven days in a row, unbroken.', metric: 'longestStreak', threshold: 7 },
{ id: 'shelf', title: 'A small shelf', description: 'Ten pieces kept.', metric: 'pieces', threshold: 10 },
{ id: 'sittings', title: 'Twenty-five sittings', description: 'You keep coming back.', metric: 'sessions', threshold: 25 },
{ id: 'tenk', title: 'Ten thousand words', description: 'Roughly a long short story.', metric: 'words', threshold: 10000 },
{ id: 'month', title: 'A month of returning', description: 'Thirty days in a row.', metric: 'longestStreak', threshold: 30 }];