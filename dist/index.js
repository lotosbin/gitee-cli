#!/usr/bin/env node
'use strict';

require('shelljs/global');
var shell = require('shelljs');
var cfg = require('home-config').load('.oschina');
var inquirer = require("inquirer");
var _ = require('lodash');

var argv = require('yargs').commandDir('cmds').demandCommand().usage('$0 <cmd> [args]').example('osc clone oschina-cli', 'clone repoistory from oschina').demand(1, 'Please specify a command').help('h').alias('h', 'help').epilog('copyright 2017').argv;
//# sourceMappingURL=index.js.map