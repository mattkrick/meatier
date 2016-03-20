export async function resolvePromiseMap(promiseMap) {
  const keys = Array.from(promiseMap.keys());
  const promises = Array.from(promiseMap.values());
  const values = await Promise.all(promises);
  return new Map(values.map((value, i) => [keys[i], value]));
}
