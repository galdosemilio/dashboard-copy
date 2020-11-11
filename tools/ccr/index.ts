#!/usr/bin/env node
// tslint:disable
import * as yargs from 'yargs';

const noop = (yargs: yargs.Argv): yargs.Argv => yargs;

import { bundle, bundleOptions } from './bundle';

yargs
  .usage('CoachCare Libraries Script')
  .command(
    'bundle <lib> <version>',
    'Bundle and release a specified library',
    yargs => bundleOptions(yargs),
    args => bundle(args, process.argv.slice(3))
  )
  .help('help')
  .version()
  .option('quiet', { type: 'boolean', hidden: true })
  .demandCommand().argv; // .argv bootstraps the CLI creation;
