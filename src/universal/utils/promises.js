export async function resolvePromiseMap(promiseMap) {
  let importMap = new Map();
  for (var [key, promise] of promiseMap) {
    let value = await promise;
    importMap.set(key, value)
  }
  return importMap;
}
