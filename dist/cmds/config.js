'use strict';

exports.command = 'config <command>';
exports.desc = 'set/get config';
exports.builder = function (yargs) {
    return yargs.commandDir('config_cmds').demandCommand();
};
exports.handler = function (argv) {};
//# sourceMappingURL=config.js.map