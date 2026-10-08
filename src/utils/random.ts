export function pick<T>(items: T[], avoid?: T): T {
  if (items.length <= 1) return items[0];
  let next = items[Math.floor(Math.random() * items.length)];
  while (next === avoid) next = items[Math.floor(Math.random() * items.length)];
  return next;
}

export function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}