import assert from 'node:assert/strict';
import test from 'node:test';
import { lessonSchema } from '../src/lib/lesson-schema.mjs';

test('supplementary is an optional boolean for every existing lesson type', () => {
  for (const type of ['knowledge', 'exercise', 'game', 'interactive']) {
    const base = { title: '教材', type };
    assert.equal(lessonSchema.parse(base).supplementary, false);
    const extra = lessonSchema.parse({ ...base, supplementary: true });
    assert.equal(extra.type, type);
    assert.equal(extra.supplementary, true);
    assert.equal(extra.hidden, false);
    assert.equal(extra.draft, false);
    assert.equal(lessonSchema.parse({ ...base, supplementary: false }).supplementary, false);
    assert.equal(lessonSchema.safeParse({ ...base, supplementary: 'true' }).success, false);
  }
  assert.equal(lessonSchema.safeParse({ title: '教材', type: 'supplementary' }).success, false);
});
