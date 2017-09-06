"use strict";

var _https = require("https");

var _https2 = _interopRequireDefault(_https);

var _querystring = require("querystring");

var _querystring2 = _interopRequireDefault(_querystring);

var _global = require("shelljs/global");

var _global2 = _interopRequireDefault(_global);

var _homeConfig = require("home-config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cfg = (0, _homeConfig.load)('.oschina');

exports.command = 'create [name]';
exports.desc = 'create repository';
exports.builder = function (yargs) {
    return yargs.option('owner', {
        default: cfg.core.username,
        description: 'specific owner'
    });
};
exports.handler = function (argv) {
    echo(argv.owner + '/' + argv.name);
    if (argv.name) {
        create_repository(argv.owner, argv.name, function (data) {
            echo(data);
        });
    }
};

function create_repository(owner, repository_name, success) {
    echo('create_repository');
    performRequest('/api/v5/orgs/' + owner + '/repos', 'POST', {
        access_token: cfg.core.access_token,
        org: owner,
        name: repository_name,
        private: true
    }, success);
}

function performRequest(endpoint, method, data, success) {
    var host = 'git.oschina.net';
    var dataString = JSON.stringify(data);
    var headers = {};

    if (method === 'GET') {
        endpoint += '?' + _querystring2.default.stringify(data);
    } else {
        headers = {
            'Content-Type': 'application/json',
            'Content-Length': dataString.length
        };
    }
    var options = {
        host: host,
        path: endpoint,
        method: method,
        headers: headers
    };
    if (method !== 'GET') {
        options.body = dataString;
    }
    console.log(JSON.stringify(options));
    var req = _https2.default.request(options, function (res) {
        res.setEncoding('utf-8');

        var responseString = '';

        res.on('data', function (data) {
            responseString += data;
        });

        res.on('end', function () {
            console.log(responseString);
            var responseObject = JSON.parse(responseString);
            success(responseObject);
        });
    });

    req.write(dataString);
    req.end();
}
//# sourceMappingURL=create.js.map