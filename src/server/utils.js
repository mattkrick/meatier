import zlib from 'zlib'
import promisify from 'es6-promisify';
import fs from 'fs';
import path from 'path';

const readFile = promisify(fs.readFile);
const BUILD_PATH = path.join(__dirname, '..', '..', 'build');

//// TODO This is super ugly
//export async function serveStatic(req, res, next) {
//  console.log('REQ', req.url);
//  if (req.url.indexOf('/static/') === -1) {
//    return next();
//  }
//  const specifier = req.url.replace('/static/', '');
//  const type = specifier.substring(specifier.lastIndexOf('.'));
//  const mimeType = type === '.css' ? 'text/css' : 'text/javascript'
//  const fullPath = path.join(BUILD_PATH, specifier);
//  const data = await readFile(fullPath);
//  write(data, mimeType, res);
//}

export function writeError(msg, res) {
  res.writeHead(500, {'Content-Type': 'text/html'})
  res.write('ERROR!')
  res.end()
}

export function redirect(location, res) {
  res.writeHead(303, {'Location': location})
  res.end()
}

export function writeNotFound(res) {
  res.writeHead(404, {'Content-Type': 'text/html'})
  res.write('Not Found')
  res.end()
}

export function write(string, type, res) {
  zlib.gzip(string, (err, result) => {
    res.writeHead(200, {
      'Content-Length': result.length,
      'Content-Type': type,
      'Content-Encoding': 'gzip'
    })
    res.write(result)
    res.end()
  });
}
