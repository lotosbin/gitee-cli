#!/usr/bin/env node
require('shelljs/global');
var cfg = require('home-config').load('.oschina');
var argv = require('yargs')
    .usage('$0 <cmd> [args]')
    .command("clone [repository]", "clone repository from oschina", function (yargs) {
        return yargs.reset()
        // .demand(1, '')
            .option('owner', {
                default: cfg.core.username,
                description: 'specific repository owner'
            })
            .help("h")
            .alias("h", "help");
    }, function (argv) {
        var repository = argv.repository;
        if (repository)
            if (repository.indexOf('/') > 0) {
                exec('git clone git@git.oschina.net:' + repository);
            } else {
                exec('git clone git@git.oschina.net:' + argv.owner + '/' + repository);
            }
    })
    .command('config', '', function (yargs) {
        var argv = yargs.reset()
            .command('set', 'set --key value', function (yargs) {
                var argv = yargs.reset()
                    .option("username", {
                        description: "username on oschina"
                    })
                    .help("h")
                    .alias("h", "help")
                    .demand(1, 'ssss')
                    .argv;
                echo(argv.key)
            })
            .command('get', 'get --key', function (yargs) {
                var argv = yargs.reset()
                    .option("username", {
                        description: "username on oschina"
                    })
                    .help("h")
                    .alias("h", "help")
                    .demand(1, 'www')
                    .argv;
                echo(argv.key)
            })
            .demand(1, '')
            .argv;
        if (argv._[1] === 'set') {
            cfg.core = {
                username: argv.username
            };
            cfg.save();
            console.log('username is set to:' + argv.username);
            return
        }
        if (argv._[1] === 'get') {
            if (argv.username) {
                console.log(cfg.core.username);
                return;
            }
        }
    })
    .example('osc clone oschina-cli', 'clone repoistory from oschina,use ENV OSCHINA_USERNAME to set user on oschina')
    .demand(1, 'Please specify a command')
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2017')
    .argv;


