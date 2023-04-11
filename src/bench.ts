import ReservationSegmentTree from "./ReservationSegmentTree";
import random from "lodash.random";
import { Suite } from 'benchmark';

// Define root bounds for segment tree
const availabilityRange = {
  start: 1,
  end: 365
};

const availabilityStock = Number.MAX_SAFE_INTEGER;

const tree = new ReservationSegmentTree(availabilityRange.start, availabilityRange.end, availabilityStock, false);

const getPair = (): [number, number] => {
  const start = random(1, availabilityRange.end);
  return [start, start + random(0, 10)];
}

const benchmark = new Suite;

benchmark.add('Create random reservation', () => {
  const [start, end] = getPair();
  tree.reserve(start, end, 1);
}).add('Calculate availability', () => {
  const [start, end] = getPair();
  tree.getAvailability(start, end);
}).on('cycle', (event: any) => {
  console.log(event.target.toString());
}).run();
