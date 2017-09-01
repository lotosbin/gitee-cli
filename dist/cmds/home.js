"use strict";

var _global = require("shelljs/global");

var _global2 = _interopRequireDefault(_global);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _inquirer = require("inquirer");

var _inquirer2 = _interopRequireDefault(_inquirer);

var _homeConfig = require("home-config");

var _shelljs = require("shelljs");

var _shelljs2 = _interopRequireDefault(_shelljs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cfg = (0, _homeConfig.load)('.oschina');

function git2http(git) {
    if (!git) return git;
    if (/^git\@/.test(git)) return git.replace(":", "/").replace('git@', 'http://');
    return git;
}

exports.command = 'home';
exports.desc = 'open repository home page';
exports.builder = function (yargs) {
    return yargs.reset().option('remote', {
        default: 'origin',
        description: 'specific remote name'
    }).option('choice', {
        description: 'use choice for multi remote'
    }).help("h").alias("h", "help");
};
exports.handler = function (argv) {
    exec('git remote -v', { silent: true }, function (code, stdout, stderr) {
        if (code !== 0) {
            console.log(stderr);
            _shelljs2.default.exit(1);
            return;
        }
        var remotes = stdout.split('\n');
        var map = remotes.map(function (t) {
            var s = t.split(/[\ \t]/);
            return { name: s[0], url: s[1], http: git2http(s[1]), action: s[2] };
        }).filter(function (t) {
            return t.name;
        });

        var remote = map.filter(function (t) {
            return t.name === argv.remote;
        });
        if (argv.choice) {
            _inquirer2.default.prompt([{
                type: "list",
                name: "remote",
                message: "select remote to open?",
                choices: _lodash2.default.uniq(map.map(function (t) {
                    return t.http;
                }))
            }]).then(function (answers) {
                var cmd = 'open ' + git2http(answers.remote);
                echo(cmd);
                _shelljs2.default.exec(cmd);
            });
        } else {
            var cmd = 'open ' + git2http(remote[0].url);
            echo(cmd);
            _shelljs2.default.exec(cmd);
        }
    });
};
//# sourceMappingURL=home.js.map