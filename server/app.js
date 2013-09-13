var Q = require('../components/microjs-q/q.js'),
    fs = require('fs'),
    restify = require('restify')
    program = require('commander')
;

var pours_pending = 0;

program.option('--dev', 'Development').parse(process.argv);

Q.nfcall(fs.readFile, 'package.json', {encoding: 'UTF-8'}).then(function(data) {
    return JSON.parse(data);
}).then(function(config) {
    var server = restify.createServer({
        name: config.name,
        version: config.version
    });
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.authorizationParser());
    server.use(restify.dateParser());
    server.use(restify.queryParser());
    server.use(restify.jsonp());
    server.use(restify.gzipResponse());
    server.use(restify.bodyParser());
    server.use(restify.throttle({
        burst: 100,
        rate: 50,
        ip: true
    }));
    server.use(restify.conditionalRequest());

    server.post('/checkin', function(req, res, next) {
        res.send();
        pours_pending++;
        next();
    });

    server.get('/drink', function(req, res, next) {
        res.send();
        if (pours_pending) {
            pours_pending--;
            // Dispense
        }
        next();
    });

//    if (program.dev) {
//        server.get('.*', restify.serveStatic({directory: './build', default: "client/index.html"}));
//    }

    server.listen(program.dev ? 8080 : 80, function () {
        console.log('%s listening on %s', server.name, server.url);
    });
}).fail(function(err) {
    console.log(err);
});

