#!/usr/bin/env node
import * as yargs from 'yargs';

import { fetch } from './fetch';
import { generate } from './generator';
import { parse } from './parser';

async function run() {
  // fetch the repositories
  await fetch();
  // parse the files
  await parse();
  // generate the services
  await generate();
}

run();

// tslint:disable-next-line:no-unused-expression
// yargs
//   .usage('Backend Script')
//   .command('$0', 'Default command', {}, args => run())
//   .help('help')
//   .version()
//   .option('quiet', { type: 'boolean', hidden: true })
//   .demandCommand().argv; // .argv bootstraps the CLI creation;
