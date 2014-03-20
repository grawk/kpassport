'use strict';


var kraken = require('kraken-js'),
    app = require('express')(),
    options = require('./lib/spec')(app),
    db = require('./lib/database'),
    crypto = require('./lib/crypto'),
    User = require('./models/user'),
    passport = require('passport'),
    auth = require('./lib/auth'),
    port = process.env.PORT || 8000;



app.use(kraken({
    "onconfig": function(settings, cb) {
        console.log("app.onconfigure");
        //configure db connection and password crypt difficulty
        var dbConfig = settings.get("databaseConfig"),
            cryptConfig = settings.get("bcrypt");
        db.config(dbConfig);
        crypto.setCryptLevel(cryptConfig.difficulty);

        //add two users
        var u1 = new User({
            name: 'Kraken McSquid',
            login: 'kraken',
            password: 'kraken',
            role: 'admin'
        });

        var u2 = new User({
            name: 'Ash Williams',
            login: 'ash',
            password: 'ash',
            role: 'user'
        });

        //Ignore errors. In this case, the errors will be for duplicate keys as we run this app more than once.
        u1.save();
        u2.save();

        //Tell passport to use our newly created local strategy for authentication
        passport.use(auth.localStrategy());

        //Give passport a way to serialize and deserialize a user. In this case, by the user's id.
        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });

        passport.deserializeUser(function(id, done) {
            User.findOne({
                _id: id
            }, function(err, user) {
                done(null, user);
            });
        });

        cb(null, settings);
    }
}));

app.on('middleware:before', function(eventargs) {
    if (eventargs.config.name === "router") {
        app.use(passport.initialize());
        app.use(passport.session());
    }
});

app.listen(port, function(err) {
    console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
});
