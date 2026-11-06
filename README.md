# @lp-labs/dhondt-allocation

D'Hondt exact highest-average seat apportionment.

Original, standalone MIT TypeScript implementation with **zero runtime or peer dependencies**. ESM/CommonJS exports and separate declarations; Node18+ and compatible ES2022 browsers. No service, filesystem, network, clock or browser globals accessed on import. Compiler/formatter dependencies are development-only.

## Install

```sh
npm install @lp-labs/dhondt-allocation
```

## Working example

```js
import { dhondt } from '@lp-labs/dhondt-allocation';
if (
  dhondt(
    [
      { party: 'a', votes: 10n },
      { party: 'b', votes: 0n },
    ],
    3,
  )[0].seats !== 3
)
  throw new Error('Seats');
```

CommonJS: `const api = require('@lp-labs/dhondt-allocation')`.

## Behavior, customization and limits

Input {party,votes:bigint},1..1000 unique nonempty party IDs<=100chars; nonnegative votes and positive total, each and total<=4096bits. Seats1..10000, outputs in caller party order. Exact quotient/remainder comparisons use bigint, ordinal ID resolves mathematical ties. No thresholds, districts, legal rules, coalition logic or electoral certification. Allocate seats by votes/(allocated+1). Zero-vote parties never win a seat while positive votes exist. O(parties*seats) time,O(parties)space.

Use the explicit function arguments and public types below to customize the documented behavior. There are no hidden environment settings or sibling-library requirements. Array inputs must be dense; sparse entries are invalid. Inputs are validated before a successful result is returned. Outputs do not mutate caller-owned inputs. Hostile proxies/getters and concurrent mutation are outside the contract.

## Errors and integration

Invalid data never produces an empty success-shaped substitute. TypeError reports incompatible runtime types/nonfinite numbers; RangeError reports unsupported ranges, invalid syntax, inconsistent states and exceeded budgets. Functions that explicitly return null, false or empty arrays describe those legitimate outcomes above. Errors propagate to callers; UI applications should catch at their boundary and visibly notify users. Numerical calculations use JavaScript IEEE754 unless the API explicitly uses bigint; compare approximate numerical results with application-appropriate tolerances.

## Complete public API

```ts
export interface PartyVotes {
  party: string;
  votes: bigint;
}
export interface SeatAllocation {
  party: string;
  seats: number;
}
export declare function dhondt(parties: readonly PartyVotes[], seats: number): SeatAllocation[];
```

## Performance and portability

Complexity and resource ceilings are specified above. Buffered synchronous algorithms do not create workers or timers; callers can move expensive work to their own worker. Limits are enforced, not silently truncated. No runtime imports from any other library. No compatibility or completeness claims beyond the stated scope.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
