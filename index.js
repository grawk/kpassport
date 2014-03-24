'use strict';


var kraken = require('kraken-js'),
    app = require('express')(),
    options = require('./lib/spec')(app),
    userLib = require('./lib/user')(),
    passport = require('passport'),
    auth = require('./lib/auth'),
    port = process.env.PORT || 8000;



app.use(kraken(options));

app.on('middleware:before', function(eventargs) {
    if (eventargs.config.name === "router") {
        //Tell passport to use our newly created local strategy for authentication
        passport.use(auth.localStrategy());
        //Give passport a way to serialize and deserialize a user. In this case, by the user's id.
        passport.serializeUser(userLib.serialize);
        passport.deserializeUser(userLib.deserialize);
        app.use(passport.initialize());
        app.use(passport.session());
    }
});

app.listen(port, function(err) {
    console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
});
