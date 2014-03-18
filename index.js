'use strict';


var kraken = require('kraken-js'),
    app = require('express')(),
    options = require('./lib/spec')(app),
    db = require('./lib/database'),
    crypto = require('./lib/crypto'),
    User = require('./models/user'),

    port = process.env.PORT || 8000;


app.use(kraken({
    "onconfig": function(settings, cb) {
        //configure db connection and password crypt difficulty
        var dbConfig = settings.get("databaseConfig"),
            cryptConfig = settings.get("bcrypt");
        db.config(dbConfig);
        crypto.setCryptLevel(cryptConfig.difficulty);

        //add two users
        var u1 = new User({
            name: 'Kraken McSquid',
            login: 'kraken',
            password: 'releaseMe',
            role: 'admin'
        });

        var u2 = new User({
            name: 'Ash Williams',
            login: 'awilliams',
            password: 'boomstick',
            role: 'user'
        });

        //Ignore errors. In this case, the errors will be for duplicate keys as we run this app more than once.
        u1.save();
        u2.save();
        cb(null, settings);
    }
}));

app.listen(port, function(err) {
    console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
});
