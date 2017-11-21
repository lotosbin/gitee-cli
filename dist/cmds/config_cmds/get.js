'use strict';

var cfg = require('home-config').load('.oschina');

exports.command = 'get';
exports.desc = 'get config';
exports.builder = function (yargs) {
    return yargs.option('username', { description: 'username' }).option('access_token', { description: 'access_token,get from http://gitee.com/profile/account' }).help();
};
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
//# sourceMappingURL=get.js.map