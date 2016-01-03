export function parsedJoiErrors(error) {
  if (!error) return null;
  const errors = {};
  const allErrors = error.details;
  for (let i = 0; i < allErrors.length; i++) {
    let curError = allErrors[i];
    if (errors[curError.path]) continue;
    errors[curError.path] = curError.message;
  }
  return errors;
}
