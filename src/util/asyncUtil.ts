/**
 * Calls `callback(item, index)` on each item in `list`. Returns a Promise
 * wrapping all of the values returned by the callback calls.
 */
export function parallelize<T, U>(
    list: T[],
    callback: (value: T, index: number) => U | PromiseLike<U>,
): Promise<U[]> {
  let work = [] as (U | PromiseLike<U>)[];

  for (let i = 0; i < list.length; i++) {
    work.push(callback(list[i], i));
  }
  return Promise.all(work);
}

/**
 * Calls `callback(item, index)` on each item in `list`. If `callback`
 * returns a `Promise`, waits until the promise resolves before calling
 * `callback` on the next item in the list.
 */
export async function serialize<T, U>(
    list: T[],
    callback: (value: T, index: number) => U | PromiseLike<U>,
): Promise<U[]> {
  let results = [] as U[];

  for (let i = 0; i < list.length; i++) {
    results.push(await callback(list[i], i));
  }
  return results;
}

export function delay(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
