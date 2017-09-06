import https from "https";

import querystring from "querystring";
import shelljs from "shelljs/global";

import {load} from "home-config";

const cfg = load('.oschina');

exports.command = 'create [name]';
exports.desc = 'create repository';
exports.builder = yargs => yargs.option('owner', {
    default: cfg.core.username,
    description: 'specific owner'
});
exports.handler = argv => {
    echo(argv.owner + '/' + argv.name);
    if (argv.name) {
        create_repository(argv.owner, argv.name, function (data) {
                echo(data);
            }
        )
    }
};

function create_repository(owner, repository_name, success) {
    echo('create_repository')
    performRequest('/api/v5/orgs/' + owner + '/repos', 'POST', {
        access_token: cfg.core.access_token,
        org: owner,
        name: repository_name,
        private: true,
    }, success);
}

function performRequest(endpoint, method, data, success) {
    const host = 'git.oschina.net';
    const dataString = JSON.stringify(data);
    let headers = {};

    if (method === 'GET') {
        endpoint += '?' + querystring.stringify(data);
    }
    else {
        headers = {
            'Content-Type': 'application/json',
            'Content-Length': dataString.length
        };
    }
    const options = {
        host: host,
        path: endpoint,
        method: method,
        headers: headers,
    };
    if (method !== 'GET') {
        options.body = dataString;
    }
    console.log(JSON.stringify(options));
    const req = https.request(options, function (res) {
        res.setEncoding('utf-8');

        let responseString = '';

        res.on('data', function (data) {
            responseString += data;
        });

        res.on('end', function () {
            console.log(responseString);
            const responseObject = JSON.parse(responseString);
            success(responseObject);
        });
    });

    req.write(dataString);
    req.end();
}