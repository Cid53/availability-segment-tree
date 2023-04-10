export class SegmentNode {
  start: number;
  end: number;
  available: number;
  left?: SegmentNode;
  right?: SegmentNode;

  constructor(start: number, end: number, available: number) {
    this.start = start;
    this.end = end;
    this.available = available;

    return this;
  }

  // Node: [1-4] , Split: [2-4] => [1-1]:[2-4]
  public split(start: number, end: number) {
    // console.log(`Splitting: [${start}:${end}] out of [${this.start}:${this.end}]`);
    const abutsEnd = end === this.end;
    this.left = new SegmentNode(this.start, abutsEnd ? start - 1 : end, this.available);
    this.right = new SegmentNode(abutsEnd ? start : end + 1, this.end, this.available);

    return this;
  }

  public reduceAvailability(count: number): boolean {
    if (this.available < count) return false;
    this.available -= count;

    if (this.left && this.right) {
      // all descendants need to have availability reduced too
      // console.log(`Reduce down from: [${this.start}:${this.end}]`);
      this.left.reduceAvailability(count);
      this.right.reduceAvailability(count);
    }

    return true;
  }

  public setAvailability(count: number) {
    this.available = count;
  }

  public reserve(start: number, end: number, count: number, tree: ReservationSegmentTree): boolean {
    // range = [start, end]
    // const abutsStart = start === this.start && end !== this.end; // node starts at range start
    const abutsEnd = end === this.end && start !== this.start; // node ends at range end
    const containsStart = start >= this.start && start <= this.end;
    const containsEnd = end >= this.start && end <= this.end;
    const engulfed = this.start >= start && this.end <= end; // entire node is contained in range
    const contains = containsStart && containsEnd; // node contains entire rage
    const overlaps = containsStart !== containsEnd; // node is part of the range, but not entirely

    if (engulfed) {
      // node is inside range, it is part of the reservation
      tree.reservationSegments.push(this);

      // the node either contains (an exact match) or is the end of the reservation
      return contains || abutsEnd;
    }

    if (contains) {
      // node contains entire range
      if (!this.left || !this.right) {
        // does not have children, split
        this.split(start, end);
      }
      tree.visited.push(this);

      // has children, try to reserve in each
      return (this.left!.reserve(start, end, count, tree) || this.right!.reserve(start, end, count, tree));
    }

    if (overlaps) {
      if (!this.left || !this.right) {
        // node only has one piece of the query range and no children, we need to split it
        if (containsStart) this.split(start, this.end);
        if (containsEnd) this.split(this.start, end);
      }

      tree.visited.push(this);
      return (this.left!.reserve(start, end, count, tree) || this.right!.reserve(start, end, count, tree));
    }

    return false;
  }

  public getAvailability(start: number, end: number): number {
    const containsStart = start >= this.start && start <= this.end;
    const containsEnd = end >= this.start && end <= this.end;
    const contained = containsStart && containsEnd;
    const overlaps = containsStart !== containsEnd;

    if (contained) {
      // query range is fully contained in the node
      if (!this.left || !this.right) {
        // node has no children, node's availability is query's availability
        return this.available;
      }

      // node has children, find the min availability between left and right nodes
      return Math.min(this.left.getAvailability(start, end), this.right.getAvailability(start, end));
    }

    if (overlaps) {
      // the start or end of the query is in this node, but not both, return node's availability to compare in min()
      return this.available;
    }

    // node is not relevant to query, ignore results
    return Infinity;
  }
}

export default class ReservationSegmentTree {
  root: SegmentNode;

  visited: SegmentNode[] = [];

  reservationSegments: SegmentNode[] = [];

  debug: boolean;

  constructor(start: number, end: number, available: number, debug = true) {
    this.root = new SegmentNode(start, end, available);
    this.debug = debug;
  }

  public reserve(start: number, end: number, count: number) {
    if (this.debug) console.log(`Attempting to create reservation: [${start}:${end}]`);
    if (start < this.root.start || end > this.root.end) {
      // not in range, cant reserve
      return false;
    }

    if(this.root.reserve(start, end, count, this)) {
      if (this.debug) console.log(`└ Segments =>`, this.reservationSegments.map(node => `[${node.start}:${node.end}]`).toString());

      // make sure each segment of the reservation has availability
      const allSegmentsHaveAvailability = this.reservationSegments.every(node => node.reduceAvailability(count));

      // each node that contained or overlapped a reservation needs its availability reduced
      this.visited.forEach(node => node.setAvailability(Math.max(node.available - count, 0)));

      this.reservationSegments = [];
      this.visited = [];

      return allSegmentsHaveAvailability;
    }

    return false;
  }

  public getAvailability(start: number, end: number): number {
    if (start < this.root.start || end > this.root.end) {
      // not in range, no availability
      return 0;
    }

    const availability = this.root.getAvailability(start, end);

    if (this.debug) console.log(`Availability for [${start}:${end}] => ${availability}`);
    return availability;
  }
}