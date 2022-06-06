export function isValidNumber(n: any): boolean {
  if (n === undefined || n === null || (!n && n !== 0)) {
    return false;
  }

  if (n !== Number(n)) {
    return false;
  }

  if (n === Infinity) {
    return false;
  }

  return typeof n === 'number' && !isNaN(n);
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function getRandomArbitrary(min, max): number {
  return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min, max): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function calculatePaginationPage(skip: number, limit: number): number {
  const res = Math.ceil((skip - 1) / limit) + 1;
  return res < 1 ? 1 : res;
}
