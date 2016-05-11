import {writeFileSync} from 'fs'; // eslint-disable-line

export const same = (t, actual, expected, message) => {
  // writeFileSync('avaTests.js', `
  // Actual:
  //  ${JSON.stringify(actual, null, 2).split("\n").join("\n    ")}
  //
  //  Expected:
  //  ${JSON.stringify(expected, null, 2).split("\n").join("\n    ")}
  //
  // `)

  return t.deepEqual(actual, expected, `

    ${message}

    Actual:
    ${JSON.stringify(actual, null, 2).split('\n').join('\n    ')}

    Expected:
    ${JSON.stringify(expected, null, 2).split('\n').join('\n    ')}

  `);
};
