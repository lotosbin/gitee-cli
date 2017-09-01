const cfg = require('home-config').load('.oschina');

exports.command = 'get';
exports.desc = 'get config';
exports.builder = yargs => yargs
    .option('username', {description: 'username'})
    .option('access_token', {description: 'access_token,get from http://git.oschina.net/profile/account'})
    .help();
exports.handler = function (argv) {
    if (argv.username) {
        console.log(cfg.core.username);
        return;
    }
    if (argv.access_token) {
        console.log(cfg.core.access_token);
        return;
    }
};