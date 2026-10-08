import type { SessionConfig, WritingMode, WritingObject } from '../types/writing';
import { writingObjects } from '../data/objects';
import { pick } from './random';

interface SessionOverrides {
  minutes?: number | null;
  prompt?: string | null;
  objectName?: string | null;
}

export function buildSessionConfig(mode: WritingMode, existingCount: number, overrides: SessionOverrides = {}): SessionConfig {
  let object: WritingObject | null = null;
  if (mode.id === 'object') {
    const name = overrides.objectName?.trim();
    const named = name ?
    writingObjects.find((o) => o.name.toLowerCase() === name.toLowerCase()) ?? {
      name,
      prompt: "Don't describe what it is. Describe what it remembers."
    } :
    null;
    object = named ?? pick(writingObjects);
  }

  const prompt = overrides.prompt ?? object?.prompt ?? (mode.prompts.length ? pick(mode.prompts) : null);

  return {
    mode: mode.id,
    minutes: overrides.minutes !== undefined ? overrides.minutes : mode.defaultMinutes,
    prompt,
    object,
    number: existingCount + 1
  };
}