#!/usr/bin/env node
// import * as yargs from 'yargs';

import { merge } from './process';

async function run() {
  // merge the catalogs
  await merge();
}

run();
