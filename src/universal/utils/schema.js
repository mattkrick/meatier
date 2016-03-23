export function parsedJoiErrors(error) {
  if (!error) {
    return {};
  }
  const errors = {};
  const allErrors = error.details;
  for (let i = 0; i < allErrors.length; i++) {
    const curError = allErrors[i];
    if (errors[curError.path]) {
      continue;
    }
    errors[curError.path] = curError.message;
  }
  return errors;
}
