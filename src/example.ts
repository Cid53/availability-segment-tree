import ReservationSegmentTree from "./ReservationSegmentTree";

const tree = new ReservationSegmentTree(1, 30, 10);

// Tree modification examples
/**
 * Contained
 *
 * "*" = part of reservation
 *
 * Before:
 *     [1-30]
 *
 * After:
 *     [1-30]
 *     /     \
 *   [1-4]*  [5-30]
  */
tree.reserve(1,4, 1);

/**
 * Overlapping
 *
 * Before:
 *     [1-30]
 *     /     \
 *   [1-4]  [5-30]
 *
 * After:
 *           [1-30]
 *          /      \
 *        /         \
 *    [1-4]         [5-30]
 *   /    \        /      \
 * [1-1] [2-4]*  [5-7]*  [8-30]
 */
tree.reserve(2,7, 1);

/**
 * Engulfing
 *
 * Before:
 *          [1-30]
 *          /      \
 *        /         \
 *    [1-4]         [5-30]
 *   /    \        /      \
 * [1-1] [2-4]  [5-7]  [8-30]
 *
 * After:
 *              [1-30]
 *            /       \
 *          /           \
 *        /               \
 *    [1-4]               [5-30]
 *   /    \              /      \
 * [1-1] [2-4]         [5-7]*   [8-30]
 *       /   \                 /     \
 *    [2-2] [3-4]*        [8-10]*    [11-30]
 */
tree.reserve(3,10, 1);
tree.reserve(2,11, 20);

tree.getAvailability(1, 6);
tree.getAvailability(5, 15);