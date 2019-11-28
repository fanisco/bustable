/**
 * Rounds float number.
 * @param {Number} val
 * @param {Number} size
 */
export default function precise(val, size) {
    return Math.round(val * size) / size;
}
