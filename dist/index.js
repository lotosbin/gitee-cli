#!/usr/bin/env node
'use strict';

require('shelljs/global');
var shell = require('shelljs');
var cfg = require('home-config').load('.oschina');
var inquirer = require("inquirer");
var _ = require('lodash');

function git2http(git) {
    if (!git) return git;
    if (/^git\@/.test(git)) return git.replace(":", "/").replace('git@', 'http://');
    return git;
}

var argv = require('yargs').usage('$0 <cmd> [args]').command("clone [repository]", "clone repository from oschina", function (yargs) {
    return yargs.reset().option('owner', {
        default: cfg.core.username,
        description: 'specific repository owner'
    }).demand(1, 'need specific [repository]').help("h").alias("h", "help");
}, function (argv) {
    var repository = argv.repository;
    if (repository) if (repository.indexOf('/') > 0) {
        exec('git clone git@git.oschina.net:' + repository);
    } else {
        exec('git clone git@git.oschina.net:' + argv.owner + '/' + repository);
    }
}).command('config', '', function (yargs) {
    return yargs.reset().command('set', 'set --key value', function (yargs) {
        return yargs.reset().option("username", {
            description: "set username on oschina"
        }).help("h").alias("h", "help").demand(1, '');
    }, function (argv) {
        if (argv.username) {
            cfg.core = {
                username: argv.username
            };
            cfg.save();
            console.log('username is set to:' + argv.username);
            return;
        }
    }).command('get', 'get --key', function (yargs) {
        return yargs.reset().option("username", {
            description: "get username on oschina"
        }).demand(1, '').help("h").alias("h", "help");
    }, function (argv) {
        if (argv.username) {
            console.log(cfg.core.username);
            return;
        }
    }).demand(1, 'need set or get command');
}, function (argv) {
    if (argv._[1] === 'set') {
        cfg.core = {
            username: argv.username
        };
        cfg.save();
        console.log('username is set to:' + argv.username);
        return;
    }
    if (argv._[1] === 'get') {
        if (argv.username) {
            console.log(cfg.core.username);
            return;
        }
    }
}).command('home', 'search repository', function (yargs) {
    return yargs.reset().option('remote', {
        default: 'origin',
        description: 'specific remote name'
    }).option('choice', {
        description: 'use choice for multi remote'
    }).help("h").alias("h", "help");
}, function (argv) {
    exec('git remote -v', { silent: true }, function (code, stdout, stderr) {
        if (code !== 0) {
            console.log(stderr);
            shell.exit(1);
            return;
        }
        var remotes = stdout.split('\n');
        var map = remotes.map(function (t) {
            var split = t.split(/[\ \t]/);
            return { name: split[0], url: split[1], http: git2http(split[1]), action: split[2] };
        }).filter(function (t) {
            return t.name;
        });

        var remote = map.filter(function (t) {
            return t.name === argv.remote;
        });
        if (argv.choice) {
            inquirer.prompt([{
                type: "list",
                name: "remote",
                message: "select remote to open?",
                choices: _.uniq(map.map(function (t) {
                    return t.http;
                }))
            }]).then(function (answers) {
                var cmd = 'open ' + git2http(answers.remote);
                echo(cmd);
                shell.exec(cmd);
            });
        } else {
            var cmd = 'open ' + git2http(remote[0].url);
            echo(cmd);
            shell.exec(cmd);
        }
    });
}).example('osc clone oschina-cli', 'clone repoistory from oschina').demand(1, 'Please specify a command').help('h').alias('h', 'help').epilog('copyright 2017').argv;
//# sourceMappingURL=index.js.map