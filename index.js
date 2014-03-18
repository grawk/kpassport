'use strict';


var kraken = require('kraken-js'),
    app = require('express')(),
    options = require('./lib/spec')(app),
    db = require ('./lib/database'),
    port = process.env.PORT || 8000;


app.use(kraken({
    "onconfig": function(settings, cb) {
        var dbConfig = settings.get("databaseConfig");
        db.config(dbConfig);
        cb(null, settings);
    }
}));

app.listen(port, function (err) {
    console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
});
