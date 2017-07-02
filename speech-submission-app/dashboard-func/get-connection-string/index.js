const nconf = require('nconf');

nconf
    .argv()
    .env();

module.exports = function (context) {
    context.res = {
        'connectionString': nconf.get('ProfileStorage')
    };

    context.done();
};