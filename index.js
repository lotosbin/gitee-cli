#!/usr/bin/env node
require('shelljs/global');
const shell = require('shelljs');
const cfg = require('home-config').load('.oschina');
const inquirer = require("inquirer");
const _ = require('lodash');

function git2http(git) {
    if (!git) return git;
    if (/^git\@/.test(git))
        return git.replace(":", "/").replace('git@', 'http://');
    return git;
}

const argv = require('yargs')
    .usage('$0 <cmd> [args]')
    .command("clone [repository]", "clone repository from oschina",
        yargs => yargs.reset()
            .option('owner', {
                default: cfg.core.username,
                description: 'specific repository owner'
            })
            .demand(1, 'need specific [repository]')
            .help("h")
            .alias("h", "help"),
        argv => {
            const repository = argv.repository;
            if (repository)
                if (repository.indexOf('/') > 0) {
                    exec('git clone git@git.oschina.net:' + repository);
                } else {
                    exec('git clone git@git.oschina.net:' + argv.owner + '/' + repository);
                }
        })
    .command('config', '',
        yargs => {
            return yargs.reset()
                .command('set', 'set --key value',
                    yargs => yargs.reset()
                        .option("username", {
                            description: "set username on oschina"
                        })
                        .help("h")
                        .alias("h", "help")
                        .demand(1, ''),
                    argv => {
                        if (argv.username) {
                            cfg.core = {
                                username: argv.username
                            };
                            cfg.save();
                            console.log('username is set to:' + argv.username);
                            return
                        }
                    })
                .command('get', 'get --key',
                    yargs => yargs.reset()
                        .option("username", {
                            description: "get username on oschina"
                        })
                        .demand(1, '')
                        .help("h")
                        .alias("h", "help"),
                    argv => {
                        if (argv.username) {
                            console.log(cfg.core.username);
                            return;
                        }
                    })
                .demand(1, 'need set or get command');
        },
        argv => {
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
        }
    )
    .command('home', 'search repository',
        yargs => yargs.reset()
            .option('remote', {
                default: 'origin',
                description: 'specific remote name'
            })
            .option('choice', {
                description: 'use choice for multi remote'
            })
            .help("h")
            .alias("h", "help"),
        argv => {
            exec('git remote -v', {silent: true}, (code, stdout, stderr) => {
                if (code !== 0) {
                    console.log(stderr);
                    shell.exit(1);
                    return
                }
                const remotes = stdout.split('\n');
                const map = remotes.map(t => {
                    const split = t.split(/[\ \t]/);
                    return {name: split[0], url: split[1], http: git2http(split[1]), action: split[2]}
                }).filter(t => t.name);

                const remote = map.filter(t => t.name === argv.remote);
                if (argv.choice) {
                    inquirer
                        .prompt([{
                            type: "list",
                            name: "remote",
                            message: "select remote to open?",
                            choices: _.uniq(map.map(t => t.http))
                        }])
                        .then(answers => {
                            let cmd = 'open ' + git2http(answers.remote);
                            echo(cmd);
                            shell.exec(cmd)
                        })
                } else {
                    let cmd = 'open ' + git2http(remote[0].url);
                    echo(cmd);
                    shell.exec(cmd)
                }
            })
        })
    .example('osc clone oschina-cli', 'clone repoistory from oschina')
    .demand(1, 'Please specify a command')
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2017')
    .argv;


