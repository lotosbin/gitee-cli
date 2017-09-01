import {load} from "home-config";

const cfg = load('.oschina');

exports.command = 'clone [repository]';
exports.desc = 'set/get config';
exports.builder = yargs => yargs.reset()
// .default({
// })
    .option('owner', {
        default: cfg.core.username,
        description: 'specific repository owner'
    })
    // .demand('reposiotry', 'need specific [repository]')
    .help("h")
    .alias("h", "help");

exports.handler = argv => {
    const repository = argv.repository;
    if (repository)
        if (repository.indexOf('/') > 0) {
            exec('git clone git@git.oschina.net:' + repository);
        } else {
            exec('git clone git@git.oschina.net:' + argv.owner + '/' + repository);
        }
};