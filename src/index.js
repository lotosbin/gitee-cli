#!/usr/bin/env node
require('shelljs/global');
const shell = require('shelljs');
const cfg = require('home-config').load('.oschina');
const inquirer = require("inquirer");
const _ = require('lodash');



const argv = require('yargs')
    .commandDir('cmds')
    .demandCommand()
    .usage('$0 <cmd> [args]')
    .example('osc clone oschina-cli', 'clone repoistory from oschina')
    .demand(1, 'Please specify a command')
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2017')
    .argv;


