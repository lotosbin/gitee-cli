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

var argv = require('yargs').commandDir('cmds').demandCommand().usage('$0 <cmd> [args]').command("clone [repository]", "clone repository from oschina", function (yargs) {
    return yargs.reset()
    // .default({
    // })
    .option('owner', {
        default: cfg.core.username,
        description: 'specific repository owner'
    })
    // .demand('reposiotry', 'need specific [repository]')
    .help("h").alias("h", "help");
}, function (argv) {
    var repository = argv.repository;
    if (repository) if (repository.indexOf('/') > 0) {
        exec('git clone git@git.oschina.net:' + repository);
    } else {
        exec('git clone git@git.oschina.net:' + argv.owner + '/' + repository);
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