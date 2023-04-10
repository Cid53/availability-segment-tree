// Heavy usage testing
import ReservationSegmentTree from "./segment";
import random from "lodash.random";

// Define root bounds for segment tree
const availabilityRange = {
  start: 1,
  end: 365
};

const availabilityStock = 200;

// Usage testing amounts
const reservationsToCreate = 10_000;
const availabilityQueries = 10_000;

const tree = new ReservationSegmentTree(availabilityRange.start, availabilityRange.end, availabilityStock, false);

const getPair = (): [number, number] => {
  const start = random(1, availabilityRange.end);
  return [start, start + random(0, 5)];
}

let success = 0;
let failed = 0;
do {
  const [start, end] = getPair();
  if (tree.reserve(start, end, 1)) {
    success++;
  } else {
    failed++;
  }
} while (success < reservationsToCreate);

console.log(`Created ${success} reservations (${failed} failed attempts)`)

let isAvail = 0;
let isNotAvail = 0;
for (let i = 0; i < availabilityQueries; i++ ) {
  const [start, end] = getPair();
  if (tree.getAvailability(start, end)) {
    isAvail++;
  } else {
    isNotAvail++
  }
}

console.log(`Checked availability ${availabilityQueries} times: Available: ${isAvail} ranges, Unavailable: ${isNotAvail} ranges`)
