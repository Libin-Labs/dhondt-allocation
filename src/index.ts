function finite(value: number, min = -Number.MAX_VALUE, max = Number.MAX_VALUE): number {
  if (typeof value !== 'number' || !Number.isFinite(value))
    throw new TypeError('Expected finite number');
  if (value < min || value > max) throw new RangeError('Number outside supported bounds');
  return value;
}
function integer(value: number, min = 0, max = 1000000): number {
  if (!Number.isSafeInteger(value)) throw new RangeError('Expected safe integer');
  return finite(value, min, max);
}
function big(value: bigint): bigint {
  if (typeof value !== 'bigint') throw new TypeError('Expected bigint');
  const limit = (1n << 4096n) - 1n;
  if (value > limit || value < -limit) throw new RangeError('4096-bit budget exceeded');
  return value;
}
function strictText(value: string, max = 16384): void {
  if (typeof value !== 'string') throw new TypeError('Expected string');
  if (value.length > max) throw new RangeError('Text length budget exceeded');
}
export interface PartyVotes {
  party: string;
  votes: bigint;
}
export interface SeatAllocation {
  party: string;
  seats: number;
}
function check(parties: readonly PartyVotes[], seats: number): void {
  integer(seats, 1, 10000);
  if (!Array.isArray(parties) || !parties.length || parties.length > 1000)
    throw new RangeError('Party count');
  const ids = new Set<string>();
  let total = 0n;
  for (const p of parties) {
    if (!p) throw new TypeError('Expected party');
    strictText(p.party, 100);
    if (!p.party || ids.has(p.party)) throw new RangeError('Unique party IDs');
    ids.add(p.party);
    big(p.votes);
    if (p.votes < 0n) throw new RangeError('Negative votes');
    total = big(total + p.votes);
  }
  if (total === 0n) throw new RangeError('Positive total votes required');
}
function ordinal(a: string, b: string): boolean {
  return a < b;
}
export function dhondt(parties: readonly PartyVotes[], seats: number): SeatAllocation[] {
  check(parties, seats);
  const counts: number[] = Array(parties.length).fill(0);
  for (let s = 0; s < seats; s++) {
    let best = 0;
    for (let i = 1; i < parties.length; i++) {
      const a = parties[i]!,
        b = parties[best]!,
        da = BigInt(counts[i]! + 1),
        db = BigInt(counts[best]! + 1),
        left = a.votes * db,
        right = b.votes * da;
      if (left > right || (left === right && ordinal(a.party, b.party))) best = i;
    }
    counts[best] = counts[best]! + 1;
  }
  return parties.map((p, i) => ({ party: p.party, seats: counts[i]! }));
}
