import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../dist/esm/index.js';
test('known three parties', () => {
  assert.deepEqual(
    api
      .dhondt(
        [
          { party: 'a', votes: 100n },
          { party: 'b', votes: 60n },
          { party: 'c', votes: 20n },
        ],
        5,
      )
      .map((x) => x.seats),
    [3, 2, 0],
  );
});
test('ordinal ties', () => {
  assert.deepEqual(
    api
      .dhondt(
        [
          { party: 'z', votes: 1n },
          { party: 'a', votes: 1n },
        ],
        1,
      )
      .map((x) => x.seats),
    [0, 1],
  );
});
test('zero votes', () => {
  assert.deepEqual(
    api
      .dhondt(
        [
          { party: 'a', votes: 0n },
          { party: 'b', votes: 10n },
        ],
        10,
      )
      .map((x) => x.seats),
    [0, 10],
  );
});
test('invalid parties', () => {
  assert.throws(() => api.dhondt([{ party: 'a', votes: -1n }], 1));
  assert.throws(() => api.dhondt([{ party: 'a', votes: 0n }], 1));
  assert.throws(() =>
    api.dhondt(
      [
        { party: 'a', votes: 1n },
        { party: 'a', votes: 1n },
      ],
      1,
    ),
  );
});
test('budget and types', () => {
  assert.throws(() => api.dhondt([{ party: 'a', votes: 1n }], 0));
  assert.throws(() => api.dhondt([{ party: 'a', votes: 1 }], 1));
});
test('independent small rational quotient oracle', () => {
  for (let seats = 1; seats <= 20; seats++) {
    const ps = [
        { party: 'a', votes: 23n },
        { party: 'b', votes: 11n },
        { party: 'c', votes: 7n },
      ],
      all = [];
    for (const p of ps)
      for (let i = 0; i < seats; i++) all.push({ party: p.party, v: Number(p.votes) / (i + 1) });
    all.sort((a, b) => b.v - a.v || a.party.localeCompare(b.party));
    const expected = ps.map((p) => all.slice(0, seats).filter((x) => x.party === p.party).length);
    assert.deepEqual(
      api.dhondt(ps, seats).map((x) => x.seats),
      expected,
    );
  }
});
