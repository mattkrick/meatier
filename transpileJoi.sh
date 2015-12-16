#!/bin/bash

transpile()
{
  echo "Transpiling $1"
  babel --presets es2015,stage-0 -d node_modules/$1/tmp/ node_modules/$1/lib
  rm -rf node_modules/$1/lib
  mv node_modules/$1/tmp node_modules/$1/lib
  echo "Transpiling $1 complete"
}

transpile joi
transpile topo
transpile hoek
transpile isemail

