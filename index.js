#!/usr/bin/env node
require('shelljs/global');

var argv = require('yargs')
.usage('Usage: osc clone [repository]')
.example('osc clone oschina-cli', 'clone repoistory from oschina,use ENV OSCHINA_USERNAME to set user on oschina')
.help('h')
.alias('h', 'help')
.epilog('copyright 2017')
.argv;

