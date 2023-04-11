# availability-segment-tree
Uses a dynamic segment tree to store availability in time intervals. 

## Usage

- `npm i`
- `npm run start`: Simple example with verbose output
- `npm run heavy`: Heavy usage tests
- `npm run bench`: Benchmarks ops/sec

### ReservationSegmentTree

#### constructor(start: number, end: number, availability: number)
Creates a tree instance with a single node that represents the entire time interval (1-30).
```ts
const start = 1;
const end = 30;
const availability = 10;

const tree = new ReservationSegmentTree(start, end, availability);
```

#### reserve(start: number, end: number, count: number): boolean
Attempts to reserve `count` in `start` and `end` range.
```ts
const tree = new ReservationSegmentTree(1, 30, 10);

tree.reserve(1, 2, 5); // true
tree.reserve(3, 10, 10); // true
tree.reserve(4, 5, 2); // false, lacks availability
```

#### getAvailability(start: number, end: number): number
Determines total availability in `start` and `end` range.
```ts
const tree = new ReservationSegmentTree(1, 30, 10);

tree.getAvailability(1, 2); // 10

tree.reserve(1, 2, 2);

tree.getAvailability(1, 2); // 8
tree.getAvailability(1, 10); // 8
tree.getAvailability(4, 10); // 10
```