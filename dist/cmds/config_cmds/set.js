'use strict';

var cfg = require('home-config').load('.oschina');
if (!cfg.core) {
    cfg.core = {};
}
exports.command = 'set';
exports.desc = 'set config';
exports.builder = function (yargs) {
    return yargs.option('username', { description: 'username' }).option('access_token', { description: 'access_token,get from http://git.oschina.net/profile/account' }).help();
};
exports.handler = function (argv) {
    if (argv.username) {
        cfg.core.username = argv.username;
        cfg.save();
        console.log('username is set to:' + argv.username);
        return;
    }
    if (argv.access_token) {
        cfg.core.access_token = argv.access_token;
        cfg.save();
        console.log('access_token is set to:' + argv.access_token);
        return;
    }
};
//# sourceMappingURL=set.js.map