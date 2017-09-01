import shelljs from "shelljs/global";
import _ from "lodash";
import inquirer from "inquirer";
import {load} from "home-config";
import shell from "shelljs";

const cfg = load('.oschina');

function git2http(git) {
    if (!git) return git;
    if (/^git\@/.test(git))
        return git.replace(":", "/").replace('git@', 'http://');
    return git;
}

exports.command = 'home';
exports.desc = 'open repository home page';
exports.builder = yargs => yargs.reset()
    .option('remote', {
        default: 'origin',
        description: 'specific remote name'
    })
    .option('choice', {
        description: 'use choice for multi remote'
    })
    .help("h")
    .alias("h", "help");
exports.handler = argv => {
    exec('git remote -v', {silent: true}, (code, stdout, stderr) => {
        if (code !== 0) {
            console.log(stderr);
            shell.exit(1);
            return
        }
        const remotes = stdout.split('\n');
        const map = remotes.map(t => {
            const s = t.split(/[\ \t]/);
            return {name: s[0], url: s[1], http: git2http(s[1]), action: s[2]}
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
};
