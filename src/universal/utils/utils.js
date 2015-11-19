export function delay(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}
